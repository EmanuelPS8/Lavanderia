const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String },
  email: { type: String },
  cpf_cnpj: { type: String },
  observacoes: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Cliente', clienteSchema);
