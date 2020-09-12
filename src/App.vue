<template>
    <div id="app">
        <!-- layout -->
        <template v-if="$route.meta.layout || $route.meta.layout === void 0">
            <div id="nav" v-if="isLogin">
                <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
                <router-link to="/about/bar">About Bar</router-link>
            </div>
        </template>

        <div class="main">
            <router-view />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { LOGOUT } from '@/store/types';

export default {
    computed: mapGetters(['isLogin']),
    data() {
        return {};
    },
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
@import './style/index.less';

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
