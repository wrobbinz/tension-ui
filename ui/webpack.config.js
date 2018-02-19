const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'),
  JS: path.resolve(__dirname, 'src/js'),
}

// Webpack configuration
module.exports = {
  entry: ['babel-polyfill', path.join(paths.JS, 'app.jsx')],
  output: {
    path: paths.DIST,
    filename: 'app.bundle.js',
  },
  // Tell webpack to use html plugin
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.SRC, 'index.html'),
    }),
    new ExtractTextPlugin('style.bundle.css'), // CSS will be extracted to this bundle file
  ],
  // Loaders configuration
  // We are telling webpack to use "babel-loader" for .js and .jsx files
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      // CSS loader for CSS files
      // Files will get handled by css loader and then passed to the extract text plugin
      // which will write it to the file we defined above
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: 'css-loader',
        }),
      },
      // File loader for image assets
      // We'll add only image extensions, but you can add things like svgs, fonts and videos
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
          },
        },
      },
    ],
  },
  // Enable importing JS files without specifying their's extension
  //
  // So we can write:
  // import MyComponent from './my-component'
  //
  // Instead of:
  // import MyComponent from './my-component.jsx'
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
