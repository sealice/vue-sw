import Vue from 'vue';

// 保存对应状态文本对象，支持多层级书写。[{ value: 'xx', label: 'xxx' }]
// 使用过滤器stateToText显示对应状态文本
// 建议使用下面的2个方法来设置状态值

export default Vue.observable({
    //
});

/**
 * 转换解析状态值列表
 * @param {string} str 状态值对应字符串
 * @return [{ value: 'xx', label: 'xxx' }]
 * 例：transformState('0：否，1：是') // [{ value: '0', label: '否' }, { value: '1', label: '是' }]
 */
export function transformState(str) {
    return str
        .trim()
        .split(/[\n,，]+/)
        .map(item => {
            const [value, label] = item.trim().split(/\s*[:：]\s*/);
            return { value, label };
        });
}

/**
 * 从接口获取状态值列表
 * @param {function} api 获取接口数据方法，需返回Promise
 * @param {object} mapper 映射字段为value、label，默认映射id、name字段
 * @param {boolean} isCache 是否缓存接口数据，默认缓存
 * @param {string} key 接口返回状态值列表的字段，默认list
 * 当mapper或isCache是string类型是会作为key值
 */
export function fetchState(api, mapper, isCache, key = 'list') {
    const data = [];
    let flag = false; // 请求更新标记
    const mapperType = typeof mapper;
    const isCacheType = typeof isCache;

    if (mapperType == 'boolean') {
        if (isCacheType == 'string') {
            key = isCache;
        }
        [isCache, mapper] = [mapper];
    } else if (mapperType == 'string') {
        [key, mapper] = [mapper];
    } else if (isCacheType == 'string') {
        [key, isCache] = [isCache];
    }

    mapper = mapper || { value: 'id', label: 'name' };

    Object.defineProperties(data, {
        flag: {
            get() {
                return flag;
            },
        },
        setFlag: {
            value: function setFlag(bool) {
                flag = bool;
            },
        },
        isCache: {
            get() {
                return isCache === undefined || isCache;
            },
        },
        fetch: {
            value: function fetch() {
                return api().then(res => {
                    // 处理响应数据
                    return res[key].map(item => ({
                        value: item[mapper.value],
                        label: item[mapper.label],
                    }));
                });
            },
        },
    });

    return data;
}
