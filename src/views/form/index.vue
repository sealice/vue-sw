<template>
    <div>
        <el-row :gutter="25" style="margin-bottom: 15px;">
            <el-col :span="12">
                <el-card header="Radio 单选框" shadow="hover">
                    <p>
                        <fl-radio v-model="radio" :data="citys"></fl-radio>
                    </p>
                    <p>
                        <fl-radio v-model="radio" :data="citys" size="mini" border></fl-radio>
                    </p>
                    <p>
                        <fl-radio v-model="radio2" dict-key="dishes" button-group></fl-radio>
                    </p>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card header="Checkbox 多选框" shadow="hover">
                    <p>
                        <fl-checkbox v-model="checkbox" :data="citys"></fl-checkbox>
                    </p>
                    <p>
                        <fl-checkbox v-model="checkbox" :data="citys" size="mini" border></fl-checkbox>
                    </p>
                    <p>
                        <fl-checkbox v-model="checkbox2" dict-key="dishes" button-group></fl-checkbox>
                    </p>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="25" style="margin-bottom: 15px;">
            <el-col :span="12">
                <el-card header="Select 选择器" shadow="hover">
                    <p>
                        <fl-select v-model="select" :data="citys"></fl-select>
                        <span style="padding: 0 10px;"></span>
                        <fl-select v-model="select2" dict-key="web"></fl-select>
                    </p>
                    <p>
                        <fl-select v-model="select3" dict-key="dishes" size="mini" width="100%" multiple></fl-select>
                    </p>
                    <p>
                        <fl-select v-model="area.province" :dict-key="'ca.86'"></fl-select>
                        <span style="padding: 0 10px;"></span>
                        <fl-select v-model="area.city" :dict-key="`ca.${area.province}`"></fl-select>
                        <span style="padding: 0 10px;"></span>
                        <fl-select v-model="area.county" :dict-key="`ca.${area.city}`"></fl-select>
                    </p>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card header="DatePicker 日期选择器" shadow="hover">
                    <p>
                        <fl-date-picker v-model="date"></fl-date-picker>
                    </p>
                    <p>
                        <fl-daterange-picker v-model="date2" size="mini" completion-time></fl-daterange-picker>
                    </p>
                    <p>
                        <fl-daterange-picker
                            :start-time.sync="date3.t1"
                            :end-time.sync="date3.t2"
                            :after-date="'now'"
                        ></fl-daterange-picker>
                    </p>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="25">
            <el-col :span="12">
                <el-card style="user-select: none;" header="Button 按钮" shadow="hover">
                    <p>主要添加了 submit 事件，submit事件触发时禁止按钮点击</p>
                    <p class="text-center">按钮被点击：{{ count }}</p>
                    <p>
                        <fl-button @submit="submit">按钮</fl-button>
                        <fl-button @submit="submit" type="primary" loading-at-submit>按钮</fl-button>
                    </p>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { fetchDict, setDict, transformDict } from '@/filter/dict';

// 添加字典，这里仅做演示（正常请在 filter/dict/index.js 里添加）
setDict('dishes', transformDict(`1:黄金糕,2:双皮奶,3:蚵仔煎,4:龙须面,5:北京烤鸭`));
// 模拟请求
setDict(
    'web',
    fetchDict({
        api: () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        list: [
                            { id: 1, name: 'HTML' },
                            { id: 2, name: 'CSS' },
                            { id: 3, name: 'JavaScript' },
                        ],
                    });
                }, 3000);
            });
        },
    })
);

const chinaAreaData = require('./china-area-data.json');
for (const [code, data] of Object.entries(chinaAreaData)) {
    setDict(
        `ca.${code}`,
        Object.entries(data).map(([value, label]) => ({
            value,
            label,
        }))
    );
}

export default {
    name: 'v-form',
    data() {
        return {
            citys: [
                { value: 1, label: '上海' },
                { value: 2, label: '北京' },
                { value: 3, label: '广州' },
                { value: 4, label: '深圳' },
            ],
            radio: '',
            radio2: '',
            checkbox: [],
            checkbox2: [],
            select: '',
            select2: '',
            select3: [],
            area: {
                province: '',
                city: '',
                county: '',
            },
            date: '',
            date2: [],
            date3: {
                t1: '',
                t2: '',
            },
            count: 0,
        };
    },
    methods: {
        submit(cb) {
            this.count++;
            setTimeout(cb, 3000);
        },
    },
};
</script>
