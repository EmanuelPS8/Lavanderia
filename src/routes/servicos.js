const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var servicosDB = loadServicos();

/**
 * @swagger
 * components:
 *   schemas:
 *     Servico:
 *       type: object
 *       required:
 *         - nome
 *         - preco
 *         - descricao
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-gerado (UUID) do serviço
 *         nome:
 *           type: string
 *           description: Nome do serviço
 *         preco:
 *           type: number
 *           description: Preço do serviço
 *         descricao:
 *           type: string
 *           description: Descrição do serviço
 *       example:
 *         id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         nome: "Lavagem"
 *         preco: 10.00
 *         descricao: "Lavagem do veículo"
 */

/**
 * @swagger
 * tags:
 *   name: Serviços
 *   description: Gerenciamento de serviços
 */

function loadServicos() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/servicos.json', 'utf8'));
  } catch (error) {
    console.error('Erro ao carregar servicos:', error);
    return [];
  }
}

function saveServicos() {
  fs.writeFileSync('./src/db/servicos.json', JSON.stringify(servicosDB, null, 2));
}

/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Retorna todos os serviços
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de todos os serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 */
//GET all services
router.get('/', (req, res) => {
  servicosDB = loadServicos();
  return res.json(servicosDB);
});

/**
 * @swagger
 * /servicos/{id}:
 *   get:
 *     summary: Retorna um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Um serviço pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       404:
 *         description: Serviço não encontrado
 */
//GET service by id
router.get('/:id', (req, res) => {
  servicosDB = loadServicos();
  const servico = servicosDB.find((s) => s.id === req.params.id);
  if (!servico) {
    return res.status(404).json({ message: 'Serviço não encontrado' });
  }
  return res.json(servico);
});

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servico'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 */
//POST create service
router.post('/', (req, res) => {
  servicosDB = loadServicos();
  const { nome, preco, descricao } = req.body;
  const servico = { id: uuidv4(), nome, preco, descricao };
  servicosDB.push(servico);
  saveServicos();
  return res.status(201).json(servico);
});

/**
 * @swagger
 * /servicos/{id}:
 *   put:
 *     summary: Atualiza um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servico'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       404:
 *         description: Serviço não encontrado
 */
//PUT update service
router.put('/:id', (req, res) => {
  servicosDB = loadServicos();
  const { nome, preco, descricao } = req.body;
  const index = servicosDB.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Serviço não encontrado' });
  }
  servicosDB[index] = { ...servicosDB[index], nome, preco, descricao };
  saveServicos();
  return res.json(servicosDB[index]);
});

/**
 * @swagger
 * /servicos/{id}:
 *   delete:
 *     summary: Remove um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Serviço removido com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
//DELETE service
router.delete('/:id', (req, res) => {
  servicosDB = loadServicos();
  const index = servicosDB.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Serviço não encontrado' });
  }
  servicosDB.splice(index, 1);
  saveServicos();
  return res.json({ message: 'Serviço removido com sucesso' });
});

module.exports = router;