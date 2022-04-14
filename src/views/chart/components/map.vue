<template>
    <fl-chart :option="option" :initOption="initOption" :register="register"></fl-chart>
</template>

<script>
export default {
    data() {
        return {
            option: null,
            initOption: {
                title: {
                    text: '香港18区人口密度 （2011）',
                    subtext: '人口密度数据来自Wikipedia',
                    sublink:
                        'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c} (p / km2)',
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: { readOnly: false },
                        restore: {},
                        saveAsImage: {},
                    },
                },
                visualMap: {
                    min: 800,
                    max: 50000,
                    text: ['High', 'Low'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['lightskyblue', 'yellow', 'orangered'],
                    },
                },
            },
        };
    },
    methods: {
        register(echarts) {
            return new Promise(resolve => {
                setTimeout(() => {
                    const geoJson = require('./geo/810000_full.json');
                    echarts.registerMap('HK', geoJson);
                    resolve();
                }, 1000);
            });
        },
    },
    mounted() {
        setTimeout(() => {
            this.option = {
                series: [
                    {
                        name: '香港18区人口密度',
                        type: 'map',
                        mapType: 'HK', // 自定义扩展图表类型
                        label: {
                            show: true,
                        },
                        data: [
                            { name: '中西区', value: 20057.34 },
                            { name: '湾仔区', value: 15477.48 },
                            { name: '东区', value: 31686.1 },
                            { name: '南区', value: 6992.6 },
                            { name: '油尖旺区', value: 44045.49 },
                            { name: '深水埗区', value: 40689.64 },
                            { name: '九龙城区', value: 37659.78 },
                            { name: '黄大仙区', value: 45180.97 },
                            { name: '观塘区', value: 55204.26 },
                            { name: '葵青区', value: 21900.9 },
                            { name: '荃湾区', value: 4918.26 },
                            { name: '屯门区', value: 5881.84 },
                            { name: '元朗区', value: 4178.01 },
                            { name: '北区', value: 2227.92 },
                            { name: '大埔区', value: 2180.98 },
                            { name: '沙田区', value: 9172.94 },
                            { name: '西贡区', value: 3368 },
                            { name: '离岛区', value: 806.98 },
                        ],
                    },
                ],
            };
        }, 1500);
    },
};
</script>
