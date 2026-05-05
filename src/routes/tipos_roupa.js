const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const PATH_DB = './src/db/tipos_roupa.json';

var tiposRoupaDB = loadTiposRoupa();

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoRoupa:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-gerado (UUID) do tipo de roupa
 *         nome:
 *           type: string
 *           description: Nome da categoria (ex. Camiseta, Calça Jeans)
 *         descricao:
 *           type: string
 *           description: Detalhes sobre como lavar ou identificar o tipo
 *       example:
 *         id: "1a2b3c4d-5678-90ab-cdef-1234567890ab"
 *         nome: "Camisa"
 *         descricao: "Peça de roupa para a parte superior do corpo."
 */

/**
 * @swagger
 * tags:
 *   name: Tipos de Roupa - Gabriel Figueredo
 *   description: Gerenciamento das categorias de roupas da lavanderia
 */

function loadTiposRoupa() {
  try {
    return JSON.parse(fs.readFileSync(PATH_DB, 'utf8'));
  } catch (error) {
    console.error('Erro ao carregar tipos de roupa:', error);
    return [];
  }
}

function saveTiposRoupa() {
  fs.writeFileSync(PATH_DB, JSON.stringify(tiposRoupaDB, null, 2));
}

/**
 * @swagger
 * /tipos-roupa:
 *   get:
 *     summary: Retorna todos os tipos de roupa
 *     tags: [Tipos de Roupa - Gabriel Figueredo]
 *     responses:
 *       200:
 *         description: Lista de todos os tipos cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoRoupa'
 */
router.get('/', (req, res) => {
  tiposRoupaDB = loadTiposRoupa();
  return res.json(tiposRoupaDB);
});

/**
 * @swagger
 * /tipos-roupa/{id}:
 *   get:
 *     summary: Retorna um tipo de roupa pelo ID ou Nome
 *     tags: [Tipos de Roupa - Gabriel Figueredo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID ou Nome para busca
 *     responses:
 *       200:
 *         description: Dados do tipo de roupa
 *       404:
 *         description: Tipo de roupa não encontrado
 */
router.get('/:id', (req, res) => {
  tiposRoupaDB = loadTiposRoupa();
  const busca = req.params.id.toLowerCase();

  const resultado = tiposRoupaDB.find((t) => t.id === req.params.id || t.nome.toLowerCase().includes(busca));

  if (!resultado) {
    return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
  }
  return res.json(resultado);
});

/**
 * @swagger
 * /tipos-roupa:
 *   post:
 *     summary: Cria um novo tipo de roupa
 *     tags: [Tipos de Roupa - Gabriel Figueredo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoRoupa'
 *     responses:
 *       201:
 *         description: Tipo de roupa criado com sucesso
 */
router.post('/', (req, res) => {
  tiposRoupaDB = loadTiposRoupa();
  const { nome, descricao } = req.body;

  const novoTipo = {
    id: uuidv4(),
    nome,
    descricao,
  };

  tiposRoupaDB.push(novoTipo);
  saveTiposRoupa();
  return res.status(201).json(novoTipo);
});

/**
 * @swagger
 * /tipos-roupa/{id}:
 *   put:
 *     summary: Atualiza um tipo de roupa pelo ID
 *     tags: [Tipos de Roupa - Gabriel Figueredo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tipo de roupa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoRoupa'
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
router.put('/:id', (req, res) => {
  tiposRoupaDB = loadTiposRoupa();
  const { nome, descricao } = req.body;
  const index = tiposRoupaDB.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
  }

  tiposRoupaDB[index] = { ...tiposRoupaDB[index], nome, descricao };
  saveTiposRoupa();
  return res.json(tiposRoupaDB[index]);
});

/**
 * @swagger
 * /tipos-roupa/{id}:
 *   delete:
 *     summary: Remove um tipo de roupa pelo ID
 *     tags: [Tipos de Roupa - Gabriel Figueredo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tipo de roupa
 *     responses:
 *       200:
 *         description: Removido com sucesso
 */
router.delete('/:id', (req, res) => {
  tiposRoupaDB = loadTiposRoupa();
  const index = tiposRoupaDB.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
  }

  tiposRoupaDB.splice(index, 1);
  saveTiposRoupa();
  return res.json({ message: 'Tipo de roupa removido com sucesso' });
});

module.exports = router;
