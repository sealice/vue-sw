<template>
    <div class="fl-table-page">
        <div class="fl-search" v-if="$slots.search || $scopedSlots.search">
            <slot name="search" v-bind="{ queryForm, tableLoading, onRefresh, onSearch }"></slot>
        </div>

        <div class="fl-table" v-loading="tableLoading">
            <el-table v-bind="defOptions" v-on="$listeners" :data="tableData">
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
import TablePageMixins from '@/mixins/table-page';

const _assign = Object.assign;

export default {
    mixins: [TablePageMixins],
    props: {
        getDataMethod: Function,
        delDataMethod: Function,
        defQueryForm: Object,
        options: Object,
        showPagination: {
            type: Boolean,
            default: true,
        },
        autoload: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        defOptions() {
            return _assign({}, this.tableOptions, this.options);
        },
    },
    data() {
        return {
            isAutoload: this.autoload,
            queryForm: _assign({}, this.defQueryForm),
        };
    },
    created() {
        if (this.getDataMethod) {
            this.getData = this.getDataMethod;
        }

        if (this.delDataMethod) {
            this.delData = this.delDataMethod;
        }
    },
};
</script>
