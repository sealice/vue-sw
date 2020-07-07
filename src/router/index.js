import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

const _assign = Object.assign;

function disintegrationRoutes(routes, parentPath = '', auth = false) {
    const _routes = [];

    (function _disintegrationRoutes(routes, parentPath, auth, alive) {
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

            children && _disintegrationRoutes(children, path, requireAuth, keepAlive);
        });
    })(routes, parentPath, auth);

    return _routes;
}

Vue.use(VueRouter);
export default new VueRouter({
    routes: disintegrationRoutes(routes),
});
