import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { LOGGED_GET } from './store/types';
import './registerServiceWorker';

const app = createApp(App);
app.use(store).use(router);

// ElementUI
import ElementUI from './utils/element-plus';
app.use(ElementUI);

// 公共组件
import Components from './components';
app.use(Components);

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

app.mount('#app');
