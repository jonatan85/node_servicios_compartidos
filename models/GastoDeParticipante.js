const mongoose = require('mongoose');

const gastoDeParticipantesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Gasto' },
    paid_share: { type: Number, require: true },
    owes_share: { type: Number, require: true},
});

const GastoDeParticipantes = mongoose.model('GastoDeParticipantes', gastoDeParticipantesSchema);

module.exports = GastoDeParticipantes;