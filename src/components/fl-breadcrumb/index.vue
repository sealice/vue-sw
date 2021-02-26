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

export default {
    name: 'FlBreadcrumb',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const routerResolve = router.resolve;

        const navs = computed(() => {
            const root = '/';
            const navs = [{ path: root, title: routerResolve(root).meta?.title }];

            if (route.path != root) {
                const matched = route.path.split('/');
                let path = matched.shift();
                while (matched.length) {
                    path += '/' + matched.shift();
                    navs.push({
                        path,
                        title: routerResolve(path).meta?.title,
                    });
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
