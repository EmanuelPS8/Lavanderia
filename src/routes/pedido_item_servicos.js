const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var pedidoItemServicosDB = loadPedidoItemServicos();

/**
 * @swagger
 * components:
 *   schemas:
 *     PedidoItemServico:
 *       type: object
 *       required:
 *         - pedido_item_id
 *         - servico_id
 *         - preco_unitario
 *         - quantidade
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-gerado (UUID) do pedido item servico
 *         pedido_item_id:
 *           type: string
 *           description: ID do item do pedido associado
 *         servico_id:
 *           type: string
 *           description: ID do serviço associado
 *         preco_unitario:
 *           type: number
 *           format: double
 *           description: Preço unitário do serviço
 *         quantidade:
 *           type: integer
 *           description: Quantidade do serviço
 *         valor_total:
 *           type: number
 *           format: double
 *           description: Valor total (preco_unitario x quantidade)
 *       example:
 *         id: "f1e2d3c4-b5a6-7890-abcd-ef1234567890"
 *         pedido_item_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         servico_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *         preco_unitario: 25.50
 *         quantidade: 2
 *         valor_total: 51.00
 */

/**
 * @swagger
 * tags:
 *   name: PedidoItemServicos - Emanuel Pereira Schlickmann
 *   description: Gerenciamento de serviços dos itens de pedido
 */

function loadPedidoItemServicos() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/pedido_item_servicos.json', 'utf8'));
  } catch (error) {
    console.error('Erro ao carregar pedido item servicos:', error);
    return [];
  }
}

function savePedidoItemServicos() {
  fs.writeFileSync('./src/db/pedido_item_servicos.json', JSON.stringify(pedidoItemServicosDB, null, 2));
}

/**
 * @swagger
 * /pedido-item-servicos:
 *   get:
 *     summary: Retorna todos os pedido item servicos
 *     tags: [PedidoItemServicos - Emanuel Pereira Schlickmann]
 *     responses:
 *       200:
 *         description: Lista de todos os pedido item servicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PedidoItemServico'
 */
// GET all pedido item servicos
router.get('/', (req, res) => {
  pedidoItemServicosDB = loadPedidoItemServicos();
  return res.json(pedidoItemServicosDB);
});

/**
 * @swagger
 * /pedido-item-servicos/{id}:
 *   get:
 *     summary: Retorna um pedido item servico pelo ID
 *     tags: [PedidoItemServicos - Emanuel Pereira Schlickmann]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido item servico
 *     responses:
 *       200:
 *         description: Um pedido item servico pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoItemServico'
 *       404:
 *         description: Pedido item servico não encontrado
 */
// GET pedido item servico by id
router.get('/:id', (req, res) => {
  pedidoItemServicosDB = loadPedidoItemServicos();
  const item = pedidoItemServicosDB.find((p) => p.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Pedido item servico não encontrado' });
  }
  return res.json(item);
});

/**
 * @swagger
 * /pedido-item-servicos:
 *   post:
 *     summary: Cria um novo pedido item servico
 *     tags: [PedidoItemServicos - Emanuel Pereira Schlickmann]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoItemServico'
 *     responses:
 *       201:
 *         description: Pedido item servico criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoItemServico'
 */
// POST create pedido item servico
router.post('/', (req, res) => {
  pedidoItemServicosDB = loadPedidoItemServicos();
  const { pedido_item_id, servico_id, preco_unitario, quantidade } = req.body;
  const valor_total = preco_unitario * quantidade;
  const item = { id: uuidv4(), pedido_item_id, servico_id, preco_unitario, quantidade, valor_total };
  pedidoItemServicosDB.push(item);
  savePedidoItemServicos();
  return res.status(201).json(item);
});

/**
 * @swagger
 * /pedido-item-servicos/{id}:
 *   put:
 *     summary: Atualiza um pedido item servico pelo ID
 *     tags: [PedidoItemServicos - Emanuel Pereira Schlickmann]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido item servico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoItemServico'
 *     responses:
 *       200:
 *         description: Pedido item servico atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoItemServico'
 *       404:
 *         description: Pedido item servico não encontrado
 */
// PUT update pedido item servico
router.put('/:id', (req, res) => {
  pedidoItemServicosDB = loadPedidoItemServicos();
  const { pedido_item_id, servico_id, preco_unitario, quantidade } = req.body;
  const index = pedidoItemServicosDB.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pedido item servico não encontrado' });
  }
  const valor_total = preco_unitario * quantidade;
  pedidoItemServicosDB[index] = { ...pedidoItemServicosDB[index], pedido_item_id, servico_id, preco_unitario, quantidade, valor_total };
  savePedidoItemServicos();
  return res.json(pedidoItemServicosDB[index]);
});

/**
 * @swagger
 * /pedido-item-servicos/{id}:
 *   delete:
 *     summary: Remove um pedido item servico pelo ID
 *     tags: [PedidoItemServicos - Emanuel Pereira Schlickmann]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido item servico
 *     responses:
 *       200:
 *         description: Pedido item servico removido com sucesso
 *       404:
 *         description: Pedido item servico não encontrado
 */
// DELETE pedido item servico
router.delete('/:id', (req, res) => {
  pedidoItemServicosDB = loadPedidoItemServicos();
  const index = pedidoItemServicosDB.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pedido item servico não encontrado' });
  }
  pedidoItemServicosDB.splice(index, 1);
  savePedidoItemServicos();
  return res.json({ message: 'Pedido item servico removido com sucesso' });
});

module.exports = router;
