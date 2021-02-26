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
const loginPath = '/login';
router.beforeEach(async (to, from) => {
    const isLogin = await store.dispatch(LOGGED_GET);

    if (to.matched.some(record => record.meta.requireAuth)) {
        return isLogin || { path: loginPath };
    }

    if (isLogin && to.path == loginPath) {
        return false;
    }
});

app.mount('#app');
