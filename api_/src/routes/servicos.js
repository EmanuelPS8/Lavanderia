const express = require('express');
const router = express.Router();
const Servico = require('../models/Servico');

router.get('/', async (req, res) => {
  try {
    const { nome, data } = req.query;
    let query = {};
    if (nome) {
      query.nome = { $regex: nome, $options: 'i' };
    }
    if (data) {
      query.created_at = {
        $gte: new Date(`${data}T00:00:00.000Z`),
        $lte: new Date(`${data}T23:59:59.999Z`)
      };
    }
    const servicos = await Servico.find(query);
    return res.json(servicos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar serviços', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    return res.json(servico);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar serviço', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, preco, descricao, ativo } = req.body;
    const servico = new Servico({ nome, preco, descricao, ativo });
    await servico.save();
    return res.status(201).json(servico);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar serviço', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, preco, descricao, ativo } = req.body;
    const servicoAtualizado = await Servico.findByIdAndUpdate(
      req.params.id,
      { nome, preco, descricao, ativo },
      { new: true }
    );
    if (!servicoAtualizado) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    return res.json(servicoAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar serviço', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const servicoRemovido = await Servico.findByIdAndDelete(req.params.id);
    if (!servicoRemovido) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    return res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover serviço', error: error.message });
  }
});

module.exports = router;
