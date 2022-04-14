import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { LOGGED_GET } from './store/types';

if (process.env.VUE_APP_PWA === 'true') {
    require('./registerServiceWorker');
}

// ElementUI
import ElementUI from './utils/element-ui';
Vue.use(ElementUI);

// 公共组件
import Components from './components';
Vue.use(Components);

// 过滤器
import filter from './filter';
Vue.use(filter);

// 公共Vue实例，用于数据通信
import bus from './utils/bus';
Vue.use(bus);

// 路由拦截（前置守卫）
const loginPath = '/login';
router.beforeEach((to, from, next) => {
    store.dispatch(LOGGED_GET).then(isLogin => {
        if (to.matched.some(record => record.meta.requireAuth)) {
            next(
                isLogin || {
                    path: loginPath,
                    query: { redirect: to.fullPath },
                }
            );
        } else {
            next(!isLogin || to.path != loginPath || from);
        }
    });
});

const originalPush = router.push;
router.push = function push(location) {
    return originalPush.call(this, location).catch(() => {});
};

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
