# Dependencies in `package.json`

Starting with the January  2020 upgrade, these are the dependencies (both
runtime and dev dependencies) in package.json and the reason they are here.

## Runtime Dependencies

- **create-react-class**: Temporary dependency to facilitate in the transition
  from `React.createReactClass` to creating React objects.
- **flux**: Used for the `flux` architecture; this may be factored out some
  time soon.
- **lodash**: General utility functions.
- **moment**: Date and time manipulation functions.
- **moment-timezone**: Time zone support for `moment`.
- **prop-types**: Support of `PropTypes` for React.
- **react**: Version 16 of React
- **react-dom**: Version 16 of React DOM
- **react-router**: Older version of React router (3.x), needs to be refactored
  to React router 5.

## Development dependencies

### Babel

Needed to transform fancy JavaScript to plain JavaScript.

- `@babel/cli`: Babel command line.
- `@babel/core`: Base Babel application.
- `@babel/plugin-transform-runtime`: needed to support async/await
- `@babel/preset-env`: Transform ES6 into traditional JavaScript.
- `@babel/preset-react`: Transfrom JSX into plain JavaScript.

### Eslint

Needed to do style checking

- `eslint`: Eslint tool.
- `babel-eslint`: Use Babel to translate JSX for Eslint.
- `eslint-plugin-jsx`: Handle JSX in Eslint.
- `eslint-plugin-react`: Handle React components in Eslint.

### Webpack

Needed to bundle the application; also to provide a way to see the application
as you are editing.

- `babel-loader`: Plugin to load Babel into Webpack.
- `react-hot-loader`: Needed for Webpack to hot-reload during development.
- `webpack`: Basic Webpack tool.
- `webpack-cli`: Webpack command line interface.
- `webpack-dev-server`: Webpack server for development.

### Jest

Test runner

- `jest`: Test runner core.
- `babel-jest`: To connect Babel and Jest.
- `enzyme`: Used by Jest to test interactions with React components;
- `enzyme-adapter-react-16`: Needed for Enzyme with React 16.
- `react-test-renderer`: Used to create snapshots.


## Configuration files
- `.babelrc`: Babel configuration file.
- `.eslintrc.js`: Eslint configuration file.
- `.gitignore`: Ignore `node_modules`.
- `enzymeSetup.js`: Necessary to configure Enzyme with Jest.
- `jest.config.js`: Jest configuration file.
- `webpack.config.js`: Webpack configuration file.

## Npm Run Commands

- `build`: Build the application to the `dist` folder.
- `dev`: Run the Webpack dev server.
- `test`: Run unit tests; use `test -- -u` to force snapshots to update.
- `coverage`: Run unit tests while capturing coverage.
- `test-watch`: Run unit tests every time a file changes.
- `eslint`: Run Eslint; use `eslint -- -fix` to fix issues.
