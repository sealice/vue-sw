<template>
    <fl-table-page :search-option="searchOption" :get-data-func="getDataFunc">
        <template #table="{ tableIndex, onRemove }">
            <el-table-column type="index" :index="tableIndex" label="#" align="center"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="address" label="地址" min-width="200"></el-table-column>
            <el-table-column prop="state" label="状态" #default="{row}">
                <el-tag size="medium" :type="row.state == '1' ? 'success' : 'danger'">{{
                    row.state | toDictLabel('userState')
                }}</el-tag>
            </el-table-column>
            <el-table-column type="action" label="操作" #default="{ row, $index }">
                <div class="el-table-action">
                    <el-link type="primary">编辑</el-link>
                    <el-link type="danger" @click="onRemove(row, tableIndex($index))">删除</el-link>
                </div>
            </el-table-column>
        </template>
    </fl-table-page>
</template>

<script>
import { setDict, transformDict } from '@/filter/dict';
import { getTable } from '@/service';

setDict('userState', transformDict(`1: 启用, 2: 禁用`));

export default {
    name: 'v-table',
    data() {
        return {
            searchOption: [
                { name: '姓名', key: 'name', type: 'text' },
                { name: '状态', key: 'state', type: 'select', dictKey: 'userState', option: { width: 120 } },
            ],
        };
    },
    methods: {
        getDataFunc: getTable,
    },
    filters: {
        stateText(state) {
            return ['', '启用', '禁用'][state];
        },
    },
};
</script>
