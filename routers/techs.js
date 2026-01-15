const express = require('express')
const router = express.Router()
const techsControl = require('../controllers/techsControl')
const connection = require('../database/connection')
// const mysql = require('mysql2/promise')

router.get('/', techsControl.index)

router.get('/products', techsControl.searchProducts)

router.get('/all', techsControl.indexAll)

router.get('/:slug', techsControl.show)

router.get('/:slug/:slug_product', techsControl.showSingle)

router.post("/create-payment-intent", techsControl.makePayment)



module.exports = router