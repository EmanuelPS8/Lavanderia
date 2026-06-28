const mongoose = require('mongoose');

const pedidoItemSchema = new mongoose.Schema({
  pedido_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
  tipo_roupa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoRoupa', required: true },
  quantidade: { type: Number, required: true, default: 1 },
  descricao: { type: String },
  status: { type: String, default: 'pendente' },
  valor_total: { type: Number, default: 0 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('PedidoItem', pedidoItemSchema);
