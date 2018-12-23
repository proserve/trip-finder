const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: '/node_modules/' },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      {
        test: /\.(svg|html|xml)$/i,
        use: 'raw-loader',
      }, {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)/,
        use: 'url-loader',
      },
    ],
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([{ from: './src/assets/', to: path.resolve(__dirname, 'dist/assets') }]),
    new BundleAnalyzerPlugin(),
  ],
};
