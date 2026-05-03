const express = require('express');
const router = express.Router();

const clienteRoutes = require('./clienteRoutes');
const pedidosItensRoutes = require('./pedidos_itens');
const pedidoItemServicosRoutes = require('./pedido_item_servicos');
const servicosRoutes = require('./servicos');

router.use('/clientes', clienteRoutes);
router.use('/pedidos-itens', pedidosItensRoutes);
router.use('/pedido-item-servicos', pedidoItemServicosRoutes);
router.use('/servicos', servicosRoutes);

module.exports = router;
