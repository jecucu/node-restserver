const express = require('express');

let app = express();

app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;