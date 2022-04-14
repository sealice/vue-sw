<template>
    <keep-alive :include="cachePages">
        <router-view />
    </keep-alive>
</template>

<script>
export default {
    name: 'keep-view',
    computed: {
        cachePages() {
            return this.$store.getters.cachePages;
        },
    },
    deactivated() {
        const {
            _vnode: {
                componentInstance: { _vnode: vnode },
            },
        } = this;

        // 如果当前页面不是缓存的则另其自动注销
        if (!vnode.data?.keepAlive) {
            this._inactive = false;
            this.$nextTick(() => {
                this._inactive = true;
            });
        }
    },
};
</script>
