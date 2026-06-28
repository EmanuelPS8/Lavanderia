const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

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
    const clientes = await Cliente.find(query);
    return res.json(clientes);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar clientes', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    return res.json(cliente);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, telefone, email, cpf_cnpj, observacoes } = req.body;
    const cliente = new Cliente({ nome, telefone, email, cpf_cnpj, observacoes });
    await cliente.save();
    return res.status(201).json(cliente);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, telefone, email, cpf_cnpj, observacoes } = req.body;
    const clienteAtualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      { nome, telefone, email, cpf_cnpj, observacoes },
      { new: true }
    );
    if (!clienteAtualizado) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    return res.json(clienteAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const clienteRemovido = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteRemovido) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    return res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover cliente', error: error.message });
  }
});

module.exports = router;
