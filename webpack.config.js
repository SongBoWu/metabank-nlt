const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: './process.stage.env',
});

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
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        API_KEY: JSON.stringify(`${dotenv.parsed.API_KEY}`),
        AUTH_DOMAIN: JSON.stringify(`${dotenv.parsed.AUTH_DOMAIN}`),
        PROJECT_ID: JSON.stringify(`${dotenv.parsed.PROJECT_ID}`),
        STORAGE_BUCKET: JSON.stringify(`${dotenv.parsed.STORAGE_BUCKET}`),
        MESSAGING_SENDER_ID: JSON.stringify(`${dotenv.parsed.MESSAGING_SENDER_ID}`),
        APP_ID: JSON.stringify(`${dotenv.parsed.APP_ID}`),
        MEASUREMENT_ID: JSON.stringify(`${dotenv.parsed.MEASUREMENT_ID}`),
      }
    }),
  ]
};
