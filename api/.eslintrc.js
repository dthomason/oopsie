module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': 'warn',
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'warn',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: [
          'builtin',
          'external',
          'unknown',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'internal',
            pattern: '~/**/*',
          },
          {
            group: 'internal',
            pattern: 'helpers',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'object'],
      },
    ],
    'no-console': 'warn',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],
    'sort-imports': [
      'off',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'spaced-comment': ['warn', 'always', { block: { balanced: true } }],
    // Temporary overrides that we'll want to change back to errors
    'no-inner-declarations': 'warn',
    'no-prototype-builtins': 'warn',
    'no-redeclare': 'warn',
  },
};
