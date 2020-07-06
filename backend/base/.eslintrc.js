module.exports = {
  extends: '@bifot/eslint-config',
  parserOptions: {
    'parser': 'babel-eslint'
  },
  rules: {
    'no-console': 'off',
    'camelcase': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off'
  }
};