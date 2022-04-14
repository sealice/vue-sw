import { Message, MessageBox } from 'element-ui';

/** 添加或编辑数据 */
export function addOrEdit({ api, data, success, error, callback }) {
    return api(data, { errMsg: false })
        .then(res => {
            Message.success('提交成功！');
            success && success(res);
        })
        .catch(err => {
            if (err.ok) {
                const res = err.data;
                let errMsg = res.msg || '操作失败！';

                if (res.data && res.data.length) {
                    errMsg = res.data.map(({ error }) => error).join('，');
                }

                Message.error(errMsg);
            }

            error && error(err);
        })
        .finally(callback);
}

/** 删除操作 */
export function deleteData({ api, data, success, error, callback }) {
    MessageBox.confirm('此操作将永久删除该数据, 是否继续？', '温馨提示', {
        type: 'warning',
        callback: action => {
            if (action == 'confirm') {
                api(data, { errMsg: false })
                    .then(res => {
                        Message.success('删除成功！');
                        success && success(res);
                    })
                    .catch(err => {
                        if (err.ok) {
                            const errMsg = err.data.msg || '删除失败！';
                            Message.error(errMsg);
                        }

                        error && error(err);
                    })
                    .finally(callback);
            }
        },
    });
}

/** 根据传入的 data（数组）将对象里的 key（默认id）拼接成字符串 */
export function splitIds(data, key = 'id') {
    if (!data || !data.length) {
        Message.warning('请选择删除项~');
        return;
    }

    return data.map(item => item[key]).join(',');
}
