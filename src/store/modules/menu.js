import routes from '@/router/routes';

const menu = (function generateMenu(routes, firstly, parentPath, menuLevel, auth = false) {
    let menu = [];

    routes.forEach(route => {
        let { path, name, level, meta = {}, children = [] } = route;
        let { title, icon, requireAuth } = meta;
        menuLevel = menuLevel || level || 0;

        if (!requireAuth) {
            requireAuth = auth;
        }

        if (path.indexOf('/') != 0) {
            path = parentPath.concat('/', path);
        }

        if (menuLevel > 0) {
            if (children.length) {
                level = menuLevel - 1;
                children = level > 0 ? generateMenu(children, false, path, level, requireAuth) : [];
            }
            menu.push({
                path,
                children,
                title,
                icon,
                requireAuth,
                name: name || path.substr(1),
            });
        }

        if (firstly) {
            menuLevel = 0;
        }
    });

    return menu;
})(routes, true, '');

export default {
    state: menu,
};
