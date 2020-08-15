import { LOGIN, LOGOUT, LOGGED_GET, USER_SET_INFO } from '../types';
import { login, getUser } from '@/service';

let loggedInfoRequested = false;
const _assign = Object.assign;
const defInfo = () => ({
    id: 0,
    name: '',
});

export default {
    state: defInfo(),
    getters: {
        isLogin(state) {
            return !!(state.id && state.name);
        },
    },
    mutations: {
        [USER_SET_INFO](state, data) {
            _assign(state, data);
        },
    },
    actions: {
        [LOGIN]({ getters, commit }, data) {
            return login(data).then(res => {
                commit(USER_SET_INFO, res.data);
                return getters.isLogin;
            });
        },
        [LOGOUT]({ getters, commit }) {
            return new Promise(resolve => {
                commit(USER_SET_INFO, defInfo());
                resolve(getters.isLogin);
            });
        },
        [LOGGED_GET]({ getters, commit }) {
            return new Promise(resolve => {
                if (loggedInfoRequested) {
                    return resolve(getters.isLogin);
                }

                loggedInfoRequested = true;

                getUser()
                    .then(res => {
                        commit(USER_SET_INFO, res.data);
                    })
                    .finally(() => {
                        resolve(getters.isLogin);
                    });
            });
        },
    },
};
