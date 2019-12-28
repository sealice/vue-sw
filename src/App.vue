<template>
    <div id="app" v-show="display">
        <!-- layout -->
        <template v-if="$route.meta.layout || $route.meta.layout === void 0">
            <div id="nav">
                <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
                <router-link to="/about/bar">About Bar</router-link>
            </div>
        </template>

        <router-view />
    </div>
</template>

<script>
export default {
    data() {
        return {
            display: false,
        };
    },
    mounted() {
        setTimeout(() => {
            this.display = true;
        }, 30);
    },
};
</script>

<style>
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
