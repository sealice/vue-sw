const IN_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    require('autoprefixer'),
    IN_PRODUCTION &&
      require('@fullhuman/postcss-purgecss')({
        content: ['./public/**/*.html', './src/**/*.vue'],
        defaultExtractor(content) {
          const selectors = [];
          content.replace(/<(template|html)[^]+<\/\1>|<(script)[^]+<\/\2>/g, (a, t, s) => {
            if (t) {
              a.replace(/(?<=(id|class(name)?|icon)="?)([\w\s\-?:'{}]+)|(?<=<)[\w-]+/g, b => {
                const match = b.match(/[\w-]+/g);
                if (match) {
                  match.forEach(item => {
                    selectors.includes(item) || selectors.push(item);
                  });
                }
              });
            } else if (s) {
              const match = a.match(/[\w-/:]+(?<!:)/g);
              match && selectors.push(...match);
            }
          });

          return selectors;
        },
        whitelist: ['class', 'circular'],
        whitelistPatterns: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
          // element-ui
          /el-(form|input|select|radio|checkbox|switch|date|button|tag|link)/,
          /el-(alert|loading|message|notification|dialog|tooltip|popover)/,
          /el-(table|pagination|breadcrumb|dropdown|card|menu)/,
          /el-icon-(plus|minus|arrow|caret|circle|time|date|star|search|back|close|check|success|info|warning|error|question)/,
        ],
      }),
  ],
};
