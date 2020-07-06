module.exports = {
  extends: '@bifot/eslint-config',
  parserOptions: {
    'parser': 'babel-eslint'
  },
  rules: {
    'no-console': 'off',
    'camelcase': 'off',
    'no-unused-vars': 'off',
    'import/prefer-default-export': 'off'
  }
};
