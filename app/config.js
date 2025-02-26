
// config
const config = {
  app: {
    port: process.env.PORT || 8000,
    log_level: process.env.LOG_LEVEL || 'info'
  },
  db: {
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || '5432',
    database: process.env.PG_DATABASE || 'postgres',
  }
};

// Function to obfuscate sensitive fields
function obfuscatePasswords(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      // Recursively handle nested objects
      result[key] = obfuscatePasswords(value);
    } else if (typeof key === 'string' && key.toLowerCase().includes('password')) {
      // Obfuscate if key contains "password" (case-insensitive)
      result[key] = '****';
    } else {
      // Copy other values as-is
      result[key] = value;
    }
  }
  return result;
}

const sanatized = obfuscatePasswords(config);
console.info(`Startup config:  ${JSON.stringify(sanatized, null, 2)}`);

module.exports = config;
