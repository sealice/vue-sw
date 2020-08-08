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
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-export-default-from',
    'lodash',
  ],
};
