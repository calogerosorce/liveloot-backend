const { text } = require('express')
const connection = require('../database/connection')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { sendMail } = require("../services/mailer");
const e = require('express');

const index = (req, res) => {

    const sql = 'SELECT * FROM categories ORDER BY id DESC'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: true, message: err.message })
        res.json(results)
    })
}

const show = async (req, res) => {
    try {
        const rawSlug = req.params.slug || '';

        const slug = decodeURIComponent(rawSlug).trim();


        const sql = `SELECT id, name, description, slug FROM categories WHERE LOWER(slug) = LOWER(?) LIMIT 1`;

        const [rows] = await connection.promise().query(sql, [slug]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Categoria non trovata' });
        }

        const category = rows[0];

        const sqlProducts = 'SELECT id, title, brand, price, description, image, slug_product AS slug FROM products WHERE category_id = ?';
        const [products] = await connection.promise().query(sqlProducts, [category.id]);

        category.tag = products || [];

        return res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const showSingle = async (req, res) => {
    try {
        const rawCategorySlug = req.params.slug || '';
        const categorySlug = decodeURIComponent(rawCategorySlug).trim();

        const rawProductSlug = req.params.slug_product || '';
        const productSlug = decodeURIComponent(rawProductSlug).trim();

        if (!productSlug) return res.status(400).json({ error: 'Slug prodotto non valido' });

        const sqlCategory = 'SELECT id FROM categories WHERE LOWER(slug) = LOWER(?) LIMIT 1';
        const [catRows] = await connection.promise().query(sqlCategory, [categorySlug]);

        if (!catRows || catRows.length === 0) {
            return res.status(404).json({ error: 'Categoria non trovata' });
        }

        const categoryId = catRows[0].id;

        const sqlProduct = 'SELECT id, title, brand, price, description, image, slug_product AS slug FROM products WHERE LOWER(slug_product) = LOWER(?) AND category_id = ? LIMIT 1';
        const [prodRows] = await connection.promise().query(sqlProduct, [productSlug, categoryId]);

        if (!prodRows || prodRows.length === 0) {
            return res.status(404).json({ error: 'Prodotto non trovato' });
        }

        return res.json(prodRows[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const indexAll = (req, res) => {

    const sql = 'SELECT products.id, products.category_id, products.brand, products.title, products.price, products.description, products.image, products.slug_product, categories.name, categories.slug, categories.description AS category_description FROM products JOIN categories ON category_id = categories.id'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: true, message: err.message })
        res.json(results)
    })
}

const searchProducts = async (req, res) => {
    try {
        const products = req.query.search;
        const sortBy = req.query.sortBy; // 'price', 'title' o 'created_at'
        let sort = req.query.sort;       // 'asc' o 'desc'

        let sql = `
            SELECT products.id, products.category_id, products.brand, products.title, products.price, products.description, products.image, products.slug_product, categories.name, categories.slug, categories.description AS category_description
            FROM products
            JOIN categories ON products.category_id = categories.id
        `;
        const params = [];

        // Filtro per ricerca
        if (products && products.trim() !== "") {
            sql += `
                WHERE LOWER(categories.slug) LIKE CONCAT('%', ?, '%')
                   OR LOWER(products.slug_product) LIKE CONCAT('%', ?, '%')
            `;
            params.push(products, products);
        }

        // Ordinamento condizionale
        if (sortBy && (sortBy === 'price' || sortBy === 'title' || sortBy === 'created_at')) {

            // default sort direction = ASC
            if (!sort || (sort.toLowerCase() !== 'asc' && sort.toLowerCase() !== 'desc')) {
                sort = 'asc';
            }

            if (sortBy === 'title') {
                sql += ` ORDER BY LOWER(title) ${sort.toUpperCase()}`;
            } else if (sortBy === 'price') {
                sql += ` ORDER BY price ${sort.toUpperCase()}`;
            } else if (sortBy === 'created_at') {
                sql += ` ORDER BY created_at ${sort.toUpperCase()}`;
            }
        }

        const [rows] = await connection.promise().query(sql, params);

        res.json({
            success: true,
            total: rows.length,
            data: rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};



const order = async (req, res) => {
    console.log('Request body:', req.body);

    const { name, lastname, email, number, address, country, city, province, postalCode, notes, total_price, products } = req.body;

    // Validazione dei campi richiesti
    if (!name || !lastname || !email || !number || !address || !country || !city || !province || !postalCode || !total_price || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            error: true,
            message: 'Campi obbligatori mancanti: name, lastname, email',
            received: { name, lastname, email }
        });
    }



    /* const paymentIntent = await stripe.paymentIntents.create({
        // amount: DA CALCOLARE
        currency: "eur",
        automatic_payment_methods: {
            enabled: true,
        },
    }); */

    // ✅ INVIO EMAIL CON MAILTRAP
    await sendMail({
        to: email || "test@mail.com",
        subject: "Pagamento avviato",
        text: "Il tuo pagamento è stato avviato correttamente.",
        html: `
                <h2>Pagamento avviato</h2>
                <p>Il pagamento è stato creato con successo.</p>
            `


    });


    /*   res.send({
          clientSecret: paymentIntent.client_secret,
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore nel pagamento" });
  } */

    const storeBuyerSql = `INSERT INTO orders
                        (name, lastname, email, number, address, country, city, province, postal_code, notes, total_price)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const buyerValues = [name, lastname, email, number, address, country, city, province, postalCode, notes, total_price];

    connection.query(storeBuyerSql, buyerValues, (err, orderResult) => {
        if (err) {
            return res.status(500).json({ error: true, message: err.message });
        }

        const orderId = orderResult.insertId;

        // Inserimento prodotti nella tabella product_order
        const storeProductsOrderSql = `INSERT INTO product_order
            (product_id, order_id, product_quantity, product_price)
            VALUES ?`;

        // Prepara i valori per l'inserimento multiplo
        const productValues = products.map(product => [
            product.id,
            orderId,
            product.quantity,
            product.price
        ]);

        connection.query(storeProductsOrderSql, [productValues], (err, productResult) => {
            if (err) {
                console.error('Errore durante l\'inserimento dei prodotti nell\'ordine:', err);
                return res.status(500).json({ error: true, message: 'Ordine creato ma errore nell\'inserimento prodotti: ' + err.message });
            }

            res.status(201).json({
                message: "Order created successfully",
                orderId: orderId,
                productsInserted: productResult.affectedRows
            });
        });
    });

}

const recent = (req, res) => {
    const lastThreeSql = `SELECT * FROM products ORDER BY products.created_at DESC`

    connection.query(lastThreeSql, (err, results) => {
        if (err) return res.status(500).json({ error: true, message: err.message })
        res.json(results.slice(0, 3))
    })
}

module.exports = {
    index,
    show,
    indexAll,
    showSingle,
    searchProducts,
    order,
    recent
}