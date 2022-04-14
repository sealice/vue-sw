<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, i) in navs" :key="i" :to="i < navs.length - 1 ? item.path : ''">{{
            item.title
        }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    computed: {
        navs() {
            const root = '/';
            const getRoute = path => this.$router.resolve(path).route;
            const navs = [{ path: root, title: getRoute(root).meta.title }];

            this.$route.matched.forEach(({ path, meta }) => {
                if (path !== root && !/\/$/.test(path)) {
                    navs.push({
                        path,
                        title: meta.title,
                    });
                }
            });

            return navs;
        },
    },
};
</script>
