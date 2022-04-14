import { requestProcess } from '@/utils/request';
import { assignment } from '@/utils/assist';
import { addOrEdit } from '@/utils/form';

export default {
    provide() {
        return {
            isEdit: this.isEdit,
        };
    },
    data() {
        this._path = this.$route.path;

        return {
            id: '', // 编辑页面从地址栏传值过来的id
            form: {}, // 表单字段，注：编辑时会从接口请求数据覆盖此表单字段，但也仅限已定义的字段，因此需要添加空的ID字段留给编辑回填
            rules: {}, // 表单校验规则
            showMessage: true, // 是否显示表单格式校验错误信息
            backPath: '', // 点击取消返回的页面地址，如果列表页不是模块下list的话，需要在页面上指定
        };
    },
    computed: {
        isCurPage() {
            return this.$route.path === this._path;
        },
        isEdit() {
            return this.$route.path.indexOf('edit') > -1;
        },
        listPath() {
            return this.$route.path.replace(/(add|edit)/, 'list');
        },
    },
    methods: {
        // 编辑时获取数据的方法，具体在页面配置
        getData() {
            return Promise.reject(console.warn(this.$route.path, '请添加数据获取方法`getData`'));
        },
        // 提交表单前处理数据方法，根据需求在页面修改
        parseData() {
            return { ...this.form };
        },
        initEdit(query) {
            if (this.isCurPage && this.isEdit) {
                if (!query.id) {
                    this.$message.error('无效页面参数~');
                    this.$nextTick(() => {
                        this.cancel('back');
                    });
                } else if (query.id != this.id) {
                    this.id = query.id;
                    requestProcess(this.getData(query.id), res => {
                        this.form = assignment(this.form, res?.data);
                    });
                }
            }
        },
        submit(cb) {
            if (typeof cb !== 'function') {
                cb = () => {};
            }

            this.$refs.form.validate(valid => {
                if (!valid) {
                    this.$message.error('数据填写不完整或格式有错误！');
                    return void cb();
                }

                const data = this.parseData();
                if (!data) {
                    this.$message.error('提交数据不能为空！');
                    return void cb();
                }

                addOrEdit({
                    api: this.apiFunc,
                    data: data,
                    success: this.cancel,
                    callback: cb,
                });
            });
        },
        cancel(path) {
            if (path != 'back') {
                path = this.backPath || this.listPath;
            }

            this.$bus.emit('tabs:close-current', path);
        },
    },
    watch: {
        '$route.query': {
            immediate: true,
            handler: 'initEdit',
        },
    },
};
