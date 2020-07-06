module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ['plugin:vue/essential', '@vue/prettier'],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true
      }
    ]
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  plugins: ['graphql'],
  globals: {
    isNotNull: true
  }
};
