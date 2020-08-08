export { transformState, fetchState } from './stateData';
import stateData from './stateData';

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
                if (!Array.isArray(data[k])) {
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

        if (Array.isArray(data[k])) {
            throw error;
        } else {
            data = data[k];
        }
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
            data.fetch().then(value => {
                setState(key, value);
            });
        } else {
            setTimeout(() => {
                data.setFlag(false);
            }, 500);
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
