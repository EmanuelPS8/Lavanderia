const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var clientesDB = loadClientes();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nome
 *         - telefone
 *         - email
 *         - cpf_cnpj
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-gerado (UUID) do cliente
 *         nome:
 *           type: string
 *           description: Nome do cliente
 *         telefone:
 *           type: string
 *           description: Telefone do cliente
 *         email:
 *           type: string
 *           description: Email do cliente
 *         cpf_cnpj:
 *           type: string
 *           description: CPF ou CNPJ do cliente
 *         observacoes:
 *           type: string
 *           description: Observações sobre o cliente
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *       example:
 *         id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         nome: "João da Silva"
 *         telefone: "(48) 99999-0000"
 *         email: "joao@email.com"
 *         cpf_cnpj: "123.456.789-00"
 *         observacoes: "Cliente preferencial"
 *         created_at: "2026-04-27T20:00:00.000Z"
 *         updated_at: "2026-04-27T20:00:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Clientes - Emanuel Pereira Schlickmann
 *   description: Gerenciamento de clientes
 */

function loadClientes() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/clientes.json', 'utf8'));
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    return [];
  }
}

function saveClientes() {
  fs.writeFileSync('./src/db/clientes.json', JSON.stringify(clientesDB, null, 2));
}

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Retorna todos os clientes
 *     tags: [Clientes - Emanuel Pereira Schlickmann]
 *     responses:
 *       200:
 *         description: Lista de todos os clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
// GET all clients
router.get('/', (req, res) => {
  clientesDB = loadClientes();
  return res.json(clientesDB);
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Retorna um cliente pelo ID
 *     tags: [Clientes - Emanuel Pereira Schlickmann]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Um cliente pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente não encontrado
 */
// GET client by id
router.get('/:id', (req, res) => {
  clientesDB = loadClientes();
  const cliente = clientesDB.find((c) => c.id === req.params.id);
  if (!cliente) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  return res.json(cliente);
});

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes - Emanuel Pereira Schlickmann]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 */
// POST create client
router.post('/', (req, res) => {
  clientesDB = loadClientes();
  const { nome, telefone, email, cpf_cnpj, observacoes } = req.body;
  const cliente = { id: uuidv4(), nome, telefone, email, cpf_cnpj, observacoes };
  clientesDB.push(cliente);
  saveClientes();
  return res.status(201).json(cliente);
});

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente pelo ID
 *     tags: [Clientes - Emanuel Pereira Schlickmann]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente não encontrado
 */
// PUT update client
router.put('/:id', (req, res) => {
  clientesDB = loadClientes();
  const { nome, telefone, email, cpf_cnpj, observacoes } = req.body;
  const index = clientesDB.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  clientesDB[index] = { ...clientesDB[index], nome, telefone, email, cpf_cnpj, observacoes };
  saveClientes();
  return res.json(clientesDB[index]);
});

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Remove um cliente pelo ID
 *     tags: [Clientes - Emanuel Pereira Schlickmann]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
// DELETE client
router.delete('/:id', (req, res) => {
  clientesDB = loadClientes();
  const index = clientesDB.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  clientesDB.splice(index, 1);
  saveClientes();
  return res.json({ message: 'Cliente removido com sucesso' });
});

module.exports = router;
