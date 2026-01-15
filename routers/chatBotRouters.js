const express = require('express')
const router = express.Router()
const chatBot = require('../controllers/chatBot')

router.post('/', chatBot)

module.exports = router