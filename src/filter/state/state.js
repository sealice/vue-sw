import Vue from 'vue';

let stateData = null;
const _isArray = Array.isArray;

function isPlainObject(val) {
    return val && val.constructor.name === 'Object';
}

export default function State(obj) {
    if (!stateData && isPlainObject(obj)) {
        stateData = Vue.observable(obj);
    }

    return stateData;
}

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
 *
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

    mapper = Object.assign({ value: 'id', label: 'name' }, mapper);

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
                    if (!_isArray(res[key])) {
                        throw new Error(`响应数据中"${key}"应该是一个数组，而不是${typeof res[key]}`);
                    }

                    return res[key].map(item => ({
                        value: item[mapper.value],
                        label: item[mapper.label],
                        ...item,
                    }));
                });
            },
        },
    });

    return data;
}

// 解析状态码（转为字符串/数字）
export const stateKey = (key, numeric) => {
    return numeric ? Number(key) : String(key);
};

// 设置状态值对象，支持多层级
export const setState = (key, value) => {
    let data = stateData;
    const keys = key.split('.');
    const last = keys.length - 1;

    for (let [i, k] of Object.entries(keys)) {
        const error = new Error(`您正在进行破坏性的设置"stateData"的"${key}->${k}"值`);

        // 已是最后的key，开始赋值
        if (i == last) {
            if (data[k]) {
                if (!_isArray(data[k])) {
                    throw error;
                }
                // 原来是数组的先清空再添加元素，避免破坏原数组
                data[k].splice(0, data[k].length, ...value);
            } else {
                data[k] = value;
            }
            break;
        }

        if (!data[k]) {
            data = data[k] = {};
            continue;
        }

        if (_isArray(data[k])) {
            throw error;
        }

        data = data[k];
    }
};

// 读取状态值对象，支持多层级
export const getState = key => {
    let data = stateData;

    if (key) {
        const keys = key.split('.');

        for (let k of keys) {
            if (data[k]) {
                data = data[k];
            } else {
                data = [];
                break;
            }
        }
    }

    // 从api获取数据
    if (data.fetch && (!data.length || !data.isCache)) {
        if (!data.flag) {
            data.setFlag(true);
            data.fetch().then(
                value => {
                    setState(key, value);
                    if (!data.isCache) {
                        setTimeout(() => data.setFlag(false), 500);
                    }
                },
                err => {
                    console.warn(`从接口获取数据设置"stateData"的"${key}"值错误。`, err);
                    data.setFlag(false);
                }
            );
        }
    }

    return data;
};

// 状态转为文本
export const stateToText = (stateVal, stateKey) => {
    const data = getState(stateKey);
    let text = '';

    for (let val of data) {
        if (val.value == stateVal) {
            text = val.label;
            break;
        }
    }

    return text;
};
