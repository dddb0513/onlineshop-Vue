import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const cartStore=new Vuex.Store({
    state: {
        cartItems: [],//购物车商品数组
        cartDisplayName: sessionStorage.getItem("displayName"),
    },
    

    actions: {
        async fetchCartItems({ commit,state }) {
            const fetchCartItemsData={
                userName: state.cartDisplayName,
            }
            const response = await axios.get('http://localhost:8081/fetchCartItems',fetchCartItemsData);
            commit('SET_CART_ITEMS', response.data.data);
          },
    },

    mutations: {
        SET_CART_ITEMS(state, items) {
            state.cartItems = items;
          },
    },
})