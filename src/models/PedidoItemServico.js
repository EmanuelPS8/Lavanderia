const mongoose = require('mongoose');

const pedidoItemServicoSchema = new mongoose.Schema({
  pedido_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PedidoItem', required: true },
  servico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico', required: true },
  preco_unitario: { type: Number, required: true },
  quantidade: { type: Number, required: true, default: 1 },
  valor_total: { type: Number, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('PedidoItemServico', pedidoItemServicoSchema);
