// stylelint configuration
// https://stylelint.io/user-guide/configuration/
module.exports = {
  // The standard config based on a handful of CSS style guides
  // https://github.com/stylelint/stylelint-config-standard
  // extends: 'stylelint-config-standard',
  extends: 'stylelint-config-recommended-scss',

  plugins: [
    // stylelint plugin to sort CSS rules content with specified order
    // https://github.com/hudochenkov/stylelint-order
    'stylelint-order',
  ],

  rules: {
    // #todo: these need to be understood and enabled as needed
    'no-descending-specificity': null,
    'order/order': null,
    'no-duplicate-selectors': null,
    'declaration-block-no-duplicate-properties': null,
    'declaration-block-no-shorthand-property-overrides': null,
    'scss/at-import-partial-extension': null,
    'scss/no-global-function-names': null,
    'scss/operator-no-unspaced': null,
    'scss/load-no-partial-leading-underscore': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          // CSS Modules composition
          // https://github.com/css-modules/css-modules#composition
          'composes',
        ],
      },
    ],

    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          // CSS Modules :global scope
          // https://github.com/css-modules/css-modules#exceptions
          'global',
          'local',
        ],
      },
    ],

    // Opinionated rule, you can disable it if you want
    // 'string-quotes': 'single',

    // https://github.com/hudochenkov/stylelint-order/blob/master/rules/order/README.md
    // 'order/order': ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],

    // https://github.com/hudochenkov/stylelint-order/blob/master/rules/properties-order/README.md
    'order/properties-order': [],
  },
}
