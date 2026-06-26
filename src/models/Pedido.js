const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  status: { type: String, default: 'pendente' },
  data_entrada: { type: Date, default: Date.now },
  data_prevista: { type: Date },
  data_saida: { type: Date },
  valor_total: { type: Number, default: 0 },
  observacoes: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
