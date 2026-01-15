const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 3000
const techsRoute = require('./routers/techs')
const errorServer = require('./middlewares/serverError')
const notFound = require('./middlewares/notFound')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({ origin: 'http://localhost:5173' }))

app.use(express.static('public'))

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Example app listening on PORT http://localhost:${PORT}`);
})

app.get('/', (req, res) => {
    res.send('Techs app on')
})

app.use('/techs', techsRoute)

app.use(errorServer)
app.use(notFound)