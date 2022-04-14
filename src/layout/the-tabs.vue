<template>
    <div class="fl-tabs" :style="layStyle">
        <div ref="tabs" class="fl-tabs-main" @wheel="wheel">
            <template v-for="(item, i) in tabs">
                <span
                    :key="i"
                    :class="['fl-tab', { cur: item.path === $route.path }]"
                    @click="$router.push(item.fullPath)"
                >
                    {{ item.title }}<i class="el-icon-close" @click.stop="remove('cur', item, i)"></i>
                </span>
            </template>
        </div>
        <span :class="['fl-tabs-lbtn', { disabled: disLbtn }]" @click="scrollOffset(-300)">
            <i class="el-icon-arrow-left"></i>
        </span>
        <span :class="['fl-tabs-rbtn', { disabled: disRbtn }]" @click="scrollOffset(+300)">
            <i class="el-icon-arrow-right"></i>
        </span>
        <span class="fl-tabs-bbtn">
            <el-dropdown size="medium" trigger="click" @command="remove">
                <i class="el-icon-arrow-down"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="left">关闭左侧</el-dropdown-item>
                    <el-dropdown-item command="right">关闭右侧</el-dropdown-item>
                    <el-dropdown-item command="all">关闭全部</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </span>
    </div>
</template>

<script>
import { addListener, removeListener } from 'resize-detector';
import { TABS_ADD, TABS_REMOVE } from '@/store/types';

export default {
    data() {
        return {
            disLbtn: true,
            disRbtn: true,
        };
    },
    computed: {
        tabs() {
            return this.$store.state.theme.tabs;
        },
        layStyle() {
            const left = this.$store.getters.asideWidth;
            return { left: `${left}px` };
        },
        $tabs() {
            return this.$refs.tabs;
        },
    },
    methods: {
        remove(mode, tab, index) {
            // 不允许删除首页标签
            if (tab) {
                const home = this.$router.resolve('/').route;
                if (tab.path === home.path) {
                    return;
                }
            }

            if (!index) {
                index = this.tabs.findIndex(item => item.path === this.$route.path);
            }

            this.$store.commit({
                type: TABS_REMOVE,
                index,
                mode,
            });

            if (tab && tab.path === this.$route.path) {
                const nextTab = this.tabs[index] || this.tabs[this.tabs.length - 1];
                this.$router.push(nextTab?.fullPath || '/');
                return;
            }

            if (mode === 'all') {
                this.$router.push('/');
            }

            this.disBtns();
        },
        scrollToTab() {
            this.$nextTick(() => {
                const { clientWidth, scrollWidth, scrollLeft } = this.$tabs;
                const $curTab = this.$tabs.querySelector('.fl-tab.cur');
                const offset = 120;
                if (clientWidth < scrollWidth && $curTab) {
                    const left = $curTab.offsetLeft - scrollLeft;
                    if (left < offset || left > clientWidth - offset) {
                        const toLeft = $curTab.offsetLeft + $curTab.clientWidth - clientWidth;
                        this.scrollOffset(toLeft - scrollLeft);
                    }
                }

                this.disBtns();
            });
        },
        scrollOffset(offset) {
            const $tabs = this.$tabs;
            let during = 100;
            const step = offset > 0 ? 5 : -5;
            const delay = during / Math.ceil(offset / step);
            const animate = callback => {
                const timer = setInterval(() => {
                    $tabs.scrollLeft += step;
                    during -= delay;
                    if (during < 0) {
                        clearInterval(timer);
                        callback && callback();
                    }
                }, delay);
            };

            if ($tabs.clientWidth < $tabs.scrollWidth) {
                animate(this.disBtns);
            } else {
                this.disBtns();
            }
        },
        wheel(event) {
            event.preventDefault();
            const offset = event.wheelDeltaY > 0 ? -80 : 80;
            this.scrollOffset(offset);
        },
        disBtns() {
            const { clientWidth, scrollWidth, scrollLeft } = this.$tabs;
            const notScroll = clientWidth >= scrollWidth;
            this.disLbtn = notScroll || scrollLeft == 0;
            this.disRbtn = notScroll || scrollLeft >= scrollWidth - clientWidth - 10;
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler(route, oldRoute) {
                // 初始为空时添加首页标签
                if (!this.tabs.length) {
                    const home = this.$router.resolve('/').route;
                    if (route.path !== home.path) {
                        this.$store.commit({
                            type: TABS_ADD,
                            route: home,
                        });
                    }
                }

                this.$store.commit({
                    type: TABS_ADD,
                    route,
                    oldRoute,
                });

                this.scrollToTab();
            },
        },
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
    mounted() {
        addListener(this.$el, this.scrollToTab);
        this.$bus.on('tabs:close-current', path => {
            this.remove('cur');

            if (!path || path == 'back') {
                this.$router.back();
            } else {
                const toTab = this.tabs.find(item => item.path === path);
                this.$router.push(toTab?.fullPath || path);
            }
        });

        this.$once('hook:beforeDestroy', () => {
            removeListener(this.$el, this.scrollToTab);
            this.$bus.off('tabs:close-current');
        });
    },
};
</script>

<style lang="less">
.fl-tabs {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    z-index: 12;
    height: 32px;
    background: #fff;
    box-shadow: 3px 1px 5px -1px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;

    &-main {
        overflow: hidden;
        margin-left: 32px;
        margin-right: 64px;
        white-space: nowrap;
    }

    &-lbtn,
    &-rbtn,
    &-bbtn {
        position: absolute;
        top: 0;
        width: 32px;
        line-height: 32px;
        font-size: 20px;
        text-align: center;
        background-color: #fff;
        cursor: pointer;

        &:not(.disabled):hover {
            color: #409eff;
            background-color: #f5f7fa;
        }

        &.disabled {
            color: #ddd;
            cursor: no-drop;
        }
    }

    &-lbtn {
        left: 0;
        border-right: 1px solid #f2f2f2;
    }

    &-rbtn {
        right: 32px;
        border-left: 1px solid #f2f2f2;
    }

    &-bbtn {
        right: 0;
        border-left: 1px solid #f2f2f2;

        .el-dropdown {
            font-size: 20px;
        }

        [class*=' el-icon-'],
        [class^='el-icon-'] {
            width: 32px;
            line-height: 32px;
            vertical-align: top;
        }
    }
}

.fl-tab {
    display: inline-block;
    padding: 0 17px;
    line-height: 32px;
    cursor: pointer;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    &.cur,
    &:hover {
        padding: 0 6px 0 9px;
        color: #409eff;
        background-color: #f5f7fa;

        > i {
            margin-left: 5px;
            width: 14px;
        }
    }

    > i {
        overflow: hidden;
        width: 0;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        vertical-align: -2px;
        border-radius: 50%;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

        &:hover {
            color: #fff;
            background-color: #f56c6c;
        }
    }
}
</style>
