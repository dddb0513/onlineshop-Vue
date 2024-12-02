import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// store.js
export const logStore = new Vuex.Store({
    state: {
        isLoggedIn: sessionStorage.getItem("isLoggedIn"),
        displayName: sessionStorage.getItem("displayName"),
        loggedUserType: sessionStorage.getItem("loggedUserType"),
    },
    mutations: {
        setUser(state, {
            isLoggedIn,
            displayName,
            loggedUserType
        }) {
            state.isLoggedIn = isLoggedIn;
            state.displayName = displayName;
            state.loggedUserType = loggedUserType;
        },
    },
  });