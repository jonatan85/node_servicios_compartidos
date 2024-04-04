const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nick: { type: String },
    fotoPerfil: { type: String },
    amigos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
},{ 
    timestamps: true 
});


const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;