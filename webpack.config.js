module.exports = {
  entry: ['babel-polyfill', "./src/openseadragon-annotations.js"],
  output: {
    path: './dist',
    filename: "openseadragon-annotations.js",
    libraryTarget: "umd"
  },
  externals: {
    "OpenSeadragon": "OpenSeadragon"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.png$/, loader: 'url' },
      { test: /\.cur$/, loader: 'url?mimetype=image/vnd.microsoft.icon' },
    ]
  },
  devtool: 'source-map'
};
