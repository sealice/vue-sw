<template>
    <div class="fl-aside cf" :style="{ width: `${width}px`, backgroundColor: aside.backgroundColor }">
        <el-scrollbar>
            <el-menu
                style="padding-bottom: 56px;"
                :default-active="$route.name"
                :collapse="aside.isCollapse"
                :text-color="aside.textColor"
                :active-text-color="aside.activeTextColor"
                :background-color="aside.backgroundColor"
                router
            >
                <template v-for="m in menu">
                    <el-menu-item v-if="!m.children.length" :key="m.name" :index="m.name" :route="{ path: m.path }">
                        <i :class="[m.icon || 'el-icon-document', 'iconfont']"></i>
                        <span slot="title">{{ m.title }}</span>
                    </el-menu-item>
                    <el-submenu v-else :key="m.name" :index="m.name">
                        <template slot="title">
                            <i :class="[m.icon || 'el-icon-folder-opened', 'iconfont']"></i>
                            <span>{{ m.title }}</span>
                        </template>
                        <template v-for="n in m.children">
                            <el-menu-item
                                v-if="!n.children.length"
                                :key="n.name"
                                :index="n.name"
                                :route="{ path: n.path }"
                            >
                                <i :class="[n.icon || 'el-icon-document', 'iconfont']"></i>
                                <span slot="title">{{ n.title }}</span>
                            </el-menu-item>
                            <el-submenu v-else :key="n.name" :index="n.name">
                                <template slot="title">
                                    <i :class="[n.icon || 'el-icon-folder-opened', 'iconfont']"></i>
                                    <span>{{ n.title }}</span>
                                </template>
                                <el-menu-item
                                    v-for="h in n.children"
                                    :key="h.name"
                                    :index="h.name"
                                    :route="{ path: h.path }"
                                >
                                    <i :class="[h.icon || 'el-icon-document', 'iconfont']"></i>
                                    <span slot="title">{{ h.title }}</span>
                                </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-submenu>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapState({
            menu: 'menu',
            aside: state => state.theme.aside,
        }),
        ...mapGetters({
            width: 'asideWidth',
        }),
    },
};
</script>

<style lang="less">
.fl-aside {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    z-index: 10;
    width: 250px;
    background: #fff;
    box-shadow: 1px 0 5px -1px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    transition: 0.3s;

    .el-scrollbar {
        height: 100%;
    }

    .el-scrollbar__wrap {
        overflow-x: auto;
    }

    .el-menu {
        border-right: 0;
        background-color: transparent;
    }

    .el-menu-item,
    .el-submenu__title {
        i {
            color: inherit;
            opacity: 0.8;
        }
    }
}
</style>
