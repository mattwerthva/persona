const eslintOverrides = require('./.eslint-overrides.json');

module.exports = {
  'env': {
    'node': true,
    'es6': true
  },
  'extends': [
    'xo/esnext',
    'eslint-config-prettier',
    './node_modules/xo/config/plugins.js'
  ],
  "ignorePatterns": ["**/node_modules"],
  ...eslintOverrides
};
