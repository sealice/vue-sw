import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'home',
                    meta: { title: 'Home', auth: false },
                    components: require('../views/home/index.vue'),
                },
            ],
        },
        {
            path: '/login',
            meta: { title: 'Login', auth: false },
            components: require('../views/login/index.vue'),
        },
    ].concat(routes),
});

export default router;
