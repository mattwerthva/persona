const express = require('express')
const router = express.Router()

const HealthService = require('../services/health');

// hello
router.get('/', async (req,res) => {
  res.status(200).send('Persona service is running.');
});

/**
  * @openapi
  * /health:
  *   get:
  *     summary: Is the service healthy
  *     description: Is the service healthy
  *     responses:
  *       5XX:
  *         description: Unexpected error.
  *       200:
  *         description: The service is running
  *         content:
  *            text/plain:
  *              schema:
  *               type: string
  */
router.get('/health', async (req,res) => {
    const healthy = await HealthService.health();

    res.status(200).send(healthy);
});

module.exports = router