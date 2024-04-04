const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    payer: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, {
    timestamps: true
});


const Transaccion = mongoose.model('Transaccion', transactionSchema);

module.exports = Transaccion;