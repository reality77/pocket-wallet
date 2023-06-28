const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/pocket-wallet/user/'
    : '/',
  outputDir: '../dist/user/'  
})
