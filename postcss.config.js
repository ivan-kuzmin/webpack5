module.exports = {
  plugins: {
    'postcss-preset-env': {
      browsers: process.env.NODE_ENV === 'development' ? 'last 1 versions' : 'cover 99.5%',
    },
  },
}
