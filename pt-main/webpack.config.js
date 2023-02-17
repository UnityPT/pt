import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

export default {
  entry: './src/main.ts',
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.cjs',
    path: path.resolve('dist/main'),
    clean: true
  },
  plugins: [
    new CopyPlugin({
      patterns: ['preload.js'],
    }),
  ],
  externals: {
    ssh2: 'commonjs ssh2'
  },
};
