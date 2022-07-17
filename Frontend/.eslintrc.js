module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'require-jsdoc': 0,
    'new-cap': 0,
    'max-len': ['error', 100, {
      'ignorePattern': '^import\\s.+\\sfrom\\s.+;$',
      'ignoreUrls': true,
    }],
    'linebreak-style': ['error', 'windows'],
  },
};
