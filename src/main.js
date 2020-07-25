import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { GET_USER_INFO } from './store/types';
import './registerServiceWorker';

// 过滤器
import filter from './filter';
Vue.use(filter);

// 公共Vue实例，用于数据通信
import Bus from '@/utils/bus.js';
Vue.use(Bus);

// 路由拦截（前置守卫）
router.beforeEach((to, from, next) => {
    store.dispatch(GET_USER_INFO).then(isLogin => {
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
