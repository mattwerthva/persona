const { cleanEnv, str, num } = require('envalid');

const env = cleanEnv(process.env, {
    PORT: num({ default: 8000 }),
    LOG_LEVEL: str({ default: 'info' })
    });

// config
module.exports = {
  app: {
    port: env.port,
    log_level: env.LOG_LEVEL
  }
};
