const express = require('express');
const router = express.Router();
const PedidoItem = require('../models/PedidoItem');
const PedidoItemServico = require('../models/PedidoItemServico');
const { recalculatePedidoTotals } = require('../utils/totals');

router.get('/', async (req, res) => {
  try {
    const itens = await PedidoItem.find().populate('pedido_id tipo_roupa_id').lean();
    
    // For each item, find and attach its associated services
    const itensComServicos = await Promise.all(itens.map(async (item) => {
      const servicos = await PedidoItemServico.find({ pedido_item_id: item._id }).populate('servico_id');
      return { ...item, servicos };
    }));
    
    return res.json(itensComServicos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar itens do pedido', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedidoItem = await PedidoItem.findById(req.params.id).populate('pedido_id tipo_roupa_id').lean();
    if (!pedidoItem) {
      return res.status(404).json({ message: 'Pedido item não encontrado' });
    }
    
    const servicos = await PedidoItemServico.find({ pedido_item_id: pedidoItem._id }).populate('servico_id');
    pedidoItem.servicos = servicos;
    
    return res.json(pedidoItem);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar item do pedido', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total } = req.body;
    const pedidoItem = new PedidoItem({ pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total });
    await pedidoItem.save();
    
    // Update order totals
    await recalculatePedidoTotals(pedido_id);
    
    return res.status(201).json(pedidoItem);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar item do pedido', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total } = req.body;
    const itemAtualizado = await PedidoItem.findByIdAndUpdate(
      req.params.id,
      { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total },
      { new: true }
    );
    if (!itemAtualizado) {
      return res.status(404).json({ message: 'Pedido item não encontrado' });
    }
    
    // Update order totals
    await recalculatePedidoTotals(pedido_id);
    
    return res.json(itemAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar item do pedido', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const itemRemovido = await PedidoItem.findById(req.params.id);
    if (!itemRemovido) {
      return res.status(404).json({ message: 'Pedido item não encontrado' });
    }
    
    // Delete the item itself
    await PedidoItem.findByIdAndDelete(req.params.id);
    
    // Cascade delete associated services
    await PedidoItemServico.deleteMany({ pedido_item_id: req.params.id });
    
    // Update order totals
    await recalculatePedidoTotals(itemRemovido.pedido_id);
    
    return res.json({ message: 'Pedido item removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover item do pedido', error: error.message });
  }
});

module.exports = router;
