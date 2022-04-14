import _import from './_import';
import Layout from '@/layout/index.vue';
import KeepView from '@/layout/keep-view.vue';

// 自动加载路由模块
let moduleRoutes = [];
const modules = require.context('./modules/', false, /\.js$/);
modules.keys().forEach((key, i) => {
    const route = modules(key).default;
    if (route) {
        moduleRoutes[i] = route;
    }
});

// 过滤空文件
moduleRoutes = moduleRoutes.filter(Boolean);
moduleRoutes = [].concat(...moduleRoutes);

// 页面缓存包装处理
function pageCacheWrapper(page, routeName) {
    const component = page.default || page;
    const activated = component.activated;

    component.name = routeName; // 设置页面name属性和路由一致，以便做页面缓存

    if (activated) {
        // 初始化页面时不执行钩子 activated
        component.activated = function() {
            if (!this.$options.isCache) {
                this.$options.isCache = true;
                return;
            }

            activated.apply(this);
        };
    }

    return page;
}

function routeConversion(route, opts) {
    let { path, name, component, meta = {}, children = [] } = route;
    const { path: parentPath, firstly, auth, menus } = opts;
    const isParentPage = component === Layout || component === KeepView;

    if (path && path.indexOf('/') != 0) {
        route.path = path = parentPath.concat('/', path);
    }

    if (!name) {
        name = path.replace(/^\/|\/$/g, '').replace(/\//g, '_');
    }

    if (!meta.auth) {
        meta.auth = auth;
    }

    // 路由处理
    if (!isParentPage) {
        if (typeof component === 'string') {
            component = _import(component);
        }

        if (typeof component === 'function') {
            route.component = () => {
                return component().then(page => pageCacheWrapper(page, name));
            };
        } else {
            if (route.components) {
                component = route.components.default;
                delete route.components;
            }

            component = pageCacheWrapper(component, name);
        }

        if (firstly || children.length) {
            children.unshift({
                path: '',
                meta: meta,
                name: name,
                component: component,
            });

            route.component = firstly ? Layout : KeepView;
        } else {
            route.name = name;
        }
    }
    // end

    // 菜单处理
    const menuItem = {
        name,
        path: path || parentPath,
        auth: meta.auth,
        icon: meta.icon,
        title: meta.title,
        children: [],
    };

    const menu = route.menu;
    delete route.menu;
    if (menu ?? true) {
        menus.push(menuItem);
    }
    // end

    if (children.length) {
        const node = handleRouting(children, { path, firstly: false, auth: meta.auth });
        route.children = node.routes;

        if (menu ?? true !== 'only') {
            menuItem.children = node.menus;
        }
    }
}

// 处理路由模块及生成菜单（添加name属性，动态加载页面）
export function handleRouting(routes, opts = { path: '', firstly: true, auth: false }) {
    if (!routes || !Array.isArray(routes)) {
        return { routes: [], menus: [] };
    }

    const menus = (opts.menus = []);

    routes.forEach(route => {
        routeConversion(route, opts);
    });

    return { routes, menus };
}

const { routes, menus } = handleRouting(moduleRoutes);

export { routes, menus };

export default routes;
