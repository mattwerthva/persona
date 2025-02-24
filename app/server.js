// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const envalid = require('envalid');
const os = require('os');

const app = express();
app.use(express.json());
app.use(cors());

// swagger
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/swagger.json');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use(require("./routes/health"));
app.use(require("./routes/persona"));

// listen
const HOSTNAME = os.hostname();
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Boiler service is running on host ${HOSTNAME} port ${PORT}`);
});

// close
app.closeServer = () => {
  server.close();
};

// make app avail for tests
module.exports = app;
