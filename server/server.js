require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Defino la ruta del public
app.use(require('./rutas/index'));


// parse application/json
app.use(bodyParser.json())



app.use(express.static(path.resolve(__dirname, '../public')));

//mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true }, (err, res) => {
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos online');
});


app.listen(process.env.PORT, () => {
    console.log('Example app listening on port', process.env.PORT);
});