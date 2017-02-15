const path = require('path')

module.exports = (options, req) => ({
  entry: 'src/index.js',
  html: {
    title: 'Texy',
    template: 'index.html',
  },
  webpack: {
    resolve: {
      modules: [path.resolve('./src')]
    }
  },
  postcss: [
    req('autoprefixer')({
      browsers: ['last 4 versions', 'ie > 8']
    }),
    require('postcss-nested')
  ]
})
