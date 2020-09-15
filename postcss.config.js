const IN_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    require('autoprefixer'),
    IN_PRODUCTION &&
      require('@fullhuman/postcss-purgecss')({
        content: [`./public/**/*.html`, `./src/**/*.vue`, `./src/style/*.less`],
        defaultExtractor(content) {
          const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '');
          return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
        },
        whitelist: ['circular'],
        whitelistPatterns: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
          // element-ui
          /el-(form|input|select|radio|checkbox|switch|date|button|tag|link)/,
          /el-(alert|loading|message|notification|dialog|tooltip|popover)/,
          /el-(table|pagination|breadcrumb|dropdown|card|menu|icon)/,
        ],
      }),
  ],
};
