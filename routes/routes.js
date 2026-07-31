const express = require('express');
const router = express.Router();
const Component = require('../models/components');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpetaUpload = path.join(__dirname, '../upload');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, carpetaUpload)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

var upload = multer({ storage: storage }).single('image');

router.get('/add', (req, res) => {
    res.render('addcomponent', { titulo: 'Agregar Componente' });
});


router.post('/add', upload, async (req, res) => {
    const component = new Component ({
        name: req.body.name,
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price,
        image: req.file.filename
    });

    component.save().then(() => {
        req.session.message = {
            message: 'Componente agregado exitosamente',
            type: 'success'
        };
    
    res.redirect('/');
    }).catch((error) => {
        res.json({
            message: error.message, 
            type: 'danger' });
    });
});

module.exports = router;