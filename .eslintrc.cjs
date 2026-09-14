module.exports = {
  root: true,
  extends: [
    '@electron-toolkit/eslint-config-ts/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
  ignorePatterns: ['out', 'dist', 'node_modules', '*.config.*']
}
