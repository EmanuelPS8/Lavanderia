const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

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
    const usuarios = await Usuario.find(query);
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, email, senha_hash, perfil, ativo } = req.body;
    const novoUsuario = new Usuario({
      nome, 
      email, 
      senha_hash, 
      perfil, 
      ativo: ativo ?? true
    });
    await novoUsuario.save();
    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, email, senha_hash, perfil, ativo } = req.body;
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nome, email, senha_hash, perfil, ativo },
      { new: true }
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    return res.json(usuarioAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const usuarioRemovido = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioRemovido) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    return res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover usuário', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }
    if (!usuario.ativo) {
      return res.status(401).json({ message: 'Usuário inativo no sistema' });
    }
    if (usuario.senha_hash !== senha) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }
    return res.json({
      message: 'Login efetuado com sucesso',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao efetuar login', error: error.message });
  }
});

module.exports = router;
