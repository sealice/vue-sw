<template>
    <div>
        <span v-for="(item, i) in navs" :key="i">{{ item.title }} &gt;</span>
    </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp';

export default {
    computed: {
        navs() {
            const navs = [];
            const paths = this.$route.path.split('/');
            const routes = this.$router.options.routes;

            for (let i = 0, r = 1, len = routes.length, size = paths.length; i < len; i++) {
                const path = paths.slice(0, r).join('/') || '/';
                if (pathToRegexp(routes[i].path).test(path)) {
                    navs.push({
                        path: path,
                        title: routes[i].meta.title,
                    });

                    r += 1;
                    if (r > size) {
                        break;
                    }
                }
            }

            return navs;
        },
    },
};
</script>
