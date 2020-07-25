const _ = require('lodash');
const LodashWebpackPlugin = require('lodash-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  indexPath: 'index.html',

  devServer: {
    proxy: null,
  },

  lintOnSave: true,
  productionSourceMap: false,
  transpileDependencies: [],

  configureWebpack: {
    plugins: [
      new LodashWebpackPlugin(),
      new GenerateSW({
        // importWorkboxFrom: 'local',
        // runtimeCaching: [
        //   {
        //     urlPattern: /\/api/,
        //     method: 'GET',
        //     handler: 'NetworkFirst',
        //     options: {
        //       networkTimeoutSeconds: 10,
        //       cacheableResponse: {
        //         statuses: [0, 200],
        //         headers: { 'X-Is-Cacheable': 'true' },
        //       },
        //     },
        //   },
        // ],
      }),
    ],
  },

  chainWebpack: config => {
    config.plugin('html').tap(args =>
      args.map(arg =>
        _.merge(arg, {
          minify: {
            removeAttributeQuotes: false,
            removeScriptTypeAttributes: false,
            // preserveLineBreaks: true,
          },
        })
      )
    );

    config.optimization.minimizer('terser').tap(args =>
      args.map(arg =>
        _.merge(arg, {
          terserOptions: {
            compress: {
              pure_funcs: ['console.log'], // 打包移除console.log
            },
          },
        })
      )
    );
  },
};