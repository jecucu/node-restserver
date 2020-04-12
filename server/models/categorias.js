const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let categoriasSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        requires: true
    }

});



module.exports = mongoose.model('Categorias', categoriasSchema);