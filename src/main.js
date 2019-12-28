import Vue from 'vue';
import App from './App.vue';
import filter from './filter';
import router from './router';
import store from './store';
import * as types from './store/types';
import './registerServiceWorker';
import './service';

Vue.use(filter);

// 路由拦截（前置守卫）
router.beforeEach((to, from, next) => {
    store.dispatch(types.LOGGED_INFO).then(isLogin => {
        if (to.matched.some(record => record.meta.requireAuth)) {
            if (isLogin) {
                next();
            } else {
                next({
                    name: 'login',
                    query: { redirect: to.fullPath },
                });
            }
        } else {
            isLogin && to.name == 'login' ? next({ path: '/', replace: true }) : next();
        }
    });
});

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
