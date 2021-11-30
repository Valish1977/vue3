module.exports = {
  root: true,
  env: {
    node: true,
    "browser": true,
    "es6": true
  },
  globals: {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  parser: "vue-eslint-parser",
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    tsconfigRootDir: "./",
    extraFileExtensions: [ ".vue" ]
  },
  plugins: [
    "vue",
    "@typescript-eslint"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
