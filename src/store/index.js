import Vue from 'vue';
import Vuex from 'vuex';
import theme from './modules/theme';
import menu from './modules/menu';
import user from './modules/user';

Vue.use(Vuex);

/* eslint-disable no-unused-vars */
export default new Vuex.Store({
    modules: {
        theme,
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
