<template>
    <fl-chart :option="option" :initOption="initOption"></fl-chart>
</template>

<script>
export default {
    data() {
        return {
            option: null,
            initOption: {
                title: {
                    text: '基础雷达图',
                },
                tooltip: {},
                legend: {
                    right: 20,
                    orient: 'vertical',
                    data: ['预算分配', '实际开销'],
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5],
                        },
                    },
                    indicator: [
                        { name: '销售', max: 6500 },
                        { name: '管理', max: 16000 },
                        { name: '信息技术', max: 30000 },
                        { name: '客服', max: 38000 },
                        { name: '研发', max: 52000 },
                        { name: '市场', max: 25000 },
                    ],
                },
            },
        };
    },
    mounted() {
        this.option = {
            series: [
                {
                    name: '预算 vs 开销',
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    data: [
                        {
                            value: [4300, 10000, 28000, 35000, 50000, 19000],
                            name: '预算分配',
                        },
                        {
                            value: [5000, 14000, 28000, 31000, 42000, 21000],
                            name: '实际开销',
                        },
                    ],
                },
            ],
        };
    },
};
</script>
