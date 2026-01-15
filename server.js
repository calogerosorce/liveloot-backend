const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 3000
const techsRoute = require('./routers/techs')
const serverError = require('./middlewares/serverError')
const notFound = require('./middlewares/notFound')
const chatBotRouters = require("./routers/chatBotRouters");

app.use(cors({ origin: 'http://localhost:5173' }))

app.use(express.static('public'))

app.use(express.json());

// fallback error-handler per tentare di riparare JSON malformato (temporaneo)
app.use(function (err, req, res, next) {
    if (err && err.type === 'entity.parse.failed') {
        const raw = req.rawBody || '';
        // semplice tentativo di riparazione:
        let repaired = raw
            .replace(/'/g, '"') // singole virgolette → doppie
            .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":') // chiavi non quotate
            .replace(/:\s*([A-Za-z0-9_]+)([,\}])/g, ': "$1"$2'); // valori non quotati

        try {
            req.body = JSON.parse(repaired);
            return next(); // prosegui con la route usando req.body riparato
        } catch (e) {
            console.error('Failed to repair JSON:', repaired, e);
            return res.status(400).json({ error: 'Invalid JSON' });
        }
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`Example app listening on PORT http://localhost:${PORT}`);
})

app.get('/', (req, res) => {
    res.send('Techs app on')
})

app.use("/api/chat", chatBotRouters);

app.use('/techs', techsRoute)



app.use(serverError)
app.use(notFound)