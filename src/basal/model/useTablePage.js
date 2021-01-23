import { reactive, ref, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const _assign = Object.assign;
const pageSizes = [10, 20, 30, 50];

export default function useTablePage(opts) {
    const router = useRouter();
    const route = useRoute();

    let autoload = opts.autoload ?? true;
    let defQueryForm = _assign({}, opts.defQueryForm);
    let updateWithUrl = opts.updateWithUrl ?? true;
    let currentPath = route.path;

    const pageIndex = ref(1);
    const total = ref(0);
    const page = ref(1);
    const pageSize = ref(pageSizes[0]);
    // 默认el-pagination分页样式
    const pageLayout = ref(opts.pageLayout ?? 'total, sizes, prev, pager, next, jumper');
    const queryForm = ref({});
    const tableLoading = ref(false);
    const tableData = ref([]);
    // 默认el-table表格样式属性
    const tableOptions = reactive({
        headerCellStyle: { background: '#fafafa' },
        border: true,
        // stripe: true,
    });

    const tableIndex = index => {
        return (pageIndex.value - 1) * pageSize.value + index + 1;
    };

    const getDataFunc =
        opts.getDataFunc ||
        (() => {
            return Promise.reject(console.warn(route.path, '请添加表格数据获取方法`getDataFunc`'));
        });

    const delDataFunc =
        opts.delDataFunc ||
        (() => {
            return Promise.reject(console.warn(route.path, '请添加表格数据删除方法`delDataFunc`'));
        });

    const getTableData = () => {
        if (tableLoading.value) {
            return;
        }

        tableLoading.value = true;

        return getDataFunc(_assign({ page: page.value, pageSize: pageSize.value }, defQueryForm)).then(
            res => {
                total.value = res.total;
                tableData.value = res.list;
                pageIndex.value = page.value;
                tableLoading.value = false;
            },
            () => (tableLoading.value = false)
        );
    };

    const updatePage = isSearch => {
        if (isSearch) {
            _assign(defQueryForm, queryForm.value);
        } else {
            // 不是查询操作，还原查询参数
            _assign(queryForm.value, defQueryForm);
        }

        const query = _assign(
            {
                page: page.value,
                pageSize: pageSize.value,
            },
            defQueryForm
        );

        if (updateWithUrl) {
            for (const key in query) {
                // 参数不一样，更改页面地址
                if (query[key] != route.query[key]) {
                    return router.push({ query });
                }
            }
        }

        nextTick(getTableData);
    };

    const onPageChange = page2 => {
        page.value = page2;
        updatePage();
    };

    const onSizeChange = pageSize2 => {
        pageSize.value = pageSize2;
        updatePage();
    };

    const onRefresh = () => {
        updatePage();
    };

    const onSearch = () => {
        page.value = 1;
        updatePage(true);
    };

    const onRemove = (row, index) => {
        ElMessageBox.confirm(`此操作将删除序号为【${tableIndex(index)}】的记录，是否继续？`, '温馨提示', {
            type: 'warning',
            callback: action => {
                if (action == 'confirm') {
                    delDataFunc(row).then(
                        () => {
                            ElMessage.success('已删除!');
                            onRefresh();
                        },
                        () => {}
                    );
                }
            },
        });
    };

    if (updateWithUrl) {
        watch(
            () => route.query,
            query => {
                if (route.path != currentPath) {
                    // 不是当前页面地址
                    return;
                }

                let { page: page2, pageSize: pageSize2, ...queryForm2 } = query;

                _assign(defQueryForm, queryForm2);
                _assign(queryForm.value, defQueryForm);

                page2 = +page2;
                if (page2) {
                    page.value = page2;
                }

                pageSize2 = +pageSize2;
                if (pageSize2 && pageSizes.includes(pageSize2)) {
                    pageSize.value = pageSize2;
                }

                if (!autoload) {
                    autoload = true;
                    return;
                }

                nextTick(getTableData);
            },
            { immediate: true }
        );
    } else if (autoload) {
        nextTick(getTableData);
    }

    return {
        // data
        total,
        page,
        pageSize,
        pageSizes,
        pageLayout,
        queryForm,
        tableLoading,
        tableData,
        tableOptions,

        // methods
        tableIndex,
        onPageChange,
        onSizeChange,
        onRefresh,
        onSearch,
        onRemove,
    };
}
