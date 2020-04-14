const express = require('express');

const Usuario = require('../models/usuario');
const Producto = require('../models/productos');

const fs = require('fs');
const path = require('path');


let fileUpload = require('express-fileupload');

let app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id?', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos
            }
        });
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    console.log(nombreCortado, extension);

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    console.log('traza1');
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones válidas son ' + extensionesValidas
            }
        })
    }
    console.log('traza2');
    // Cambiar nombre del archivo
    let NombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${NombreArchivo}`, (err) => {
        console.log('traza2.1');
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        console.log('traza2.2');
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, NombreArchivo);
        }
        console.log('traza2.3');
        if (tipo === 'productos') {
            imagenProducto(id, res, NombreArchivo);
        }

    });
})

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no fue encontrado'
                }
            })
        }

        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                borrarArchivo(nombreArchivo, 'productos');
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })

        })

    })
}

function imagenUsuario(id, res, NombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = NombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                borrarArchivo(nombreArchivo, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: NombreArchivo
            });
        })
    })
}

function borrarArchivo(NombreImagen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${ NombreImagen }`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }

}

module.exports = app;