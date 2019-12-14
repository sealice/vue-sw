const routes = [
    {
        path: '/',
        name: 'home',
        meta: { title: 'Home', requireAuth: false },
        components: require('../views/Home.vue'),
    },
    {
        level: 2,
        path: '/about',
        meta: { title: 'About', requireAuth: true, keepAlive: true },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
        children: [
            {
                path: 'bar',
                meta: { title: 'Bar' },
                components: require('../components/HelloWorld.vue'),
            },
        ],
    },
    {
        level: 2,
        path: '/hello',
        meta: { title: 'Hello', layout: false },
        components: require('../components/HelloWorld.vue'),
    },
    {
        path: '/login',
        meta: { title: 'Login', layout: false },
        components: require('../views/Login.vue'),
    },
];

export default routes;
