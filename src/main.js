import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { LOGGED_GET } from './store/types';
import './registerServiceWorker';

// ElementUI
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
Vue.use(ElementUI);

// 过滤器
import filter from './filter';
Vue.use(filter);

// 公共Vue实例，用于数据通信
import bus from './utils/bus';
Vue.use(bus);

// 公共组件
import Components from './components';
Vue.use(Components);

// 路由拦截（前置守卫）
router.beforeEach((to, from, next) => {
    store.dispatch(LOGGED_GET).then(isLogin => {
        if (to.matched.some(record => record.meta.requireAuth)) {
            isLogin
                ? next()
                : next({
                      name: 'login',
                      query: { redirect: to.fullPath },
                  });
        } else {
            isLogin && to.name == 'login'
                ? next({
                      path: to.query.redirect || '/',
                      replace: true,
                  })
                : next();
        }
    });
});

new Vue({
    store,
    router,
    render: h => h(App),
    created() {
        let loadingInstance;

        bus.on('loading:show', ({ text } = {}) => {
            loadingInstance = this.$loading({
                text,
                lock: true,
                fullscreen: true,
                customClass: 'full-loading',
            });
        }).on('loading:hide', () => {
            if (loadingInstance) {
                loadingInstance = loadingInstance.close();
            }
        });
    },
}).$mount('#app');
