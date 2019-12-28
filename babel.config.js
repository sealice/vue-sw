module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        loose: true,
        polyfills: ['es.object.assign', 'es.promise', 'es.promise.finally'],
      },
    ],
  ],
  plugins: ['lodash'],
};
