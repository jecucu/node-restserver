const express = require('express');

let app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categorias'));
app.use(require('./productos'));
app.use(require('./uploads'));
app.use(require('./imagenes'));

module.exports = app;