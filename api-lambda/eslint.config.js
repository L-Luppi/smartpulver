const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                // Node.js globals
                process: 'readonly',
                module: 'writable',
                exports: 'writable',
                require: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'writable',
                console: 'readonly',
                Buffer: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                setImmediate: 'readonly',
                clearImmediate: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': ['error', {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_'
            }],
            'no-console': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
            'no-undef': 'error'
        }
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            '*.min.js'
        ]
    }
];