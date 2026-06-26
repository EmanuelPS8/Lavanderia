const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
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

// Removido fs.readFileSync e writeFileSync

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
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('cliente_id usuario_id');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
  }
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
router.get('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate('cliente_id usuario_id');
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado!' });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
  }
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
router.post('/', async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
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
router.put('/:id', async (req, res) => {
  try {
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!pedidoAtualizado) {
      return res.status(404).json({ message: 'Pedido não encontrado!' });
    }
    res.json(pedidoAtualizado);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
  }
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
router.delete('/:id', async (req, res) => {
  try {
    const pedidoRemovido = await Pedido.findByIdAndDelete(req.params.id);

    if (!pedidoRemovido) {
      return res.status(404).json({ message: 'Pedido não encontrado!' });
    }
    res.json({ message: 'Pedido removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover pedido', error: error.message });
  }
});

module.exports = router;