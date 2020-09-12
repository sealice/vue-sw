const _assign = Object.assign;
const _keys = Object.keys;

export default {
    data() {
        const pageSizes = [10, 20, 30, 50];

        return {
            isAutoload: true,
            total: 0,
            page: 1,
            pageIndex: 1,
            pageSize: pageSizes[0],
            pageSizes: pageSizes,
            pageLayout: 'total, sizes, prev, pager, next, jumper',
            queryForm: {},
            tableData: [],
            tableLoading: true,
            tableOptions: {
                headerCellStyle: { background: '#fafafa' },
                border: true,
                // stripe: true,
            },
        };
    },
    methods: {
        tableIndex(index) {
            return (this.pageIndex - 1) * this.pageSize + index + 1;
        },
        getData() {
            return Promise.reject(console.warn(this.$route.path, '请添加表格数据获取方法`getData`'));
        },
        delData() {
            return Promise.reject(console.warn(this.$route.path, '请添加表格数据删除方法`delData`'));
        },
        getTableData() {
            this.tableLoading = true;

            return this.getData(this._queryForm, {
                params: { page: this.page, pageSize: this.pageSize },
            }).then(
                res => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.pageIndex = this.page;
                    this.tableLoading = false;
                },
                () => {
                    this.tableLoading = false;
                }
            );
        },
        onPageChange(page, pageSize) {
            if (page) {
                // 不是查询操作，还原查询参数
                this.queryForm = _assign({}, this._queryForm);
            }

            this.page = page || 1;
            this.pageSize = pageSize || this.pageSize;
            const query = _assign({}, this.queryForm, {
                page: this.page,
                pageSize: this.pageSize,
            });

            for (let key in query) {
                if (query[key] != this.$route.query[key]) {
                    return this.$router.push({ query });
                }
            }

            this.$nextTick(this.getTableData);
        },
        onSizeChange(pageSize) {
            this.onPageChange(1, pageSize);
        },
        onRefresh() {
            this.onPageChange(this.page);
        },
        onSearch() {
            this.onPageChange();
        },
        onRemove(data, index) {
            this.$confirm(`此操作将删除序号为【${this.tableIndex(index)}】的记录，是否继续？`, '温馨提示', {
                type: 'warning',
                callback: action => {
                    if (action == 'confirm') {
                        this.delData(data).then(
                            () => {
                                this.$message.success('已删除!');
                                this.onRefresh();
                            },
                            () => {}
                        );
                    }
                },
            });
        },
    },
    watch: {
        '$route.query': {
            immediate: true,
            handler(value, oldValue) {
                const { page, pageSize, ...queryForm } = value;

                this.page = Number(page) || this.page;
                this.pageSize = Number(pageSize) || this.pageSize;
                this._queryForm = _assign({}, !oldValue && this.queryForm, queryForm);

                if (oldValue || _keys(value).length) {
                    // 不是首次加载或者地址栏有参数，覆盖/还原查询参数
                    this.queryForm = _assign({}, this._queryForm);
                }

                if (!this.isAutoload) {
                    this.isAutoload = true;
                    return;
                }

                this.$nextTick(this.getTableData);
            },
        },
    },
};
