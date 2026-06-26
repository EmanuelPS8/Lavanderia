const express = require('express');
const router = express.Router();
const PedidoItem = require('../models/PedidoItem');
// Removido fs.readFileSync e writeFileSync

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
router.get('/', async (req, res) => {
  try {
    const itens = await PedidoItem.find().populate('pedido_id tipo_roupa_id');
    return res.json(itens);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar itens do pedido', error: error.message });
  }
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
router.get('/:id', async (req, res) => {
  try {
    const pedidoItem = await PedidoItem.findById(req.params.id).populate('pedido_id tipo_roupa_id');
    if (!pedidoItem) {
      return res.status(404).json({ message: 'Pedido item não encontrado' });
    }
    return res.json(pedidoItem);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar item do pedido', error: error.message });
  }
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
router.post('/', async (req, res) => {
  try {
    const { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total } = req.body;
    const pedidoItem = new PedidoItem({ pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total });
    await pedidoItem.save();
    return res.status(201).json(pedidoItem);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar item do pedido', error: error.message });
  }
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
router.put('/:id', async (req, res) => {
  try {
    const { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total } = req.body;
    const itemAtualizado = await PedidoItem.findByIdAndUpdate(
      req.params.id,
      { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total },
      { new: true }
    );
    if (!itemAtualizado) {
      return res.status(404).json({ message: 'Pedido item não encontrado' });
    }
    return res.json(itemAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar item do pedido', error: error.message });
  }
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
router.delete('/:id', async (req, res) => {
  try {
    const itemRemovido = await PedidoItem.findByIdAndDelete(req.params.id);
    if (!itemRemovido) {
      return res.status(404).json({ message: 'Pedido item não encontrado' });
    }
    return res.json({ message: 'Pedido item removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover item do pedido', error: error.message });
  }
});

module.exports = router;
