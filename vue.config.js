module.exports = {
  devServer: {
    proxy: 'http://mnt.funquestvr.office/', // 'https://api.liverez.com/', 'https://dev.funquestvr.office:8080/', */
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
}