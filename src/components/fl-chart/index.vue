<template>
    <div style="width: 100%; height: 100%"></div>
</template>

<script>
import merge from 'lodash/merge';
import debounce from 'lodash/debounce';
import { addListener, removeListener } from 'resize-detector';
const Echarts = () => import(/* webpackChunkName: "echarts" */ './echarts');

export default {
    name: 'FlChart',
    props: {
        affixOption: Object, // 附加参数，配置图表的渲染方式及大小等
        initOption: Object, // 初始化echarts配置
        option: Object, // echarts配置，主要传递图表数据，会与initOption合并
        register: Function, // echarts初始化前组件注册，有异步操作（请求等）需返回Promise
        theme: {
            type: [String, Object],
            default: 'skin',
        },
        loading: {
            type: [Object, Boolean],
            default() {
                return {
                    text: '',
                    color: '#409EFF',
                    spinnerRadius: 10,
                    lineWidth: 2,
                };
            },
        },
    },
    computed: {
        watchOptions() {
            return { initOption: this.initOption, option: this.option };
        },
    },
    methods: {
        /* 初始化echarts实例 */
        async init() {
            if (this.chart) return;

            const { default: echarts } = await Echarts();
            if (this.register) {
                await new Promise(resolve => resolve(this.register(echarts)));
            }

            this.chart = echarts.init(this.$el, this.theme, this.affixOption);

            this.showLoading();
            this.setOption(merge({}, this.initOption, this.option), true);
            this._resizeHandler = debounce(() => {
                this.resize();
            }, 150);

            addListener(this.$el, this._resizeHandler);
            this.$emit('done', this.chart);
            this.$once('hook:beforeDestroy', () => {
                removeListener(this.$el, this._resizeHandler);
                this.chart.clear();
                this.chart.dispose();
                this.chart = null;
            });
        },
        showLoading() {
            if (this.loading && !this.option) {
                this._isLoading = true;
                this.chart.showLoading(typeof this.loading === 'boolean' ? {} : this.loading);
            }
        },
        /* 绘制图表 */
        setOption(option, notMerge, lazyUpdate) {
            if (!this.chart) return;

            if (this._isLoading && this.option) {
                this._isLoading = false;
                this.chart.hideLoading();
            }

            this.chart.setOption(option, notMerge, lazyUpdate);
        },
        /* 重置尺寸 */
        resize() {
            if (!this.chart) return;
            this.chart.resize();
        },
    },
    watch: {
        watchOptions: {
            deep: true,
            handler(newVal, oldVal) {
                if (!newVal.option) {
                    return this.showLoading();
                }

                if (newVal.initOption !== oldVal.initOption) {
                    this.setOption(merge({}, newVal.initOption, newVal.option), true);
                } else {
                    this.setOption(merge({}, newVal.option));
                }
            },
        },
    },
    mounted() {
        this.init();
    },
};
</script>
