# Developer Guidelines:

1. install node
2. install yarn
3. npm install http-server -g
4. yarn run build [--staging] [--production] (no arguments needed for dev build )
5. yarn start
6. open http://localhost:9000/ to see served files

## Components Development

$ yarn install
$ yarn run storybook

go to - http://localhost:6006/

# Build Automation Tools

### `yarn run build` (`build.js`)

- Cleans up the output `/dist` folder (`clean.js`)
- Copies static files to the output folder (`copy.js`)
- Creates application bundles with Webpack (`bundle.js`, `webpack.config.js`)

## Options

| Flag        | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| `--release` | Minimizes and optimizes the compiled output                                         |
| `--verbose` | Prints detailed information to the console                                          |
| `--analyze` | Launches [Webpack Bundle Analyzer](https://github.com/th0r/webpack-bundle-analyzer) |

For example:

```sh
$ yarn run build --release --verbose      # Build the app in production mode
```

or

```sh
$ yarn start --release                    # Launch dev server in production mode
```

## Misc

- `webpack.config.js` - Webpack configuration for both client-side and
  server-side bundles
- `run.js` - Helps to launch other scripts with `babel-node` (e.g. `babel-node tools/run build`)
- `.eslintrc` - ESLint overrides for built automation scripts

-- Steps for running the application with SDK

Install http-server globally : npm install -g http-server
Change Directory to dist
TO run the http server --> http-server --port 9000 --cors
