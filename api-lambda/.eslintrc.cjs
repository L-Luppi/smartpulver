module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['.eslintrc.cjs'],
  rules: {
    // Add any backend-specific rules here
  }
};
