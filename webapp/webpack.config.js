const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const routes = require('./src/routes.js');

function loadTemplate(routes) {
  let _routes = routes.routes;
  return Object.keys(routes.routes).map(routeIndex => {
    _route = _routes[routeIndex];
    return new HtmlWebpackPlugin({
      filename: `${_route.componentName}.html`,
      template: path.resolve(__dirname, `src/components/${_route.componentName}/${_route.componentName}.html`),
      chunks: [_route.componentName],
      inject: true
    });
  });
}

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
      {
        test: /\.css$|.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /fav\.(png|jpg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './assets/img',
          to: 'img',
        },
        {
          from: './styles/eos-icon',
          to: 'eos-icon',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/frame/sidebar/sidebar.html',
      filename: 'sidebar.html',
      chunks: ['sidebar'],
      inject: true
    }),
    ...loadTemplate(routes)
  ],
};
