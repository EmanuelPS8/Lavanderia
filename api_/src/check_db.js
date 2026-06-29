require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db/db');
const PedidoItemServico = require('./models/PedidoItemServico');
const PedidoItem = require('./models/PedidoItem');

async function run() {
  await connectDB();
  console.log("Connected to database.");
  const items = await PedidoItem.find();
  console.log("PedidoItems:", JSON.stringify(items, null, 2));
  const services = await PedidoItemServico.find().populate('pedido_item_id servico_id');
  console.log("PedidoItemServicos:", JSON.stringify(services, null, 2));
  await mongoose.disconnect();
}

run().catch(console.error);
