<template>
    <div :class="['layout', 'cf']" :style="layStyle">
        <the-header ref="header" @hook:mounted="setTop($refs.header)" />
        <the-tabs ref="tabs" @hook:mounted="setTop($refs.tabs)" />
        <the-aside ref="aside" />

        <div class="page cf">
            <transition name="fade-up">
                <keep-alive :include="cachePages">
                    <router-view />
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
import TheHeader from './the-header.vue';
import TheAside from './the-aside.vue';
import TheTabs from './the-tabs.vue';

export default {
    name: 'layout',
    components: {
        TheHeader,
        TheAside,
        TheTabs,
    },
    data() {
        return {
            top: 0,
            isCollapse: false,
        };
    },
    computed: {
        layStyle() {
            const left = this.$store.getters.asideWidth;
            return { padding: `${this.top}px 0 0 ${left}px` };
        },
        cachePages() {
            return this.$store.getters.cachePages;
        },
    },
    methods: {
        getWidth(ele) {
            return ele ? ele.offsetWidth || ele.clientWidth : 0;
        },
        getHeight(ele) {
            return ele ? ele.offsetHeight || ele.clientHeight : 0;
        },
        setTop(vm) {
            this.top += this.getHeight(vm?.$el);
        },
    },
    watch: {
        layStyle: {
            immediate: true,
            handler(value) {
                setTimeout(
                    () => {
                        this.$el.style.transition = value ? 'all .3s' : '';
                    },
                    value ? 500 : 0
                );
            },
        },
    },
    created() {
        const body = document.body;
        body.style.backgroundColor = '#f8f8f8';

        this.$once('hook:beforeDestroy', () => {
            body.style.backgroundColor = '';
        });
    },
};
</script>

<style lang="less">
.layout {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 100%;
    height: 100%;
}

.page {
    position: relative;
    box-sizing: border-box;

    .layout & {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: auto;

        .container {
            display: flex;
            flex-direction: column;
        }

        > div:not(:empty) {
            flex-grow: 1;
            margin: 20px 20px;
            padding: 15px 17px;
            box-sizing: border-box;
            background-color: #fff;
            box-shadow: 0 0 17px -10px rgba(0, 0, 0, 0.1);
        }
    }
}

// .layout {
//     .fade-up {
//         &-enter-active,
//         &-leave-active {
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//         }

//         &-enter-active {
//             transition: all 0.3s ease;
//             transition-delay: 0.1s;
//         }

//         &-enter {
//             transform: translateY(20px);
//             opacity: 0;
//         }

//         &-leave-to:not(.login) {
//             transition: all 0.3s ease;
//             transform: translateY(20px);
//             opacity: 0;
//         }
//     }
// }
</style>
