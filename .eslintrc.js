module.exports = {
  env: {
    browser: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
