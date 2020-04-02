require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    // res.send('Hello World!');
    res.json('Get Usuario');
});

app.post('/usuario', function(req, res) {
    // res.send('Hello World!');
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json('El nombre es necesario');
    } else {
        res.json({ persona: body });
    }
});

app.put('/usuario/:id', function(req, res) {
    // res.send('Hello World!');
    let id = req.params.id;
    res.json({ id });
});

app.delete('/usuario', function(req, res) {
    // res.send('Hello World!');
    res.json('Get Usuario');
});



app.listen(process.env.PORT, () => {
    console.log('Example app listening on port', process.env.PORT);
});