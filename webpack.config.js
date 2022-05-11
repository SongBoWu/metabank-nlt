const path = require('path');

module.exports = {
  entry: './src/game.ts',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader'
      },
      {
        test: require.resolve('Phaser'),
        loader: 'expose-loader',
        options: { exposes: { globalName: 'Phaser', override: true } }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
      // publicPath: 'http://localhost:8080/dist/',
    },
    host: 'localhost',
    port: 8080,
    open: false
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};
