export default {
    menu: true,
    path: '/about',
    meta: { title: 'About', auth: true, keepAlive: true },
    component: 'about/About',
    children: [
        {
            menu: true,
            path: 'bar',
            meta: { title: 'Bar' },
            component: 'about/HelloWorld',
        },
    ],
};
