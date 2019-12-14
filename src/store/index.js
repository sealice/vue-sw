import Vue from 'vue';
import Vuex from 'vuex';
import { baseService } from '../service';
import * as types from './types';
import menu from './menu';

Vue.use(Vuex);

let loggedInfoRequested = false;

/* eslint-disable no-unused-vars */
export default new Vuex.Store({
    state: {
        isLogin: false,
        menu,
    },
    mutations: {
        [types.LOGGED_INFO](state, data) {
            state.isLogin = true;
        },
    },
    actions: {
        [types.LOGGED_INFO]({ state, commit }) {
            return new Promise(resolve => {
                if (loggedInfoRequested) return resolve(state.isLogin);

                loggedInfoRequested = true;
                baseService
                    .getUser()
                    .then(({ data }) => {
                        commit(types.LOGGED_INFO, data);
                        resolve(true);
                    })
                    .catch(() => {
                        resolve(false);
                    });
            });
        },
        [types.LOGIN]({ state, commit }, data) {
            return baseService.login(data, { disableInterceptor: true }).then(({ data }) => {
                commit(types.LOGGED_INFO, data);
                return true;
            });
        },
    },
    modules: {},
});
