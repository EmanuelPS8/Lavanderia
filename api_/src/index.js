require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const connectDB = require('./db/db');

// Conectar ao MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const routes = require('./routes');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

// Swagger Options
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
        url: `http://localhost:${port}/api/`,
        description: 'Projeto 01 server',
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

const specs = swaggerJsDoc(options);

app.use('/api', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
