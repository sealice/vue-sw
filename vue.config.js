const path = require('path');
const _ = require('lodash');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const middleware = require('hm-middleware');

// 是否gzip打包
process.env.GZIP = process.env.npm_config_gzip || 'false';
// 是否生成service worker
process.env.VUE_APP_PWA = process.env.npm_config_pwa || 'false';
// 开发默认代理环境
process.env.VUE_APP_PROXYENV = process.env.npm_config_proxyenv || 'dev';

function resolve(dir) {
  return path.join(__dirname, dir);
}

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
  css: { sourceMap: true },
  productionSourceMap: false,
  transpileDependencies: ['element-ui'],

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve('src/style/_globalValue.less')],
    },
  },
  configureWebpack: {
    externals: {},
    resolve: {
      alias: {
        '@common': resolve('src/views/@common'),
      },
    },
    plugins: [new HardSourceWebpackPlugin(), new LodashWebpackPlugin()].concat(
      process.env.VUE_APP_PWA === 'true'
        ? new GenerateSW({
            importWorkboxFrom: 'local',
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
          })
        : []
    ),
  },

  chainWebpack(config) {
    config.optimization.splitChunks(
      _.merge(config.optimization.get('splitChunks'), {
        minSize: 1,
        maxSize: 0,
        cacheGroups: {
          vendors: { name: 'vendor' },
          common: { name: 'common' },
          elementUI: {
            name: 'element-ui',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: -5,
            chunks: 'initial',
          },
          // views下页面文件分模块合并
          views: {
            test: /[\\/]views[\\/]/,
            name(module) {
              let name;
              const moduleFileName = module
                .identifier()
                .replace(/\?[^?]*$/, '')
                .split(/views[\\/]/);

              // 过滤的文件夹和文件
              const reg = /(@common|components)|\.(vue|ts|js|json)$/;

              if (moduleFileName[1]) {
                name = moduleFileName[1]
                  .split(/[\\]/)
                  .slice(0, 1) // 按views下文件夹的多少层级合并页面
                  .filter(v => !reg.test(v))
                  .join('-');
              }

              return name || 'common';
            },
            chunks: 'async',
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
              preserveLineBreaks: true,
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
      if (process.env.GZIP === 'true') {
        config.plugin('compressionPlugin').use(
          new CompressionWebpackPlugin({
            test: /\.(js|css|json|ico|svg)(\?.*)?$/i,
            threshold: 10240, // 对超过10kb的文件压缩
            deleteOriginalAssets: false,
          })
        );
      }
    });
  },
};
