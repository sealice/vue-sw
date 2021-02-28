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
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { ElLoading, ElMessage } from 'element-plus';
import { LOGOUT } from '@/store/types';
import bus from '@/utils/bus';

export default {
    setup() {
        let loadingInstance;
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const layout = computed(() => route.meta.layout);

        // 显示全屏loading
        bus.on('loading:show', ({ text } = {}) => {
            loadingInstance = ElLoading.service({
                text,
                lock: true,
                fullscreen: true,
                customClass: 'full-loading',
            });
        });

        // 隐藏全屏loading
        bus.on('loading:hide', () => {
            if (loadingInstance) {
                loadingInstance = loadingInstance.close();
            }
        });

        // 退出登录
        bus.on('logout', showMessage => {
            store.dispatch(LOGOUT).then(() => {
                if (showMessage) {
                    ElMessage.success('已安全退出登录！');
                }

                router.replace({
                    path: '/login',
                    query: { redirect: route.fullPath },
                });
            });
        });

        // 更新版本，可以先做个更新提示
        bus.on('updated-version', registration => {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            location.reload();
        });

        return {
            layout,
        };
    },
};
</script>

<style lang="less">
@import '~@/style/index.less';

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
