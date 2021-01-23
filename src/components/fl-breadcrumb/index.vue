<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, i) in navs" :key="i" :to="i < navs.length - 1 ? item.path : ''">{{
            item.title
        }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import pathToRegexp from 'path-to-regexp';

export default {
    name: 'FlBreadcrumb',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const navs = computed(() => {
            const navs = [];
            const paths = route.path.split('/');
            const routes = router.options.routes;
            const len = routes.length;
            const size = paths.length;

            for (let i = 0, r = 1; i < len; i++) {
                const path = paths.slice(0, r).join('/') || '/';
                if (pathToRegexp(routes[i].path).test(path)) {
                    navs.push({
                        path: path,
                        title: routes[i].meta?.title,
                    });

                    r += 1;
                    if (r > size) {
                        break;
                    }
                }
            }

            return navs;
        });

        return {
            navs,
        };
    },
};
</script>
