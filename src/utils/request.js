import axios from 'axios';
import buildURL from 'axios/lib/helpers/buildURL';
import { merge, isString, isUndefined } from 'axios/lib/utils';
import { ElMessage } from 'element-plus';
import bus from './bus';

// 默认配置
const defaults = {
    // baseURL: '',
    // timeout: 15000, // 默认请求超时/ms
    // emulateJSON: true, // 是否默认表单提交
};

// 响应状态
const statusText = {
    '0': '网络错误！',
    // '400': '错误的请求！',
    '401': '没有访问权限！',
    '403': '服务器拒绝访问！',
    '404': '请求地址不存在！',
    // '405': '禁用请求中指定的方法！',
    '408': '请求超时！',
    // '500': '服务器内部错误！',
    // '501': '无法识别请求！',
    '502': '错误网关！',
    '503': '服务不可用！',
    '504': '网关超时！',
    // '505': 'HTTP协议版本不受支持！',
};

let acitveAxios = 0;
let loadingFlag;
let timer;

function closeLoading() {
    acitveAxios--;
    if (acitveAxios <= 0) {
        timer = timer && clearTimeout(timer);
        loadingFlag = false;
        bus.emit('loading:hide');
    }
}

function setLoading(loadingText) {
    if (!loadingFlag && acitveAxios > 0) {
        loadingFlag = true;
        bus.emit('loading:show', { text: isString(loadingText) ? loadingText : '' });

        // 优化loading的显示，保证用250ms的时间显示loading
        // 避免请求响应在400-600ms之间时，loading闪现问题（loading还未来得及显示就关闭了）
        if (acitveAxios == 1) {
            acitveAxios++;
            setTimeout(closeLoading, 350);
        }
    }
}

function showLoading(loading) {
    acitveAxios++;

    if (!isUndefined(loading) && !loading) {
        return;
    }

    timer = timer && clearTimeout(timer);
    if (loading) {
        setLoading(loading);
    } else {
        // 400ms内请求还有没有响应则显示loading
        timer = setTimeout(setLoading, 400);
    }
}

function isPlainObject(val) {
    return val && val.constructor.name === 'Object';
}

// 请求拦截
function onFulfilledRequest(cfg) {
    showLoading(cfg.loading); // 传入真值立即显示loading，如果为字符串还会显示加载文本

    // 表单提交
    if (cfg.emulateJSON && isPlainObject(cfg.data)) {
        cfg.data = buildURL('', cfg.data).substr(1);
    }

    // 配置开发模式的代理环境
    if (process.env.NODE_ENV === 'development') {
        const proxyEnv = localStorage.proxyEnv || 'dev';
        const proxyHost = require('../../mock.proxy');
        if (proxyHost[proxyEnv]) {
            cfg.headers = cfg.headers || {};
            cfg.headers['X-Mock-Proxy'] = proxyHost[proxyEnv];
        }
    }

    return cfg;
}

// 响应拦截(成功)
function onFulfilledResponse(res) {
    closeLoading();

    const { config: cfg, data } = res;
    res.ok = true;

    if (!cfg.noIntercept) {
        if (data.code == 0) {
            return data;
        }

        if (cfg.errMsg || isUndefined(cfg.errMsg)) {
            ElMessage.error(cfg.errMsg || data.msg || '系统繁忙！');
        }

        return Promise.reject(res);
    }

    return res;
}

// 响应拦截(失败)
function onRejectedResponse(err) {
    closeLoading();

    const { request: req } = err;
    err.ok = false;

    switch (req.status) {
        // case 401:
        //     // do something
        //     break;
        default:
            ElMessage.error(statusText[req.status] || req.statusText || err.message);
    }

    return Promise.reject(err);
}

export function serviceCreate(config) {
    const service = axios.create(merge(defaults, config));
    service.interceptors.request.use(onFulfilledRequest);
    service.interceptors.response.use(onFulfilledResponse, onRejectedResponse);

    return service;
}

export const service = serviceCreate();

/** 默认不带参数的Get请求 */
export function get(url) {
    return config => service.get(url, config);
}

/** 带参数的Get请求 */
export function getParams(url) {
    return (params, config) => service.get(url, merge(config, { params }));
}

/** 默认的Post请求 */
export function post(url) {
    return (data, config) => service.post(url, data, config);
}

export default service;
