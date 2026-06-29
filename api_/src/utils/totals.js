const Pedido = require('../models/Pedido');
const PedidoItem = require('../models/PedidoItem');
const PedidoItemServico = require('../models/PedidoItemServico');

async function recalculatePedidoTotals(pedidoId) {
  try {
    // 1. Get all items of the order
    const items = await PedidoItem.find({ pedido_id: pedidoId });
    
    let pedidoTotal = 0;
    
    for (const item of items) {
      // 2. Get all services for this item
      const itemServices = await PedidoItemServico.find({ pedido_item_id: item._id });
      
      // Calculate sum of services' valor_total
      const servicesTotal = itemServices.reduce((sum, s) => sum + (s.valor_total || 0), 0);
      
      // The item's valor_total is the sum of its services' total values
      item.valor_total = servicesTotal;
      await item.save();
      
      pedidoTotal += item.valor_total;
    }
    
    // Update the Pedido's valor_total
    await Pedido.findByIdAndUpdate(pedidoId, { valor_total: pedidoTotal });
    console.log(`Recalculated totals for Pedido ${pedidoId}: total = R$ ${pedidoTotal}`);
  } catch (error) {
    console.error('Error recalculating totals:', error);
  }
}

module.exports = { recalculatePedidoTotals };
