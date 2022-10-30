module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project:'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module'
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'],
    root:true,
    env: {
        node: true, browser: true, es2021: true
    },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
        // 'indent': ['error', 4],
        //  'linebreak-style': ['error', 'windows'],
        // 'quotes': ['error', 'single'],
        // 'semi': ['error', 'always'],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    }
};
