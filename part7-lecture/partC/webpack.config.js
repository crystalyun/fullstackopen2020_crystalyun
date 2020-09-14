const path = require('path')
const webpack = require('webpack')

// argv parameter can be used for accessing the mode that is defined in the npm script
const config = (env, argv) => {
  console.log('print out argv.mode : ', argv.mode)

  const backend_url = argv.mode === 'production'
  ? 'https://blooming-atoll-75500.herokuapp.com/api/notes'
  : 'http://localhost:3001/notes'

  return {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
              test: /\.js$/,
              loader: 'babel-loader',
              query: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            },
            {
              test: /\.css$/,
              loaders: ['style-loader', 'css-loader'],
            },
        ]
    },
    // Let's define a new global constant BACKEND_URL, that gets a different value depending on the environment that the code is being bundled for.
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
  }
}

module.exports = config