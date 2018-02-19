module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html',
    'vue'
  ],
  // add your custom rules here
  rules: {
    'arrow-parens': 0,
    'one-var': 0,
    'semi': ["warn", "always"],
    'eol-last': ["error", "always"]
  },
  globals: {}
}
