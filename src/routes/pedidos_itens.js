const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var pedidosItensDB = loadPedidosItens();

function loadPedidosItens() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/pedidos_itens.json', 'utf8'));
  } catch (error) {
    console.error('Erro ao carregar pedidos itens:', error);
    return [];
  }
}

function savePedidosItens() {
  fs.writeFileSync('./src/db/pedidos_itens.json', JSON.stringify(pedidosItensDB, null, 2));
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PedidoItens:
 *       type: object
 *       required:
 *         - pedido_id
 *         - tipo_roupa_id
 *         - quantidade
 *         - descricao
 *         - status
 *         - valor_total
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-gerado (UUID) do pedido item
 *         pedido_id:
 *           type: string
 *           description: ID do pedido
 *         tipo_roupa_id:
 *           type: string
 *           description: ID do tipo de roupa
 *         quantidade:
 *           type: integer
 *           description: Quantidade do tipo de roupa
 *         descricao:
 *           type: string
 *           description: Descrição do pedido item
 *         status:
 *           type: string
 *           description: Status do pedido item
 *         valor_total:
 *           type: number
 *           description: Valor total do pedido item
 *       example:
 *         id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         pedido_id: "pedido-123"
 *         tipo_roupa_id: "roupa-123"
 *         quantidade: 1
 *         descricao: "Descrição do pedido item"
 *         status: "pendente"
 *         valor_total: 10.00
 */

/**
 * @swagger
 * tags:
 *   name: Pedidos Itens - Otávio Frasson
 *   description: Gerenciamento de pedidos itens
 */

/**
 * @swagger
 * /pedidos-itens:
 *   get:
 *     summary: Retorna todos os pedidos itens
 *     tags: [Pedidos Itens - Otávio Frasson]
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos itens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PedidoItens'
 */
//get
router.get('/', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  return res.json(pedidosItensDB);
});

/**
 * @swagger
 * /pedidos-itens/{id}:
 *   get:
 *     summary: Retorna um pedido item pelo ID
 *     tags: [Pedidos Itens - Otávio Frasson]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido item
 *     responses:
 *       200:
 *         description: Um pedido item pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoItens'
 *       404:
 *         description: Pedido item não encontrado
 */
//get by id
router.get('/:id', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  const pedidoItem = pedidosItensDB.find((p) => p.id === req.params.id);
  if (!pedidoItem) {
    return res.status(404).json({ message: 'Pedido item não encontrado' });
  }
  return res.json(pedidoItem);
});

/**
 * @swagger
 * /pedidos-itens:
 *   post:
 *     summary: Cria um novo pedido item
 *     tags: [Pedidos Itens - Otávio Frasson]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoItens'
 *     responses:
 *       201:
 *         description: Pedido item criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoItens'
 */
//post
router.post('/', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  const { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total } = req.body;
  const pedidoItem = { id: uuidv4(), pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total };
  pedidosItensDB.push(pedidoItem);
  savePedidosItens();
  return res.status(201).json(pedidoItem);
});

/**
 * @swagger
 * /pedidos-itens/{id}:
 *   put:
 *     summary: Atualiza um pedido item pelo ID
 *     tags: [Pedidos Itens - Otávio Frasson]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoItens'
 *     responses:
 *       200:
 *         description: Pedido item atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoItens'
 *       404:
 *         description: Pedido item não encontrado
 */
//put
router.put('/:id', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  const { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total } = req.body;
  const index = pedidosItensDB.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pedido item não encontrado' });
  }
  pedidosItensDB[index] = { ...pedidosItensDB[index], pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total };
  savePedidosItens();
  return res.json(pedidosItensDB[index]);
});

/**
 * @swagger
 * /pedidos-itens/{id}:
 *   delete:
 *     summary: Remove um pedido item pelo ID
 *     tags: [Pedidos Itens - Francielle Ferrari]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido item
 *     responses:
 *       200:
 *         description: Pedido item removido com sucesso
 *       404:
 *         description: Pedido item não encontrado
 */
//delete
router.delete('/:id', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  const index = pedidosItensDB.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pedido item não encontrado' });
  }
  pedidosItensDB.splice(index, 1);
  savePedidosItens();
  return res.json({ message: 'Pedido item removido com sucesso' });
});

module.exports = router;
