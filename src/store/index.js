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
        [types.SET_USER_INFO](state, data) {
            state.isLogin = true;
        },
    },
    actions: {
        [types.LOGIN]({ state, commit }, data) {
            return baseService.login(data, { disableInterceptor: true }).then(data => {
                commit(types.SET_USER_INFO, data);
                return true;
            });
        },
        [types.GET_USER_INFO]({ state, commit }) {
            return new Promise(resolve => {
                if (loggedInfoRequested) {
                    return resolve(state.isLogin);
                }

                loggedInfoRequested = true;
                baseService
                    .getUser()
                    .then(({ data }) => {
                        commit(types.SET_USER_INFO, data);
                        resolve(true);
                    })
                    .catch(() => {
                        resolve(false);
                    });
            });
        },
    },
    modules: {},
});
