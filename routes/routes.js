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

router.get('/', async (req, res) => {
    try {
        const search = req.query.search || "";

        const component = await Component.find({
            name: { $regex: search, $options: "i" }
        });

        res.render('index', {
            titulo: 'Inicio',
            component
        });
    } catch (error) {
        res.json({ message: error.message });
    }
});

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

router.get('/edit/:id', async (req, res) => {
    const id= req.params.id;
    try {
        const component = await Component.findById(id);
        if(component == null) {
            res.redirect('/');
        }
        else {
            res.render('editcomponent', { titulo: 'Editar Componente', component: component })
        }
    }
    catch(error) {
        res.status(500).send();
    }
});

router.post('/update/:id', upload, async (req, res) => {
    const id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./upload/' + req.body.old_image);
        } catch (error) {
            console.log(error);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        await Component.findByIdAndUpdate(id, {
            name: req.body.name,
            description: req.body.description,
            amount: req.body.amount,
            price: req.body.price,
            image: new_image
        })
        req.session.message = {
            message: 'Componente editado exitosamente',
            type: 'success'
        };

        res.redirect('/');
    } 
    catch (error) {
        res.json({
            message: error.message, 
            type: 'danger' 
        });
    }
});

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const component = await Component.findByIdAndDelete(id);

        if(component != null && component.image != '') {
            try {
                fs.unlinkSync('./upload/' + component.image);
            }
            catch (error) {
                console.log(error);
            }
        }
        req.session.message = {
            message: 'Componente eliminado exitosamente',
            type: 'info'
        };
        res.redirect('/');
    }
    catch (error) {
        res.json({
            message: error.message, 
            type: 'danger' 
        });
    }
})

module.exports = router;