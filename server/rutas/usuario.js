const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario')
const _ = require("underscore");

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    let filtro = { estado: true };

    Usuario.find(filtro, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: 'false',
                    err
                });
            }
            Usuario.count({ new: true, runValidators: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })


        });

});

app.post('/usuario', function(req, res) {
    // res.send('Hello World!');
    let body = req.body;
    if (body) {
        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        usuario.save((err, usuarioDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            });

        })

    }
});

app.put('/usuario/:id', function(req, res) {
    // res.send('Hello World!');
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    if (body) {
        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            });

        });
    }

});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = { estado: false };

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            console.log('traza2');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        console.log('traza3');
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });

});

module.exports = app;