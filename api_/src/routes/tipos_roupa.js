const express = require('express');
const router = express.Router();
const TipoRoupa = require('../models/TipoRoupa');

router.get('/', async (req, res) => {
  try {
    const tipos = await TipoRoupa.find();
    return res.json(tipos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar tipos de roupa', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const busca = req.params.id;
    let query = { $or: [{ nome: { $regex: busca, $options: 'i' } }] };
    if (busca.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: busca });
    }

    const resultados = await TipoRoupa.find(query);

    if (resultados.length === 0) {
      return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
    }
    return res.json(resultados[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar tipo de roupa', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const novoTipo = new TipoRoupa({ nome, descricao });
    await novoTipo.save();
    return res.status(201).json(novoTipo);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar tipo de roupa', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const tipoAtualizado = await TipoRoupa.findByIdAndUpdate(
      req.params.id,
      { nome, descricao },
      { new: true }
    );

    if (!tipoAtualizado) {
      return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
    }
    return res.json(tipoAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar tipo de roupa', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tipoRemovido = await TipoRoupa.findByIdAndDelete(req.params.id);

    if (!tipoRemovido) {
      return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
    }
    return res.json({ message: 'Tipo de roupa removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover tipo de roupa', error: error.message });
  }
});

module.exports = router;
