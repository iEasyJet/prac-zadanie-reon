module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', '.prettierrc'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': ["error", { "argsIgnorePattern": "^_" }],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/explicit-member-accessibility': ['error', { 'accessibility': 'explicit', 'overrides': { 'constructors': 'no-public' } }],
        'max-len': ['error', { code: 140, ignoreStrings: true, ignoreUrls: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true }],
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'no-useless-escape': 'off',
        indent: ['error', 4, { SwitchCase: 1, ignoredNodes: ['PropertyDefinition'] }],
        quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
		semi: ['error', 'always'],
		'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
		'dot-location': ['error', 'property'],
        'lines-between-class-members': ['error', 'always'],
        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
        curly: ['error', 'all'],
        'no-restricted-syntax': [
            'error',
            {
                'selector': 'SwitchCase > *.consequent[type!="BlockStatement"]',
                'message': 'Switch cases without blocks are disallowed.'
            },
        ],
        'no-param-reassign': ['error', { 'props': true, "ignorePropertyModificationsFor": ["acc"] }],
    },
};
