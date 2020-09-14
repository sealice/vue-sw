<template>
    <div id="app" :class="{ layout }">
        <!-- layout -->
        <template v-if="layout">
            <div id="nav">
                <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
                <router-link to="/about/bar">About Bar</router-link>
            </div>
        </template>

        <div class="page">
            <router-view />
        </div>
    </div>
</template>

<script>
import './style/index.less';
import { LOGOUT } from '@/store/types';

export default {
    computed: {
        layout() {
            return this.$route.meta.layout;
        },
    },
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
