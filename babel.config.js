module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        loose: true,
        polyfills: ['es.array.iterator', 'es.object.assign', 'es.promise', 'es.promise.finally'],
      },
    ],
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-plus',
        libDir: 'lib',
        styleLibraryName: '../lib/theme-chalk',
      },
    ],
    '@vue/babel-plugin-transform-vue-jsx',
    'lodash',
  ],
};
