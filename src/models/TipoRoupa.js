const mongoose = require('mongoose');

const tipoRoupaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('TipoRoupa', tipoRoupaSchema);
