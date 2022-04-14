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
        if (to.matched.some(record => record.meta.auth)) {
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

// 页面使用keep-alive组件缓存的，需始终使用 $dewatch 观察 $route 等页面共享参数的变化
Vue.prototype.$dewatch = function(expOrFn, callback, option) {
    let unwatch;
    const fn = () => {
        if (!unwatch) {
            unwatch = this.$watch(expOrFn, callback, option);
        }
    };

    fn();
    this.$on('hook:activated', fn);
    this.$on('hook:deactivated', () => {
        unwatch = void unwatch();
    });
};

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
