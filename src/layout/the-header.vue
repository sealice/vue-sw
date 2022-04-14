<template>
    <div class="fl-header cf">
        <div class="logo">
            <div class="logo-text">LOGO</div>
            <el-link
                class="tgl"
                :underline="false"
                :icon="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                @click="toggle"
            ></el-link>
        </div>

        <the-breadcrumb class="nav" />
    </div>
</template>

<script>
import { ASIDE_COLLAPSE_TOGGLE } from '@/store/types';
import TheBreadcrumb from './the-breadcrumb.vue';

export default {
    components: {
        TheBreadcrumb,
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        isCollapse() {
            return this.$store.state.theme.aside?.isCollapse;
        },
        layout() {
            return this.$route.meta.layout;
        },
        layStyle() {
            const left = this.$store.getters.asideWidth;
            return this.layout ? { left: `${left}px` } : null;
        },
    },
    methods: {
        toggle() {
            this.$store.commit(ASIDE_COLLAPSE_TOGGLE);
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
};
</script>

<style lang="less">
.fl-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 15;
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    background: #fff;
    border-bottom: solid 1px #e6e6e6;

    .logo {
        float: left;
        position: relative;
        box-sizing: border-box;
        padding-right: 24px;
        min-width: 250px;

        &-text {
            font-size: 20px;
            line-height: 60px;
            text-align: center;
        }
    }

    .tgl {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        font-size: 23px;
    }

    .nav {
        float: left;
        padding-left: 20px;
        line-height: 60px;
    }
}
</style>
