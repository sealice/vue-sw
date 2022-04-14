<template>
    <div>
        <el-row :gutter="50">
            <el-col :span="12">
                <v-line class="chart"></v-line>
            </el-col>
            <el-col :span="12">
                <v-bar class="chart"></v-bar>
            </el-col>
            <el-col :span="12">
                <v-circle class="chart"></v-circle>
            </el-col>
            <el-col :span="12">
                <v-radar class="chart"></v-radar>
            </el-col>
            <el-col :span="12">
                <v-map style="height: 600px;"></v-map>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import VLine from './components/line.vue';
import VBar from './components/bar.vue';
import VCircle from './components/circle.vue';
import VRadar from './components/radar.vue';
import VMap from './components/map.vue';

export default {
    name: 'chart',
    components: {
        VLine,
        VBar,
        VCircle,
        VRadar,
        VMap,
    },
};
</script>

<style lang="less">
.chart {
    margin-bottom: 30px;
    height: 300px !important;
}
</style>
