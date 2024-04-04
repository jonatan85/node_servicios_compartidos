const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    payer: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios'}],
    settle: { type: Boolean, default: false },

}, {
    timestamps: true
});

const Gasto = mongoose.model('Gasto', gastoSchema);

module.exports = Gasto;
