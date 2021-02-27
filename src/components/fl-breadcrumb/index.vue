<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, i) in navs" :key="i" :to="i < navs.length - 1 ? item.path : ''">{{
            item.title
        }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'FlBreadcrumb',
    computed: {
        navs() {
            const root = '/';
            const getRoute = path => this.$router.resolve(path).route;
            const navs = [{ path: root, title: getRoute(root).meta.title }];

            if (this.$route.path != root) {
                const matched = this.$route.path.split('/');
                let path = matched.shift();
                while (matched.length) {
                    path += '/' + matched.shift();
                    navs.push({
                        path,
                        title: getRoute(path).meta.title,
                    });
                }
            }

            return navs;
        },
    },
};
</script>
