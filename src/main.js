import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
// import particles from './plugins/particles'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios

import Particles from "particles.vue";

Vue.use(Particles);

export const bus = new Vue();
new Vue({
  vuetify,
  // particles,
  router,
  render: h => h(App)
}).$mount('#app')
