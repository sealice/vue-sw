import routes from '../router/routes';

const menu = (function generateMenu(routes, firstly, parentPath, menuLevel) {
    let menu = [];

    routes.forEach(route => {
        let { path, name, level, meta = {}, children = [] } = route;
        let { title, icon } = meta;
        menuLevel = menuLevel || level || 0;

        if (path.indexOf('/') != 0) {
            path = parentPath.concat('/', path);
        }

        if (menuLevel > 0) {
            if (children.length) {
                level = menuLevel - 1;
                children = level > 0 ? generateMenu(children, false, path, level) : [];
            }
            menu.push({
                path,
                children,
                meta: { title, icon },
                name: name || path.substr(1).replace(/\//g, '_'),
            });
        }

        if (firstly) {
            menuLevel = 0;
        }
    });

    return menu;
})(routes, true, '');

export default menu;
