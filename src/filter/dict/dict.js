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
 * 从接口获取字典数据列表，当mapper或isCache是string类型是会作为key值
 * @param {function} api 获取接口数据方法，需返回Promise
 * @param {object} mapper 映射字段为value、label，默认映射接口返回的id、name字段
 * @param {boolean} isCache 是否缓存接口数据，默认缓存
 * @param {string} key 接口返回字典数据列表的字段，默认list
 */
export function fetchDict(api, mapper, isCache, key = 'list') {
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

/**
 * 解析字典键值（转为字符串/数字）
 * @param {string} key 字典键值
 * @param {boolean} numeric 是否返回数字，默认返回字符串
 */
export function dictKey(key, numeric) {
    return !numeric ? String(key) : Number(key);
}

/**
 * 设置字典数据，支持多层级
 * @param {string} key 字典类型字段
 * @param {object} dict 字典数据
 */
export function setDict(key, dict) {
    let data = dictData;
    const keys = key.split('.');
    const last = keys.length - 1;

    for (let [i, k] of Object.entries(keys)) {
        const error = new Error(`您正在进行破坏性的设置"dictData"的"${key}->${k}"值`);

        // 已是最后的key，开始赋值
        if (i == last) {
            if (data[k]) {
                if (!_isArray(data[k])) {
                    throw error;
                }
                // 原来是数组的先清空再添加元素，避免破坏原数组
                data[k].splice(0, data[k].length, ...dict);
            } else {
                data[k] = dict;
            }
            break;
        }

        if (!data[k]) {
            data = data[k] = Vue.observable({});
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
            data.setFlag(true);
            data.fetch().then(
                value => {
                    setDict(key, value);
                    if (!data.isCache) {
                        setTimeout(() => data.setFlag(false), 500);
                    }
                },
                err => {
                    console.warn(`从接口获取数据设置"dictData"的"${key}"值错误。`, err);
                    data.setFlag(false);
                }
            );
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
