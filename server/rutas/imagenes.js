const express = require('express');
let { verificaTokenImg } = require('../middlewares/autenticacion');

const fs = require('fs');
const path = require('path');

let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    // let pathImg = `./uploads/${tipo}/${img}`;

    noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${ img }`);
    console.log(pathImg);
    if (fs.existsSync(pathImg)) {
        return res.sendfile(pathImg);
    } else {
        res.sendfile(noImagePath);
    }



});


module.exports = app;