# Dependencies in `package.json`

Starting with the January  2020 upgrade, these are the dependencies (both
runtime and dev dependencies) in package.json and the reason they are here.

### Runtime Dependencies

- **create-react-class**: Temporary dependency to facilitate in the transition
  from `React.createClass` to creating React objects.
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

### Dev Dependencies

- **@babel/core**: Babel core functionality.
- **@babel/plugin-transform-react-jsx"**: Babel plugin to handle JSX format.
- **@babel/polyfill**: Babel polyfill functionality (support of older browsers).
- **@babel/preset-env**: Definition that defines which Babel functionality
  to use.
- **babel-loader**: Connection between Webpack and Babel.
- **webpack**: builder for JavaScript projects.
- **webpack-cli**: Webpack command line interface (starts Webpack).
- **webpack-dev-server**: Webpack tool to create a local server to serve the
  development version, with auto-refresh.

## Configuration files
 - .babelrc
 - webpack.config.js

## Commands
 - npm run build
