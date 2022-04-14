import Vue from 'vue';

let dictData = null;
const _isArray = Array.isArray;

function isPlainObject(val) {
    return val && val.constructor.name === 'Object';
}

/**
 * 初始化字典数据
 * @param {object} obj 字典数据
 */
export default function Dict(obj) {
    if (!dictData && isPlainObject(obj)) {
        dictData = Vue.observable(obj);
    }

    return dictData;
}

/**
 * 转换解析字典数据列表.
 * 例：transformDict('0：否，1：是') // [{ value: '0', label: '否' }, { value: '1', label: '是' }]
 * @param {string} str 字典数据对应字符串
 */
export function transformDict(str) {
    return str
        .trim()
        .split(/[\n,，]+/)
        .map(item => {
            const [value, label] = item.trim().split(/\s*[:：]\s*/);
            return { value, label };
        });
}

/**
 * 从接口获取字典数据列表
 * @param {object} opts 接口相关参数对象：
 *                 `api` 获取接口数据方法，需返回Promise；
 *                 `data` 接口数据请求参数；
 *                 `config` 接口配置参数；
 *                 `isCache` 是否缓存接口数据，默认缓存；
 *                 `callback` 处理接口返回的数据方法，需返回数据格式：[{value, label}]。
 * @param {string} key 接口返回字典数据列表的字段，默认list
 */
export function fetchDict(opts, key = 'list') {
    const dictData = [];
    const {
        api,
        data,
        config,
        isCache,
        callback = res => {
            if (_isArray(res[key])) {
                return res[key].map(({ id, name }) => ({ value: id, label: name }));
            }
        },
    } = opts || {};

    if (typeof api !== 'function') {
        console.error(`[Dict]: 参数api必须是一个返回Promise的接口方法`);
    }

    Object.defineProperties(dictData, {
        loading: {
            value: false, // 请求状态
            writable: true,
        },
        flag: {
            value: false, // 请求更新标记
            writable: true,
        },
        isCache: {
            get() {
                return isCache == null || isCache;
            },
        },
        fetch: {
            value: function fetch() {
                return api(data, config).then(res => {
                    // 处理响应数据
                    const list = callback(res);

                    if (!_isArray(list)) {
                        throw new Error(`[Dict]: 请求接口数据处理应该返回"dictData"格式的数组，而不是${typeof list}`);
                    }

                    return list;
                });
            },
        },
    });

    return dictData;
}

/**
 * 解析字典键值（转为字符串/数字）
 * @param {string} key 字典键值
 * @param {boolean} numeric 是否返回数字，默认返回字符串
 */
export function toKey(key, numeric) {
    return !numeric ? String(key) : Number(key);
}

/**
 * 设置字典数据，支持多层级
 * @param {string} key 字典类型字段
 * @param {array} dict 字典数据
 */
export function setDict(key, dict) {
    let data = dictData;
    const keys = key.split('.');
    const last = keys.length - 1;

    for (let [i, k] of Object.entries(keys)) {
        const error = new Error(`[Dict]: 正在进行破坏性的设置"dictData"的"${key}->${k}"值`);

        // 已是最后的key，开始赋值
        if (i == last) {
            if (data[k]) {
                if (!_isArray(data[k])) {
                    throw error;
                }

                if (!dict.fetch) {
                    // 原来是数组的先清空再添加元素，避免破坏原数组
                    data[k].splice(0, data[k].length, ...dict);
                } else {
                    data[k] = dict;
                }
            } else {
                data[k] = dict;
            }
            break;
        }

        if (!data[k]) {
            Vue.set(data, k, {});
            data = data[k];
            continue;
        }

        if (_isArray(data[k])) {
            throw error;
        }

        data = data[k];
    }
}

/**
 * 获取字典数据，支持多层级
 * @param {string} key 字典类型字段
 */
export function getDict(key) {
    let data = dictData;

    if (!key && key !== undefined) {
        return [];
    } else if (key) {
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
            // data.splice(0, data.length); // 更新前先清除缓存
            data.flag = true;
            data.loading = true;
            setTimeout(() => {
                data.fetch().then(
                    value => {
                        setDict(key, value);
                        data.loading = false;
                        if (!data.isCache) {
                            data.flag = false;
                        }
                    },
                    err => {
                        console.error(`从接口获取数据设置"dictData"的"${key}"值错误。`, err);
                    }
                );
            }, 0);
        }
    }

    return data;
}

/**
 * 字典键值转为标签文本
 * @param {string | number} value 字典键值
 * @param {string | object} dict 字典类型字段/数据
 */
export function toDictLabel(value, dict) {
    let data;
    let text = '';

    switch (true) {
        case typeof dict === 'string' && dict !== '':
            data = getDict(dict);
            break;

        case _isArray(dict) && dict.length > 0:
            data = dict;
            break;

        default:
            return text;
    }

    for (let val of data) {
        if (val.value == value) {
            text = val.label;
            break;
        }
    }

    return text;
}
