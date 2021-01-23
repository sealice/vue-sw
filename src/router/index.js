import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

function disintegrationRoutes(routes, parentPath = '', auth = false) {
    const _routes = [];

    (function _disintegrationRoutes(routes, parentPath, auth, alive, lay = true) {
        routes.forEach(route => {
            let { path, children, meta = {}, ...other } = route;
            let { requireAuth, keepAlive, layout } = meta;

            if (!requireAuth) {
                requireAuth = auth;
            }

            if (keepAlive === void 0) {
                keepAlive = alive;
            }

            if (layout === void 0) {
                layout = lay;
            }

            if (path.indexOf('/') != 0) {
                path = parentPath.concat('/', path);
            }

            _routes.push({
                name: path.substr(1),
                ...other,
                path,
                meta: { ...meta, requireAuth, keepAlive, layout },
            });

            children && _disintegrationRoutes(children, path, requireAuth, keepAlive, layout);
        });
    })(routes, parentPath, auth);

    return _routes;
}

const router = createRouter({
    history: createWebHashHistory(),
    routes: disintegrationRoutes(routes),
});

export default router;
