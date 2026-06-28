const express = require('express');
const router = express.Router();
const PedidoItem = require('../models/PedidoItem');

router.get('/', async (req, res) => {
  try {
    const itens = await PedidoItem.find().populate('pedido_id tipo_roupa_id');
    return res.json(itens);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar itens do pedido', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedidoItem = await PedidoItem.findById(req.params.id).populate('pedido_id tipo_roupa_id');
    if (!pedidoItem) {
      return res.status(404).json({ message: 'Pedido item não encontrado' });
    }
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
    return res.json(itemAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar item do pedido', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const itemRemovido = await PedidoItem.findByIdAndDelete(req.params.id);
    if (!itemRemovido) {
      return res.status(404).json({ message: 'Pedido item não encontrado' });
    }
    return res.json({ message: 'Pedido item removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover item do pedido', error: error.message });
  }
});

module.exports = router;
