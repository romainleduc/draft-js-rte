const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  optimization: {
    minimize: false,
  },
  output: {
    path: path.resolve('lib'),
    filename: 'index.js',
    library: 'draftJsRte',
    libraryTarget: 'umd',
  },
  plugins: [new MiniCssExtractPlugin({
    filename: 'Draft.css',
  })],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: [
    {
      react: 'react',
      immutable: 'immutable',
      'react-dom': 'react-dom',
      'draft-js': 'draft-js',
    },
  ]
}