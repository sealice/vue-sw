import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '../store';
import * as types from '../store/types';

Vue.use(VueRouter);

const _routes = [];
const _assign = Object.assign;
(function disintegrationRoutes(routes, parentPath, auth, alive) {
    routes.forEach(route => {
        let { path, children, meta = {} } = route;
        let { requireAuth, keepAlive } = meta;

        if (!requireAuth) {
            requireAuth = auth;
        }

        if (keepAlive === void 0) {
            keepAlive = alive;
        }

        if (path.indexOf('/') != 0) {
            path = parentPath.concat('/', path);
        }

        _routes.push(
            _assign({ name: path.substr(1).replace(/\//g, '_') }, route, {
                path,
                children: void 0,
                meta: _assign({}, meta, { requireAuth, keepAlive }),
            })
        );

        children && disintegrationRoutes(children, path, requireAuth, keepAlive);
    });
})(routes, '', false, false);

const router = new VueRouter({
    routes: _routes,
});

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

export default router;
