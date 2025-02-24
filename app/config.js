const { cleanEnv, str, num } = require('envalid');

const env = cleanEnv(process.env, {
    PORT: num({ default: 8000 }),
    LOG_LEVEL: str({ default: 'info' })
    });

// config
const config = {
  app: {
    port: env.port,
    log_level: env.LOG_LEVEL
  },
  db: {
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    host: process.env.PG_HOST || '127.0.0.1',
    port: process.env.PG_PORT || '5433',
    database: process.env.PG_DATABASE || 'postgres',
  }
};

module.exports = config;
