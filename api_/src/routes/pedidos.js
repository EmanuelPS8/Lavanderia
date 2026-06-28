const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');

router.get('/', async (req, res) => {
  try {
    const { cliente_nome, data } = req.query;
    let query = {};
    if (cliente_nome) {
      const Cliente = require('../models/Cliente');
      const clientes = await Cliente.find({ nome: { $regex: cliente_nome, $options: 'i' } });
      const clienteIds = clientes.map(c => c._id);
      query.cliente_id = { $in: clienteIds };
    }
    if (data) {
      query.data_entrada = {
        $gte: new Date(`${data}T00:00:00.000Z`),
        $lte: new Date(`${data}T23:59:59.999Z`)
      };
    }
    const pedidos = await Pedido.find(query).populate('cliente_id usuario_id');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate('cliente_id usuario_id');
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado!' });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!pedidoAtualizado) {
      return res.status(404).json({ message: 'Pedido não encontrado!' });
    }
    res.json(pedidoAtualizado);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pedidoRemovido = await Pedido.findByIdAndDelete(req.params.id);

    if (!pedidoRemovido) {
      return res.status(404).json({ message: 'Pedido não encontrado!' });
    }
    res.json({ message: 'Pedido removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover pedido', error: error.message });
  }
});

module.exports = router;
