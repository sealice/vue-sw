<template>
    <div style="width: 100%; height: 100%; overflow: hidden;"></div>
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
        registerMap: Function, // echarts注册地图组件，数据更新都会触发，有异步操作（请求等）需返回Promise
        notMerge: Boolean, // echarts更新前是否不跟之前设置的 option 进行合并，默认为 false，即合并。
        theme: {
            type: [String, Object],
            default: 'skin',
        },
        loading: {
            type: [Object, Boolean],
            default: true,
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

            let echarts = window.echarts;
            if (!echarts) {
                window.echarts = echarts = (await Echarts()).default;
            }

            const echartsInit = () => echarts.init(this.$el, this.theme, this.affixOption);
            const getMap = name => echarts.getMap(name);
            this._registerMap = () => {
                return Promise.resolve(this.registerMap(getMap))
                    .then(map => {
                        if (map) {
                            echarts.registerMap(map.name, map.geoJson, map.specialAreas);
                        }
                    })
                    .catch(err => {
                        console.error('[FlChart registerMap]:', err);
                    });
            };

            this._isInit = true;
            this.chart = echartsInit();

            this.showLoading();
            if (this.register) {
                await Promise.resolve(this.register(echarts)).catch(err => {
                    console.error('[FlChart register]:', err);
                });

                // 某些组件需要注册后才会生效，因此需要重新初始化
                this.chart.dispose(); // 先销毁
                this.chart = echartsInit();
            }

            if (this.registerMap) {
                await this._registerMap();
            }

            this.setOption(merge({}, this.initOption, this.option), true);

            const resizeHandler = debounce(this.resize, 150, { leading: true });

            addListener(this.$el, resizeHandler);

            this.$emit('done', this.chart, echarts);
            this.$once('hook:beforeDestroy', () => {
                removeListener(this.$el, resizeHandler);
                this.chart.clear();
                this.chart.dispose();
                this.chart = null;
            });
        },
        showLoading() {
            if (!this.chart) return;

            if (this.loading && !this.option) {
                this._isLoading = true;
                this.chart.showLoading(
                    merge(
                        {
                            text: '',
                            color: '#409EFF',
                            maskColor: 'rgba(255,255,255,0)',
                            spinnerRadius: 10,
                            lineWidth: 2,
                        },
                        this.loading
                    )
                );
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
            async handler(newVal, oldVal) {
                if (!this._isInit) {
                    return;
                }

                if (!newVal.option) {
                    if (this.registerMap) {
                        this._registerMap();
                    }

                    return this.showLoading();
                }

                if (this.registerMap) {
                    await this._registerMap();
                }

                const notMerge = this.notMerge || newVal.initOption !== oldVal.initOption;
                this.setOption(merge({}, newVal.initOption, newVal.option), notMerge);
            },
        },
    },
    mounted() {
        this.init();
    },
};
</script>
