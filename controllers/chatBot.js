const connection = require("../database/connection");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chatbot(req, res) {
    const { message, prodotti, slug } = req.body || {};

    if (!prodotti) {
        return res.status(400).json({ error: 'Missing `prodotti` in request body (select a category)' });
    }
    if (prodotti === 'current product' && !slug) {
        return res.status(400).json({ error: 'Missing `slug` for `current product`' });
    }
    const sql =
        'SELECT products.id, products.title, products.slug_product, products.description, products.image, products.price, categories.name, categories.slug  FROM products JOIN categories ON category_id = categories.id';
    const sqlShow = "SELECT * FROM products WHERE slug_product = ?";
    try {
        let prompt;
        if (prodotti === "current product") {
            const [product] = await connection.promise().query(sqlShow, [slug]);

            if (!product || product.length === 0) {
                return res
                    .status(404)
                    .json({ error: "No products found for this category." });
            }

            prompt = `Sei un maggiordomo di nome Ambrogio, parla formale. 
    Ecco i prodotti disponibili nel nostro catalogo: ${JSON.stringify(product)}.
    Rispondi in italiano alla seguente domanda dell'utente, usando i dati dei prodotti sopra elencati: ${message}.
    Rispondi usando Markdown semplice. Usa il grassetto solo per i nomi dei prodotti.`;

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            res.json({ reply: text });
        } else if (prodotti === "product comparison") {
            const [products] = await connection.promise().query(sql);

            if (!products || products.length === 0) {
                return res
                    .status(404)
                    .json({ error: "No products found for this category." });
            }

            prompt = `Sei un maggiordomo di nome Ambrogio, parla formale. 
    Ecco i prodotti disponibili nel nostro catalogo: ${JSON.stringify(products)}.
    Rispondi in italiano alla seguente domanda dell'utente, usando i dati dei prodotti sopra elencati: ${message}.
    Rispondi usando Markdown semplice. Usa il grassetto solo per i nomi dei prodotti.`;

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            res.json({ reply: text });
        }
    } catch (error) {
        console.error("Errore Gemini API:", error);
        res
        console.error("Errore Gemini API:", error && error.stack ? error.stack : error);
        res.status(500).json({ error: error && error.message ? error.message : "Errore durante la generazione della risposta" });
    }
}

module.exports = chatbot;