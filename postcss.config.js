const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    require('autoprefixer'),
    isProduction &&
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
              const match = a.match(/[\w-]+(?<!:)/g);
              if (match) {
                match.forEach(item => {
                  selectors.includes(item) || selectors.push(item);
                });
              }
            }
          });

          return selectors;
        },
        safelist: {
          standard: [
            /-(leave|enter|appear)(|-(to|from|active))$/,
            /^(?!(|.*?:)cursor-move).+-move$/,
            /^router-link(|-exact)-active$/,
            /data-v-.*/,
            'class',
          ],
          deep: [/el-.*/],
        },
      }),
  ],
};
