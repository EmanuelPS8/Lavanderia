const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var usuariosDB = loadUsuarios();

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

function loadUsuarios() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/usuarios.json', 'utf8'));
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    return [];
  }
}

function saveUsuarios() {
  fs.writeFileSync('./src/db/usuarios.json', JSON.stringify(usuariosDB, null, 2));
}

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
router.get('/', (req, res) => {
  usuariosDB = loadUsuarios();
  const { nome, data } = req.query;
  let resultados = usuariosDB;

  if (nome) {
    resultados = resultados.filter(u => 
      u.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  if (data) {
    resultados = resultados.filter(u => 
      u.created_at.includes(data)
    );
  }

  return res.json(resultados);
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
router.get('/:id', (req, res) => {
  usuariosDB = loadUsuarios();
  const usuario = usuariosDB.find(u => u.id === req.params.id);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  return res.json(usuario);
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
router.post('/', (req, res) => {
  usuariosDB = loadUsuarios();
  const { nome, email, senha_hash, perfil, ativo } = req.body;
  
  const novoUsuario = { 
    id: uuidv4(), 
    nome, 
    email, 
    senha_hash, 
    perfil, 
    ativo: ativo ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  usuariosDB.push(novoUsuario);
  saveUsuarios();
  return res.status(201).json(novoUsuario);
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
router.put('/:id', (req, res) => {
  usuariosDB = loadUsuarios();
  const { nome, email, senha_hash, perfil, ativo } = req.body;
  const index = usuariosDB.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  usuariosDB[index] = { 
    ...usuariosDB[index], 
    nome, 
    email, 
    senha_hash, 
    perfil, 
    ativo,
    updated_at: new Date().toISOString()
  };

  saveUsuarios();
  return res.json(usuariosDB[index]);
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
router.delete('/:id', (req, res) => {
  usuariosDB = loadUsuarios();
  const index = usuariosDB.findIndex(u => u.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  usuariosDB.splice(index, 1);
  saveUsuarios();
  return res.json({ message: 'Usuário removido com sucesso' });
});

module.exports = router;