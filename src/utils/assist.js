import {
    isArray,
    isUndefined,
    isString,
    isNumber,
    isObject,
    isFunction,
    forEach,
    merge,
    deepMerge,
    extend,
} from 'axios/lib/utils';
import http from './request';

export { isArray, isUndefined, isString, isNumber, isObject, isFunction, forEach, merge, deepMerge, extend };

export function isPlainObject(val) {
    return val && val.constructor.name === 'Object';
}

/**
 * 向目标对象赋值，仅对目标对象target的key赋值，源source多余的key不会添加到target上
 * @param {object} target 待赋值目标对象
 * @param {object} source 赋值目标源
 */
export function assignment(target, source) {
    if (!isObject(target) || !isObject(source)) {
        return target;
    }

    for (let key in target) {
        if (!isUndefined(source[key])) {
            if (isObject(target[key])) {
                target[key] = assignment(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    return target;
}

/**
 * ElUpload组件自定义上传方法
 */
export function elUpload(option) {
    const formData = new FormData();

    if (option.data) {
        Object.keys(option.data).forEach(key => {
            formData.append(key, option.data[key]);
        });
    }

    formData.append(option.filename, option.file, option.file.name);

    http.post(option.action, formData, {
        loading: '上传中',
        headers: option.headers,
        withCredentials: option.withCredentials,
        onUploadProgress: e => {
            if (e.total > 0) {
                e.percent = (e.loaded / e.total) * 100;
            }
            option.onProgress(e);
        },
    }).then(option.onSuccess, option.onError);
}
