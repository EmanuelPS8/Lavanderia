const express = require('express');
const router = express.Router();
const PedidoItemServico = require('../models/PedidoItemServico');

router.get('/', async (req, res) => {
  try {
    const itens = await PedidoItemServico.find().populate('pedido_item_id servico_id');
    return res.json(itens);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar pedido item servicos', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await PedidoItemServico.findById(req.params.id).populate('pedido_item_id servico_id');
    if (!item) {
      return res.status(404).json({ message: 'Pedido item servico não encontrado' });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar pedido item servico', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { pedido_item_id, servico_id, preco_unitario, quantidade } = req.body;
    const valor_total = preco_unitario * quantidade;
    const item = new PedidoItemServico({ pedido_item_id, servico_id, preco_unitario, quantidade, valor_total });
    await item.save();
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar pedido item servico', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { pedido_item_id, servico_id, preco_unitario, quantidade } = req.body;
    const valor_total = preco_unitario * quantidade;
    const itemAtualizado = await PedidoItemServico.findByIdAndUpdate(
      req.params.id,
      { pedido_item_id, servico_id, preco_unitario, quantidade, valor_total },
      { new: true }
    );
    if (!itemAtualizado) {
      return res.status(404).json({ message: 'Pedido item servico não encontrado' });
    }
    return res.json(itemAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar pedido item servico', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const itemRemovido = await PedidoItemServico.findByIdAndDelete(req.params.id);
    if (!itemRemovido) {
      return res.status(404).json({ message: 'Pedido item servico não encontrado' });
    }
    return res.json({ message: 'Pedido item servico removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover pedido item servico', error: error.message });
  }
});

module.exports = router;
