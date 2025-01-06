module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    __DEV__: true,
    __PROD__: true,
    __STAGING__: true,
    __PREVIEW__: true,
    __PREPROD__: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:css-modules/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  parserOptions: {
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: ['css-modules', 'prettier', 'react'],
  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    // 'import/resolver': {
    //   node: {
    //     moduleDirectory: ['src', 'node_modules'],
    //   },
    // },
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'warn',
      { packageDir: '.' },
      // { devDependencies: true },
    ],

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    // manual off
    'jsx-a11y/anchor-has-content': 'warn',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'react/no-multi-comp': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/tabindex-no-positive': 'warn',
    'react/prop-types': 'warn',
    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': 'off',
    // manaul off
    'react/no-array-index-key': 'off',

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': 'error',
    // need to check below settings
    // 'react/sort-comp': 'off',
    'no-underscore-dangle': 'off', // Allow usage of var _foo;
    // Will uncomment if required in future if required
    'sx-a11y/label-has-for': 'off',
    'spaced-comment': 'off', // Depriciated
    'no-useless-escape': 'off',
    'no-unused-class': 'off',
    'css-modules/no-undef-class': 'warn',
    'css-modules/no-unused-class': 'warn',
    'prefer-rest-params': 'warn',
    'jsx-a11y/label-has-for': 'warn',
    camelcase: 'warn',
    'react/no-did-mount-set-state': 'warn',
    'no-restricted-globals': 'off',
    'no-param-reassign': 'off',
    'react/forbid-prop-types': 'warn',
    'import/no-unresolved': 'warn',
    'import/extensions': 'warn',
    // 'import/prefer-default-export': 'off',
    'import/no-relative-packages': 'off',
    'import/no-named-as-default': 'off',
    // 'import/no-named-as-default-member': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-import-module-exports': 'off',
  },
};
