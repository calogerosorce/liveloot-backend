const { text } = require('express')
const connection = require('../database/connection')

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

    const sql = 'SELECT products.id, products.category_id, products.brand, products.title, products.price, products.description, products.image, categories.name, categories.slug, categories.description AS category_description FROM products JOIN categories ON category_id = categories.id'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: true, message: err.message })
        res.json(results)
    })
}

module.exports = {
    index,
    show,
    indexAll,
    showSingle
}