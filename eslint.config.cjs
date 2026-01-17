const eslintJs = require('@eslint/js');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const eslintComments = require('eslint-plugin-eslint-comments');
const sonarjs = require('eslint-plugin-sonarjs');
const vitest = require('@vitest/eslint-plugin');

const tsTypeCheckedRules = tsPlugin.configs['recommended-type-checked'].rules;
const tsStylisticRules = tsPlugin.configs['stylistic-type-checked'].rules;

module.exports = [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: { ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'eslint-comments': eslintComments,
      sonarjs,
    },
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...tsTypeCheckedRules,
      ...tsStylisticRules,
      ...eslintComments.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,

      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': true,
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: true,
          allowNumber: false,
          allowNullableObject: true,
          allowNullableBoolean: false,
          allowNullableString: true,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['methods'] },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'multi-line'],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'no-unneeded-ternary': 'error',
      'no-console': 'warn',

      'sonarjs/function-return-type': 'off',
      'sonarjs/slow-regex': 'off',

      complexity: ['warn', 15],
      'max-lines': [
        'warn',
        { max: 800, skipBlankLines: false, skipComments: false },
      ],
      'max-lines-per-function': [
        'warn',
        { max: 80, skipBlankLines: false, skipComments: false },
      ],
      'sonarjs/cognitive-complexity': ['error', 30],

      'eslint-comments/no-use': ['error', { allow: [] }],
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-disable': 'error',
      'eslint-comments/require-description': 'off',
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/__tests__/**/*.ts',
    ],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,

      'vitest/expect-expect': 'error',
      'vitest/no-standalone-expect': 'error',
      'vitest/valid-expect': 'error',
      'vitest/no-conditional-expect': 'error',
      'vitest/no-conditional-in-test': 'error',
      'vitest/no-conditional-tests': 'error',
      'vitest/require-to-throw-message': 'error',
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-commented-out-tests': 'warn',
      'vitest/no-identical-title': 'error',
      'vitest/no-duplicate-hooks': 'error',
      'vitest/prefer-strict-equal': 'error',
      'vitest/prefer-to-be': 'error',
      'vitest/prefer-to-have-length': 'error',
      'vitest/prefer-comparison-matcher': 'error',
      'vitest/prefer-equality-matcher': 'error',
      'vitest/no-interpolation-in-snapshots': 'error',
      'vitest/max-nested-describe': ['error', { max: 3 }],
      'vitest/require-top-level-describe': 'error',
      'vitest/prefer-hooks-on-top': 'error',
      'vitest/no-mocks-import': 'warn',

      '@typescript-eslint/no-empty-function': 'off',
      'max-lines-per-function': 'off',
      'sonarjs/no-nested-functions': 'off',
    },
  },
];
