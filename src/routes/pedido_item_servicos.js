const express = require('express');
const router = express.Router();
const PedidoItemServico = require('../models/PedidoItemServico');
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

// Removido fs.readFileSync e writeFileSync

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
router.get('/', async (req, res) => {
  try {
    const itens = await PedidoItemServico.find().populate('pedido_item_id servico_id');
    return res.json(itens);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar pedido item servicos', error: error.message });
  }
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
router.get('/:id', async (req, res) => {
  try {
    const item = await PedidoItemServico.findById(req.params.id).populate('pedido_item_id servico_id');
    if (!item) {
      return res.status(404).json({ message: 'Pedido item servico não encontrado' });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar pedido item servico', error: error.message });
  }
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
router.post('/', async (req, res) => {
  try {
    const { pedido_item_id, servico_id, preco_unitario, quantidade } = req.body;
    const valor_total = preco_unitario * quantidade;
    const item = new PedidoItemServico({ pedido_item_id, servico_id, preco_unitario, quantidade, valor_total });
    await item.save();
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar pedido item servico', error: error.message });
  }
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
router.put('/:id', async (req, res) => {
  try {
    const { pedido_item_id, servico_id, preco_unitario, quantidade } = req.body;
    const valor_total = preco_unitario * quantidade;
    const itemAtualizado = await PedidoItemServico.findByIdAndUpdate(
      req.params.id,
      { pedido_item_id, servico_id, preco_unitario, quantidade, valor_total },
      { new: true }
    );
    if (!itemAtualizado) {
      return res.status(404).json({ message: 'Pedido item servico não encontrado' });
    }
    return res.json(itemAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar pedido item servico', error: error.message });
  }
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
router.delete('/:id', async (req, res) => {
  try {
    const itemRemovido = await PedidoItemServico.findByIdAndDelete(req.params.id);
    if (!itemRemovido) {
      return res.status(404).json({ message: 'Pedido item servico não encontrado' });
    }
    return res.json({ message: 'Pedido item servico removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover pedido item servico', error: error.message });
  }
});

module.exports = router;
