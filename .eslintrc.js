module.exports = {
    root: true,
    env: {
        browser: true,
        es2022: true,
        node: true,
    },
    extends: [
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'import'],
    settings: {
        'import/resolver': {
            typescript: {
                project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
            },
        },
    },
    rules: {
        // Disable deprecated rules
        '@typescript-eslint/lines-between-class-members': 'off',
        '@typescript-eslint/no-throw-literal': 'off',

        // Relax unsafe-* rules for better Next.js/Supabase compatibility
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',

        // TypeScript rules
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/consistent-type-imports': [
            'warn',
            { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
        ],

        // React rules
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/function-component-definition': 'off',

        // Import rules
        'import/prefer-default-export': 'off',
        'import/order': 'off',
        'import/extensions': 'off',

        // General rules
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'arrow-body-style': 'off',
        'default-case': 'off',
        'no-promise-executor-return': 'off',
        'no-script-url': 'off',

        // Accessibility rules (relaxed for MVP)
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/html-has-lang': 'off',

        // React style rules (relaxed)
        'react/no-array-index-key': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-unstable-nested-components': 'off',

        // TypeScript rules (relaxed for event handlers)
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/require-await': 'off',
    },
    ignorePatterns: [
        'node_modules/',
        'dist/',
        '.next/',
        'coverage/',
        '*.config.js',
        '*.config.ts',
        'postcss.config.js',
    ],
};
