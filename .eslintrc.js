// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
// "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
var rules = {
  // best practices
  complexity: ["error", 8],
  curly: ["warn", "all"],
  "dot-notation": "warn",
  eqeqeq: "warn",
  "guard-for-in": "error",
  "no-caller": "error",
  "no-else-return": "warn",
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-invalid-this": "off",
  "no-multi-spaces": "error",
  "no-multi-str": "error",
  "no-new-wrappers": "error",
  "no-param-reassign": "error",
  "no-return-assign": ["warn", "always"],
  "no-throw-literal": "error",
  "no-warning-comments": "warn",
  "no-with": "error",

  // possible errors
  "no-cond-assign": "error",
  "no-console": "error",
  "no-irregular-whitespace": "error",
  "no-unexpected-multiline": "error",
  "valid-jsdoc": [
    "error",
    {
      requireParamDescription: false,
      requireReturnDescription: false,
      requireReturn: false,
      prefer: { returns: "return" }
    }
  ],

  // es6
  "arrow-parens": ["warn", "as-needed", { requireForBlockBody: true }],
  "constructor-super": "error", // eslint:recommended
  "generator-star-spacing": ["error", "after"],
  "no-new-symbol": "error",
  "no-this-before-super": "error",
  "no-var": "error",
  "prefer-arrow-callback": "error",
  "prefer-const": "error",
  "prefer-rest-params": "off",
  "prefer-spread": "error",
  "rest-spread-spacing": "error",
  "yield-star-spacing": ["error", "after"],

  "react/jsx-tag-spacing": [
    "error",
    {
      closingSlash: "never",
      beforeSelfClosing: "always",
      afterOpening: "never"
    }
  ],
  "react/jsx-boolean-value": "error",
  "react/jsx-closing-bracket-location": "error",
  "react/jsx-curly-spacing": ["error", "never", { allowMultiline: false }],
  "react/jsx-equals-spacing": ["error", "never"],
  "react/jsx-first-prop-new-line": ["error", "multiline"],
  "react/jsx-indent": ["error", 2], // *** added eric
  "react/jsx-indent-props": ["error", 2],
  "react/jsx-key": "error",
  "react/jsx-max-props-per-line": ["error", { maximum: 1 }],
  "react/jsx-no-comment-textnodes": "error",
  "react/no-did-mount-set-state": "error",
  "react/no-did-update-set-state": "error",
  "react/jsx-no-duplicate-props": ["error", { ignoreCase: true }],
  "react/jsx-uses-react": "error",
  "react/jsx-uses-vars": "error",
  "react/jsx-wrap-multilines": "error",
  "react/no-danger": "error",
  "react/no-deprecated": "error",
  "react/no-direct-mutation-state": "error",
  "react/no-find-dom-node": "error",
  "react/no-is-mounted": "error",
  "react/no-string-refs": "error",
  "react/no-unknown-property": "error",
  "react/no-unused-prop-types": ["error", { skipShapeProps: true }],
  "react/prop-types": "error",
  "react/require-render-return": "error",
  "react/self-closing-comp": "error",
  "react/sort-comp": "error",

  // styles
  "array-bracket-spacing": ["error", "never"],
  "block-spacing": ["error", "never"],
  "brace-style": "error",
  camelcase: ["error", { properties: "never" }],
  "comma-dangle": ["error", "never"],
  "comma-spacing": "error",
  "comma-style": "error",
  "computed-property-spacing": "error",
  "eol-last": "error",
  "func-call-spacing": "error",
  "id-length": [
    "error",
    {
      min: 3,
      max: 50,
      exceptions: ["$", "_", "cb", "i", "id", "ID", "j", "k", "NO", "to"]
    }
  ],
  indent: ["error", 2, { SwitchCase: 1 }],
  "jsx-quotes": "error",
  "key-spacing": "error",
  "keyword-spacing": "error",
  "linebreak-style": ["off", "unix"],
  "max-depth": ["error", 5],
  "max-len": ["error", 120, 2],
  "max-params": ["error", 4],
  "multiline-ternary": ["error", "never"],
  "new-cap": [
    "error",
    {
      capIsNewExceptions: ["express.Router"],
      capIsNewExceptionPattern: "^I[A-Z|a-z]\\w+"
    }
  ],
  "no-array-constructor": "error",
  "no-mixed-spaces-and-tabs": "error",
  "no-multiple-empty-lines": ["error", { max: 1 }],
  "no-new-object": "error",
  "no-tabs": "error",
  "no-trailing-spaces": "error",
  "object-curly-spacing": "error",
  "one-var": [
    "error",
    {
      var: "never",
      let: "never",
      const: "never"
    }
  ],
  "operator-linebreak": ["warn", "after"],
  "padded-blocks": ["error", "never"],
  "quote-props": ["error", "as-needed"],
  quotes: ["error", "single"],
  "require-jsdoc": "off",
  semi: "error",
  "semi-spacing": "error",
  "space-before-blocks": "error",
  "space-before-function-paren": [
    "error",
    {
      asyncArrow: "always",
      anonymous: "never",
      named: "never"
    }
  ],
  "spaced-comment": ["error", "always"],
  "space-infix-ops": "warn",
  "space-in-parens": ["warn", "never"],
  strict: ["error", "global"],

  // variables
  "no-undef": "off",
  "no-unused-vars": ["error", { vars: "all", args: "none" }]
};

module.exports = {
  env: {
    browser: true,
    jest: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    },
    ecmaVersion: 6,
    sourceType: "module"
  },
  plugins: ["jsx", "react"],
  rules: rules,
  root: true,
  settings: {
    react: {
      version: "detect"
    }
  }
};
