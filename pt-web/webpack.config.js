const {ProvidePlugin} = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: "html-loader",
          },
          {
            loader: "markdown-loader",
            options: {
              // Pass options to marked
              // See https://marked.js.org/using_advanced#options
            },
          },
        ],
      },
    ],
  },
  resolve: {
    // configuration options
    fallback: {
      util: require.resolve("util/"),
      path: require.resolve("path-browserify"),
      http: false,
      https: false,
      querystring: false,
      url: false
    },
  },
  plugins: [
    new ProvidePlugin({
      Buffer: ['buffer/', 'Buffer'],
      process: "process/browser",
    }),
  ],
  node: {
    global: true
  }
};
