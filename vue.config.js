const _ = require('lodash');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const middleware = require('hm-middleware');

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  indexPath: 'index.html',

  devServer: {
    proxy: null,

    before: function(app) {
      // 使用 mock api
      app.use(
        middleware({
          mockRules: {
            '/v1': 'mock',
          },
          proxy: {
            autoSave: true,
            saveDirectory: '.data',
            overrideSameFile: 'override',
          },
        })
      );
    },
  },

  lintOnSave: true,
  productionSourceMap: false,
  transpileDependencies: ['element-ui'],

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

  chainWebpack(config) {
    config.optimization.splitChunks(
      _.merge(config.optimization.get('splitChunks'), {
        cacheGroups: {
          vendors: { name: 'vendor' },
          common: { name: 'common' },
          elementUI: {
            name: 'element-ui',
            test: /[\\/]node_modules[\\/]element-ui/,
            priority: -5,
            chunks: 'initial',
          },
        },
      })
    );

    config.when(process.env.NODE_ENV === 'production', config => {
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
                drop_debugger: true,
                pure_funcs: ['console.log'], // 打包移除console.log
              },
            },
          })
        )
      );

      // gzip压缩文件
      config.plugin('compressionPlugin').use(
        new CompressionWebpackPlugin({
          test: /\.(js|css|json|ico|svg)(\?.*)?$/i,
          threshold: 10240, // 对超过10kb的文件压缩
          deleteOriginalAssets: false,
        })
      );
    });
  },
};
