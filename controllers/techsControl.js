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

        const sqlProducts = 'SELECT id, title, brand, price, description, image, slug FROM products WHERE category_id = ?';
        const [products] = await connection.promise().query(sqlProducts, [category.id]);

        category.tag = products || [];

        return res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    index,
    show
}