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

export default {
    computed: mapGetters(['isLogin']),
    data() {
        return {};
    },
    created() {
        this.$bus.on('updated-version', registration => {
            // 更新版本，可以在这里先做个更新提示
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
