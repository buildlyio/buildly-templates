/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const envConfig = require('./environments.config.json');

module.exports = (env, argv) => {
  const fileReplacements = [];
  if (env) {
    const configuration = envConfig.configurations[env.build];
    if (configuration && configuration.fileReplacements) {
      for (const replacement of configuration.fileReplacements) {
        // create Webpack module rule
        const replace = {
          test: path.resolve(replacement.replace),
          loader: 'file-replace-loader',
          options: {
            replacement: path.resolve(replacement.with),
            async: true
          }
        }
        fileReplacements.push(replace);
      }
    }
  }

  const webpackConfig = {
    entry: ["babel-polyfill", "./src/index.js"],
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  "targets": "defaults"
                }],
                '@babel/preset-react'
              ],
              plugins: [
                "@babel/plugin-proposal-class-properties"
              ]
            }
          }]
        },
        {
          test: /\.(js|jsx)$/,
          use: 'react-hot-loader/webpack',
          include: /node_modules/
        },
        {
          test: /\.(css|scss)$/,
          use: [
            "style-loader",
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            "file-loader",
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true,
                disable: true
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ]
        },
        ...fileReplacements
      ]
    },
    resolve: {
      extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
      modules: [path.resolve(__dirname, './src'), 'node_modules'],
      alias: {
        assets: path.resolve(__dirname, './src/assets'),
        environments: path.resolve(__dirname, './src/environments'),
        components: path.resolve(__dirname, './src/midgard/components'),
        hooks: path.resolve(__dirname, './src/midgard/hooks'),
        layout: path.resolve(__dirname, './src/midgard/layout'),
        midgard: path.resolve(__dirname, './src/midgard'),
        modules: path.resolve(__dirname, './src/midgard/modules'),
        pages: path.resolve(__dirname, './src/midgard/pages'),
        routes: path.resolve(__dirname, './src/midgard/routes'),
        styles: path.resolve(__dirname, './src/styles'),
        utils: path.resolve(__dirname, './src/midgard/utils')
      }
    },
    output: {
      path: path.resolve(__dirname, "dist/"),
      publicPath: '/',
      filename: "bundle.js"
    },
    devServer: {
      contentBase: path.join(__dirname, "public/"),
      port: 3000,
      publicPath: "http://localhost:3000/",
      historyApiFallback: true,
      hotOnly: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebPackPlugin({
          template: "./src/index.html",
          filename: "./index.html",
          favicon: './src/assets/favicon.ico',
          hash: true,
      }),
      new CopyPlugin([
        { from: 'window.environment.js', to: 'environment.js' },
      ]),
    ]
  };

  if (env && env.build === 'prod') {
    webpackConfig.mode = 'production';
    webpackConfig.devtool = false;
    webpackConfig.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    };
    webpackConfig.optimization = {
      namedModules: false,
      namedChunks: false,
      nodeEnv: 'production',
      flagIncludedChunks: true,
      occurrenceOrder: true,
      sideEffects: true,
      usedExports: true,
      concatenateModules: true,
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        },
        minSize: 30000,
        maxAsyncRequests: 3,
      },
      noEmitOnErrors: true,
      minimize: true,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
    };
  } else {
    webpackConfig.mode = 'development';
    webpackConfig.devtool = 'inline-source-map';
  }

  return webpackConfig;
};
