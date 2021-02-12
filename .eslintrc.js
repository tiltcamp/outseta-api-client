module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-console': 'error',
    'eol-last': 'error',
    'import/no-default-export': 'error',
    "@typescript-eslint/semi": ["error"]
  }
};
