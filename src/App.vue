<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { LOGOUT } from '@/store/types';

export default {
    created() {
        let loadingInstance;

        this.$bus
            // 显示全屏loading
            .on('loading:show', ({ text } = {}) => {
                loadingInstance = this.$loading({
                    text,
                    lock: true,
                    fullscreen: true,
                    customClass: 'full-loading',
                });
            })
            // 隐藏全屏loading
            .on('loading:hide', () => {
                if (loadingInstance) {
                    loadingInstance = loadingInstance.close();
                }
            })
            // 退出登录
            .on('logout', showMessage => {
                this.$store.dispatch(LOGOUT).then(() => {
                    if (showMessage) {
                        this.$message.success('已安全退出登录！');
                    }

                    this.$router.replace({
                        path: '/login',
                        query: { redirect: this.$route.fullPath },
                    });
                });
            })
            // 更新版本，可以先做个更新提示
            .on('updated-version', registration => {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                location.reload();
            });
    },
};
</script>

<style lang="less">
@import '~@/style/index.less';
</style>
