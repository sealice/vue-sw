<template>
    <div class="fl-table-page">
        <div class="fl-table-search" v-if="searchOption || $slots.search || $scopedSlots.search">
            <slot name="search" v-bind="{ queryForm, tableLoading, onRefresh, onSearch }">
                <el-form v-if="searchOption" :size="searchSize" inline>
                    <template v-for="item in searchOption">
                        <el-form-item v-if="searchTypeValid(item.type)" :key="item.key" :label="item.name">
                            <component
                                v-if="item.type != 'daterange' || item.key"
                                :is="searchTypeComponents[item.type]"
                                v-model="queryForm[item.key]"
                                v-bind="item.option"
                                :data="item.data"
                                :dict-key="setDictKey(item.dictKey)"
                            ></component>
                            <component
                                v-else
                                :is="searchTypeComponents[item.type]"
                                v-bind="item.option"
                                :startTime.sync="queryForm[item.startTime]"
                                :endTime.sync="queryForm[item.endTime]"
                            ></component>
                        </el-form-item>
                    </template>
                    <el-form-item>
                        <el-button type="primary" :disabled="tableLoading" @click="onSearch()">搜索</el-button>
                        <slot name="search-btns"></slot>
                    </el-form-item>
                </el-form>
            </slot>
        </div>

        <div class="fl-table-main" v-loading="tableLoading">
            <div class="fl-table-btns" v-if="$slots['table-btns'] || $scopedSlots['table-btns']">
                <slot name="table-btns" v-bind="{ queryForm, tableLoading, onRefresh, onSearch }"></slot>
            </div>

            <div class="fl-table">
                <el-table :height="height" v-bind="defOptions" v-on="$listeners" :data="tableData">
                    <slot name="table" v-bind="{ queryForm, tableIndex, onRefresh, onSearch, onRemove }"></slot>
                </el-table>
            </div>

            <div class="fl-pagination" v-if="showPagination">
                <slot name="pagination" v-bind="{ page, pageSize, total, onSizeChange, onPageChange }">
                    <el-pagination
                        :current-page="page"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        :total="total"
                        :background="pageBackground"
                        :layout="pageLayout"
                        @size-change="onSizeChange"
                        @current-change="onPageChange"
                    />
                </slot>
            </div>
        </div>

        <slot name="action" v-bind="{ onRefresh }"></slot>
    </div>
</template>

<script>
import { addListener, removeListener } from 'resize-detector';
import TablePageMixins from '@/mixins/table-page';

const _assign = Object.assign;
const searchTypeComponents = {
    text: 'el-input',
    select: 'fl-select',
    date: 'fl-date-picker',
    daterange: 'fl-daterange-picker',
    radio: 'fl-radio',
    checkbox: 'fl-checkbox',
};
const searchTypes = Object.keys(searchTypeComponents);
const searchTypeValid = type => ~searchTypes.indexOf(type);

export default {
    name: 'FlTablePage',
    mixins: [TablePageMixins],
    inheritAttrs: false,
    props: {
        getDataFunc: Function,
        delDataFunc: Function,
        defQueryForm: Object,
        disAutoHeight: Boolean,
        showPagination: {
            type: Boolean,
            default: true,
        },
        isAutoload: {
            type: Boolean,
            default: true,
        },
        isRoutePage: {
            type: Boolean,
            default: true,
        },
        searchSize: {
            type: String,
            default: 'medium',
        },
        searchOption: {
            type: Array, // [{name?, key, dictKey?, data?, type, option?}]
            validator(arr) {
                arr.forEach(item => {
                    if (!searchTypeValid(item.type)) {
                        console.warn('Search parameter type error. At ', item);
                    }
                });

                return true;
            },
        },
    },
    computed: {
        defOptions() {
            return _assign({}, this.tableOptions, this.$attrs);
        },
    },
    data() {
        return {
            searchTypeComponents,
            queryForm: _assign({}, this.defQueryForm),
            height: null,
        };
    },
    methods: {
        searchTypeValid,
        setHeight() {
            this.$nextTick(() => {
                const table = this.$el.querySelector('.fl-table');
                if (table) {
                    const elTable = table.querySelector('.el-table');
                    elTable.style.display = 'none';
                    this.height = Math.max(360, table.clientHeight);
                    elTable.style.display = '';
                }
            });
        },
        setDictKey(dictKey) {
            if (typeof dictKey === 'function') {
                return dictKey(this.queryForm);
            }

            return dictKey;
        },
    },
    created() {
        if (this.getDataFunc) {
            this.getData = this.getDataFunc;
        }

        if (this.delDataFunc) {
            this.delData = this.delDataFunc;
        }
    },
    mounted() {
        if (!this.disAutoHeight) {
            this.setHeight();
            addListener(this.$el, this.setHeight);
            this.$once('hook:beforeDestroy', () => {
                removeListener(this.$el, this.setHeight);
            });
        }
    },
};
</script>

<style lang="less">
.fl-table {
    flex: 1;
    height: 100%;

    &-page {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    &-main {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    &-btns {
        margin-bottom: 15px;
    }
}

.fl-pagination {
    margin-top: 15px;
}
</style>
