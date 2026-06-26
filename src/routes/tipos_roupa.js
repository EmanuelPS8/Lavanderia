const express = require('express');
const router = express.Router();
const TipoRoupa = require('../models/TipoRoupa');
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

// Removido fs.readFileSync e writeFileSync

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
router.get('/', async (req, res) => {
  try {
    const tipos = await TipoRoupa.find();
    return res.json(tipos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar tipos de roupa', error: error.message });
  }
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
router.get('/:id', async (req, res) => {
  try {
    const busca = req.params.id;
    // Tenta buscar por ID (se for ObjectId válido) ou por nome
    let query = { $or: [{ nome: { $regex: busca, $options: 'i' } }] };
    if (busca.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: busca });
    }

    const resultados = await TipoRoupa.find(query);

    if (resultados.length === 0) {
      return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
    }
    // Retorna o primeiro ou a lista, para manter compatibilidade retorna o primeiro se for por id, mas a logica original retornava 1 objeto
    return res.json(resultados[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar tipo de roupa', error: error.message });
  }
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
router.post('/', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const novoTipo = new TipoRoupa({ nome, descricao });
    await novoTipo.save();
    return res.status(201).json(novoTipo);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar tipo de roupa', error: error.message });
  }
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
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const tipoAtualizado = await TipoRoupa.findByIdAndUpdate(
      req.params.id,
      { nome, descricao },
      { new: true }
    );

    if (!tipoAtualizado) {
      return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
    }
    return res.json(tipoAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar tipo de roupa', error: error.message });
  }
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
router.delete('/:id', async (req, res) => {
  try {
    const tipoRemovido = await TipoRoupa.findByIdAndDelete(req.params.id);

    if (!tipoRemovido) {
      return res.status(404).json({ message: 'Tipo de roupa não encontrado' });
    }
    return res.json({ message: 'Tipo de roupa removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover tipo de roupa', error: error.message });
  }
});

module.exports = router;
