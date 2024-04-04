const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupname: { type: String, require: true },
    img: {type: String},
    miembros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'}],
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'}
},{
    timestamps: true
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;