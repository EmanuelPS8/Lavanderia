const express = require('express');
const router = express.Router();

const clienteRoutes = require('./clienteRoutes');
const pedidosItensRoutes = require('./pedidos_itens');
const pedidoItemServicosRoutes = require('./pedido_item_servicos');
const servicosRoutes = require('./servicos');
const tiposRoupaRoutes = require('./tipos_roupa');
const pedidosRoutes = require('./pedidos');
const usuarioRoutes = require('./usuarios');
const studentsRoutes = require('./studentsRoutes');
const teachersRoutes = require('./teachersRoutes');

router.use('/pedidos', pedidosRoutes);
router.use('/clientes', clienteRoutes);
router.use('/pedidos-itens', pedidosItensRoutes);
router.use('/pedido-item-servicos', pedidoItemServicosRoutes);
router.use('/servicos', servicosRoutes);
router.use('/tipos-roupa', tiposRoupaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/students', studentsRoutes);
router.use('/teachers', teachersRoutes);

module.exports = router;
