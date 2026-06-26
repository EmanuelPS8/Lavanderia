const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha_hash
 *         - perfil
 *         - ativo
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-gerado (UUID)
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         senha_hash:
 *           type: string
 *         perfil:
 *           type: string
 *         ativo:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios - Francielle Ferrari
 *   description: Gerenciamento de usuários do sistema
 */

// Removido fs.readFileSync e writeFileSync

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna todos os usuários (permite filtrar por nome ou data)
 *     tags: [Usuarios - Francielle Ferrari]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por parte do nome
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por data de criação (AAAA-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
// GET all users (com filtros de nome e data)
router.get('/', async (req, res) => {
  try {
    const { nome, data } = req.query;
    let query = {};
    if (nome) {
      query.nome = { $regex: nome, $options: 'i' };
    }
    if (data) {
      // Simplificação: buscar por data exata considerando formato ISO. 
      // Pode precisar ajuste dependendo do uso exato, mas funciona para AAAA-MM-DD
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

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuarios - Francielle Ferrari]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 */
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

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuarios - Francielle Ferrari]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário criado
 */
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

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Usuarios - Francielle Ferrari]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 */
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

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Usuarios - Francielle Ferrari]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário removido
 *       404:
 *         description: Usuário não encontrado
 */
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

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Autentica um usuário no sistema
 *     tags: [Usuarios - Francielle Ferrari]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso
 *       401:
 *         description: E-mail ou senha incorretos
 *       500:
 *         description: Erro no servidor
 */
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