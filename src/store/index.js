import Vue from 'vue';
import Vuex from 'vuex';
import menu from './modules/menu';
import user from './modules/user';

Vue.use(Vuex);

/* eslint-disable no-unused-vars */
export default new Vuex.Store({
    modules: {
        menu,
        user,
    },
    state: {
        //
    },
    getters: {
        //
    },
    mutations: {
        //
    },
    actions: {
        //
    },
});
