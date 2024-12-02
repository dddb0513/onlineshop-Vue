import Vue from 'vue';
import Vuex from 'vuex';
import {cartStore} from './cartStore.js';
import {logStore} from './logStore.js';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
      cartStore, // 使用 cart 模块
      logStore, // 使用 user 模块
    },
  });
  
  export default store;