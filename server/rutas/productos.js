const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/productos');

app.get('/productos/buscar/:termino', [verificaToken], (req, res) => {
    let params = req.params;
    let desde = parseInt(req.query.desde, 10) || 0;
    let limite = Number(req.query.limite) || 5;
    let terminoRegex = new RegExp(params.termino, 'i');
    if (params) {
        Producto.find({ disponible: true, nombre: terminoRegex })
            .skip(desde)
            .limit(limite)
            .sort('nombre')
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, productosDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!productosDB) {
                    return res.status(400).json({
                        ok: false,
                        message: 'No se pudo obtener el producto'
                    });
                }
                res.json({
                    ok: true,
                    producto: productosDB
                })
            })

    }
});

app.get('/productos', [verificaToken], (req, res) => {
    let desde = parseInt(req.query.desde, 10) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productosDB) {
                return res.json({
                    ok: false,
                    message: 'No se pudo obtener prductos'
                });
            }
            res.json({
                ok: true,
                productosDB
            });

        })


})

app.get('/productos/:id', [verificaToken], (req, res) => {
    let params = req.params;
    if (params.id) {
        Producto.findById(params.id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, productosDB) => {
                if (err) {
                    return req.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!productosDB) {
                    return res.status(400).json({
                        ok: false,
                        message: 'No se pudo obtener prductos'
                    })
                }

                res.json({
                    ok: true,
                    producto: productosDB
                });


            })
    }
})

app.post('/productos', [verificaToken], (req, res) => {
    let body = req.body;
    if (body) {
        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: body.categoria,
            usuario: req.usuario
        });

        producto.save(producto, (err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productosDB) {
                return res.json({
                    ok: false,
                    message: 'No se creo el producto'
                });
            }
            res.json({
                ok: true,
                productosDB
            });

        });

    }

})

app.put('/productos/:id', [verificaToken], (req, res) => {
    let params = req.params;
    let body = req.body;
    if (params.id) {
        let prod = {
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
        }
        Producto.findByIdAndUpdate(params.id, prod, (err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo actualizar el producto'
                });
            }
            res.json({
                ok: true,
                producto: productosDB
            })

        });

    }
});

app.delete('/productos/:id', [verificaToken], (req, res) => {
    let params = req.params;
    if (params.id) {
        Producto.findByIdAndUpdate(params.id, { disponible: false }, { new: true }, (err, productosDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productosDB) {
                return res.status.json({
                    ok: false,
                    message: 'No se pudo borrar el producto'
                });
            }

            res.json({
                ok: true,
                producto: productosDB
            });

        })
    }
})





module.exports = app;