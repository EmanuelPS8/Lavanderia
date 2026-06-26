require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');

// Conectar ao MongoDB
connectDB();

app.use(cors());
app.use(express.json());

//swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const routes = require('./routes');

const hostname = '127.0.0.1';
const port = 3000;

//swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Projeto 01',
      version: '1.0.0',
      description: `API para o Projeto 01  
            
            ### TD 01    
            Disciplina: DAII 2026.01  
            Equipe: Betina Lima, Emanuel Pereira Schlickmann, Francielle Ferrari, Gabriel Figueredo, Otávio Frasson Neto;     
			`,
      license: {
        name: 'Licenciado para o BOFEGATU (Betina Otavio Francielle Emanuel Gabriel - Amigos que a Tecnologia Uniu)',
      },
      contact: {
        name: 'BOFEGATU',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/',
        description: 'Projeto 01 server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);

app.use('/api', routes);
//swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
