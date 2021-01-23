<template>
    <div class="fl-table-page">
        <div class="fl-search" v-if="$slots.search">
            <slot name="search" v-bind="{ queryForm, tableLoading, onRefresh, onSearch }"></slot>
        </div>

        <div class="fl-table" v-loading="tableLoading">
            <el-table v-bind="attrs" :data="tableData">
                <slot name="table" v-bind="{ tableIndex, onRefresh, onRemove }"></slot>
            </el-table>
        </div>

        <div class="fl-pagination" v-if="showPagination">
            <slot name="pagination" v-bind="{ page, pageSize, total, onSizeChange, onPageChange }">
                <el-pagination
                    :current-page="page"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"
                    :layout="pageLayout"
                    @size-change="onSizeChange"
                    @current-change="onPageChange"
                />
            </slot>
        </div>

        <slot name="action" v-bind="{ onRefresh }"></slot>
    </div>
</template>

<script>
import { mergeProps } from 'vue';
import useTablePage from '@/basal/model/useTablePage';

export default {
    name: 'FlTablePage',
    inheritAttrs: false,
    props: {
        getDataFunc: Function,
        delDataFunc: Function,
        defQueryForm: Object,
        autoload: { type: Boolean, default: true },
        updateWithUrl: { type: Boolean, default: true },
        showPagination: { type: Boolean, default: true },
    },
    setup(props, { attrs }) {
        const { tableOptions, ...opts } = useTablePage(props);

        return {
            ...opts,
            attrs: mergeProps(tableOptions, attrs),
        };
    },
};
</script>
