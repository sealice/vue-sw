// 保存状态对应文本对象，支持多层级书写。[{ value: 'xx', label: 'xxx' }]
// 使用过滤器stateToText显示对应状态文本

/**
 * 转换解析状态值
 * @param {string} str 状态值对应字符串
 * @return [{ value: 'xx', label: 'xxx' }]
 * 例：transformLabel('0：否，1：是') // [{ value: '0', label: '否' }, { value: '1', label: '是' }]
 */
function transformState(str) {
    return str
        .trim()
        .split(/[\n,，]+/)
        .map(item => {
            const [value, label] = item.trim().split(/[:：]/);
            return { value, label };
        });
}

export default {
    //
};
