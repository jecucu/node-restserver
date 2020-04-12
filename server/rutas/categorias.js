const express = require('express');

let { verificaToken, verificaUsuario } = require('../middlewares/autenticacion');

let app = express();

let Categorias = require('../models/categorias');

const bcrypt = require('bcrypt');

//Muestra todas las categorias
app.get('/categoria', [verificaToken], (req, res) => {

    Categorias.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo obtener datos de categorias'
                });
            }
            res.json({
                ok: true,
                categoria: categoriasDB
            })
        });

});

app.get('/categoria/:id', [verificaToken], (req, res) => {
    let params = req.params;

    Categorias.findById(params.id, (err, categoriasDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al buscar la categoria'
            });
        }
        res.json({
            ok: true,
            categoria: categoriasDB
        });
    })

});

app.post('/categoria', [verificaToken], (req, res) => {
    let body = req.body;
    console.log(req);
    if (body) {

        let categ = new Categorias({
            nombre: body.nombre,
            usuario: req.usuario._id,
            estado: body.estado
        });

        categ.save((err, categoriasDB) => {
            if (err) {
                return res.status(600).json({
                    ok: false,
                    err
                });
            }

            if (!categoriasDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al crear categoria'
                });
            }

            res.json({
                ok: true,
                categorias: categoriasDB
            });

        });
    }
});



app.put('/categoria/:id', [verificaToken], (req, res) => {
    let params = req.params;
    let body = req.body;
    console.log('traza1', body);
    if (params.id) {
        console.log('traza2', body);
        Categorias.findByIdAndUpdate(params.id, { nombre: body.nombre }, { new: true, runValidators: true }, (err, categoriasDB) => {
            console.log('traza3', body);
            if (err) {
                console.log('traza4', body);
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo actualizar la categoria'
                });
            }
            console.log('traza5');
            if (!categoriasDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al crear categoria'
                });
            }
            res.json({
                ok: true,
                categoria: categoriasDB
            });

        });
    }
});

// Solo un administrador puede borrar la categoria
app.delete('/categoria/:id', [verificaToken, verificaUsuario], (req, res) => {
    let params = req.params;
    console.log('Traza1');
    if (params.id) {
        console.log('Traza2');
        Categorias.findByIdAndUpdate(params.id, { estado: false }, { new: true }, (err, categoriasDB) => {
            console.log('Traza3');
            if (err) {
                console.log('Traza4');
                return res.status(400).json({
                    ok: false,
                    message: 'Error al intentar borrar la categoria'
                });
            }
            if (!categoriasDB) {
                console.log('Traza5');
                res.status(400).json({
                    ok: false,
                    message: 'No se encontro el registro a borrar'
                });
            }

            console.log('respuesta', categoriasDB);
            res.json({
                ok: true,
                categoria: categoriasDB
            });
        });

    }


});

module.exports = app;