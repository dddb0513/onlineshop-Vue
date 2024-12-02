import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'; // 导入路由配置
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './components/store.js'; // 引入 store

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(Vuex);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
