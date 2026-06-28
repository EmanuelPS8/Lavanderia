const express = require('express');
const router = express.Router();
const Servico = require('../models/Servico');
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
 *   name: Serviços - Otávio Frasson
 *   description: Gerenciamento de serviços
 */

// Removido fs.readFileSync e writeFileSync

/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Retorna todos os serviços (permite filtrar por nome ou data)
 *     tags: [Serviços - Otávio Frasson]
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
 *         description: Lista de todos os serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 */
//GET all services
router.get('/', async (req, res) => {
  try {
    const { nome, data } = req.query;
    let query = {};
    if (nome) {
      query.nome = { $regex: nome, $options: 'i' };
    }
    if (data) {
      query.created_at = {
        $gte: new Date(`${data}T00:00:00.000Z`),
        $lte: new Date(`${data}T23:59:59.999Z`)
      };
    }
    const servicos = await Servico.find(query);
    return res.json(servicos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar serviços', error: error.message });
  }
});

/**
 * @swagger
 * /servicos/{id}:
 *   get:
 *     summary: Retorna um serviço pelo ID
 *     tags: [Serviços - Otávio Frasson]
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
router.get('/:id', async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    return res.json(servico);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar serviço', error: error.message });
  }
});

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Serviços - Otávio Frasson]
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
router.post('/', async (req, res) => {
  try {
    const { nome, preco, descricao, ativo } = req.body;
    const servico = new Servico({ nome, preco, descricao, ativo });
    await servico.save();
    return res.status(201).json(servico);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar serviço', error: error.message });
  }
});

/**
 * @swagger
 * /servicos/{id}:
 *   put:
 *     summary: Atualiza um serviço pelo ID
 *     tags: [Serviços - Otávio Frasson]
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
router.put('/:id', async (req, res) => {
  try {
    const { nome, preco, descricao, ativo } = req.body;
    const servicoAtualizado = await Servico.findByIdAndUpdate(
      req.params.id,
      { nome, preco, descricao, ativo },
      { new: true }
    );
    if (!servicoAtualizado) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    return res.json(servicoAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar serviço', error: error.message });
  }
});

/**
 * @swagger
 * /servicos/{id}:
 *   delete:
 *     summary: Remove um serviço pelo ID
 *     tags: [Serviços - Otávio Frasson]
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
router.delete('/:id', async (req, res) => {
  try {
    const servicoRemovido = await Servico.findByIdAndDelete(req.params.id);
    if (!servicoRemovido) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    return res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover serviço', error: error.message });
  }
});

module.exports = router;