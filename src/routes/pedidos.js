const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let pedidosDB = loadPedidos();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       required:
 *         - cliente_id
 *         - usuario_id
 *         - status
 *         - data_entrada
 *         - valor_total
 *       properties:
 *         id:
 *           type: string
 *           example: "id"
 *         cliente_id:
 *           type: string
 *           example: "id"
 *         usuario_id:
 *           type: string
 *           example: "id"
 *         status:
 *           type: string
 *           example: "em andamento"
 *         data_entrada:
 *           type: string
 *           format: date-time
 *           example: "2026-05-03T14:00:00Z"
 *         data_prevista:
 *           type: string
 *           format: date-time
 *           example: "2026-05-10T14:00:00Z"
 *         data_saida:
 *           type: string
 *           format: date-time
 *           example: "2026-05-09T14:00:00Z"
 *         valor_total:
 *           type: number
 *           example: 150.75
 *         observacoes:
 *           type: string
 *           example: "Cliente pediu urgência"
 */

/**
 * @swagger
 * tags:
 *   name: Pedidos - Betina Lima
 *   description: Gerenciamento de pedidos
 */

function loadPedidos() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/pedidos.json', 'utf8'));
  } catch {
    return [];
  }
}

function savePedidos() {
  fs.writeFileSync('./src/db/pedidos.json', JSON.stringify(pedidosDB, null, 2));
}

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Retorna todos os pedidos
 *     tags: [Pedidos - Betina Lima]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get('/', (req, res) => {
  pedidosDB = loadPedidos();
  res.json(pedidosDB);
});

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Retorna um pedido pelo ID
 *     tags: [Pedidos - Betina Lima]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *           example: "id"
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', (req, res) => {
  pedidosDB = loadPedidos();
  const pedido = pedidosDB.find(p => p.id === req.params.id);

  if (!pedido) {
    return res.status(404).json({ message: 'Pedido não encontrado!' });
  }

  res.json(pedido);
});

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos - Betina Lima]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido criado
 */
router.post('/', (req, res) => {
  pedidosDB = loadPedidos();

  const novoPedido = {
    id: uuidv4(),
    ...req.body
  };

  pedidosDB.push(novoPedido);
  savePedidos();

  res.status(201).json(novoPedido);
});

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Atualiza um pedido
 *     tags: [Pedidos - Betina Lima]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *           example: "id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', (req, res) => {
  pedidosDB = loadPedidos();

  const index = pedidosDB.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Pedido não encontrado!' });
  }

  pedidosDB[index] = {
    ...pedidosDB[index],
    ...req.body
  };

  savePedidos();
  res.json(pedidosDB[index]);
});

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Pedidos - Betina Lima]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *           example: "id"
 *     responses:
 *       200:
 *         description: Pedido removido
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', (req, res) => {
  pedidosDB = loadPedidos();

  const index = pedidosDB.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Pedido não encontrado!' });
  }

  pedidosDB.splice(index, 1);
  savePedidos();

  res.json({ message: 'Pedido removido com sucesso!' });
});

module.exports = router;