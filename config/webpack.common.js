const paths = require('./paths')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ESBuildPlugin } = require('esbuild-loader')

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + '/index.tsx'],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: './',
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
        },
      ],
    }),

    // Generates an HTML file from a template
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      favicon: paths.src + '/assets/images/favicon.png',
      // template file
      template: paths.src + '/index.html',
      filename: 'index.html', // output file
    }),

    // esbuild plugin to transpile Typescript files
    new ESBuildPlugin(),
  ],

  // Webpack resolve options
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  // Determine how modules within the project are treated
  module: {
    rules: [
      // Typescript: Use esbuild-loader to transpile Typescript files
      {
        test: /\.tsx?|jsx?$/,
        loader: 'esbuild-loader',
        exclude: /node_modules/,
        options: {
          loader: 'tsx', // Or 'ts' if you don't need tsx
          target: 'es2015'
        }
      },

      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|)$/, type: 'asset/inline' },

      // SVGs: import svg as react component
      {
        test: /\.svg$/,
        use: [
          "babel-loader",
          {
            loader: "react-svg-loader",
            options: {
              svgo: {
                plugins: [
                  { removeTitle: false }
                ],
                floatPrecision: 2
              }
            }
          }
        ]
      }
    ],
  },
}
