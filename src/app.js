require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const router = require('../routes/routes');

const PORT = process.env.PORT || 3000


mongoose.connect(process.env.DB_URI)
const db = mongoose.connection;
db.on('error', (error) => console.log (error));
db.once('open', () => console.log('Connected to Database'));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.session = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('upload'));


app.set('view engine', 'ejs');
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server iniciado en http://localhost:${PORT}`);
});