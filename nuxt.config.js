const pkg = require('./package')

module.exports = {
  mode: 'spa',

  srcDir: 'app',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/sweet-modal',
    '~/plugins/vue-qriously',
    '~/plugins/myFunctions',
    { src: "~/plugins/vuex-persistedstate.js", ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    ['@nuxtjs/dotenv',{ filename: '.env.production' }],
    'nuxt-onsenui-module',
    '@nuxtjs/style-resources',
    'nuxt-fontawesome'
  ],

  styleResources: {
    scss: [
      '@/assets/sass/foundation/mixin/_index.scss'
    ]
  },

  router: {
    mode: 'hash'
  },

  dev: process.env.NODE_ENV === 'development',


  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'element-ui',
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      vendor: [
        'vuex',
      ]
      /*
       ** Build electron 
       */
      config.output.publicPath = './_nuxt/'
      if (process.env.NODE_ENV == 'development') {
        config.target = 'electron-renderer'
      }
    }
  },
  server: {
    port: 13000, // デフォルト: 3000
  },
}
