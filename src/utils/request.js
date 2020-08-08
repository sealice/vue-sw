// import Vue from 'vue';
import axios from 'axios';
import buildURL from 'axios/lib/helpers/buildURL';
import { merge } from 'axios/lib/utils';

function isPlainObject(val) {
    return val && val.constructor.name === 'Object';
}

let acitveAxios = 0;
let loadingInstance;
let timer;

const setLoading = () => {
    if (acitveAxios > 0) {
        loadingInstance = true;
        console.log('loading show', Date.now());

        // 优化loading的显示，保证用250ms的时间显示loading
        // 避免请求响应在400-600ms之间时，loading闪现问题（loading还未来得及显示就关闭了）
        if (acitveAxios == 1) {
            acitveAxios++;
            setTimeout(closeLoading, 250);
        }
    }
};

const showLoading = loading => {
    if (loading !== undefined && !loading) {
        return;
    }

    acitveAxios++;
    timer = timer && clearTimeout(timer);
    if (loading) {
        setLoading();
    } else {
        // 400ms内请求还有没有响应则显示loading
        timer = setTimeout(setLoading, 400);
    }
};

const closeLoading = () => {
    acitveAxios--;
    if (acitveAxios <= 0) {
        timer = timer && clearTimeout(timer);
        if (loadingInstance) {
            console.log('loading hide', Date.now());
            loadingInstance = null;
        }
    }
};

// 请求拦截
const requestInterceptors = [
    cfg => {
        showLoading(cfg.loading); // 传入true立即显示loading

        // 表单提交
        if (cfg.emulateJSON && isPlainObject(cfg.data)) {
            cfg.data = buildURL('', cfg.data).substr(1);
        }

        return cfg;
    },
];

// 响应拦截
const responseInterceptors = [
    res => {
        closeLoading();

        const { config: cfg, data } = res;
        res.ok = true;
        if (cfg.errMsg === void 0) cfg.errMsg = '系统繁忙！';

        if (!cfg.disableInterceptor) {
            if (data.code == 0) {
                return data;
            }

            cfg.errMsg && console.error(data.msg || cfg.errMsg);
            return Promise.reject(res);
        }
        return data;
    },
    err => {
        closeLoading();

        const { request: req } = err;
        err.ok = false;
        console.error(statusText[req.status] || req.statusText || err.message);
        return Promise.reject(err);
    },
];

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

const defaults = {
    // baseURL: '',
    // timeout: 15000, // 默认请求超时/ms
    // emulateJSON: true, // 是否默认表单提交
};

export const serviceCreate = config => {
    const service = axios.create(merge(defaults, config));
    service.interceptors.request.use(...requestInterceptors);
    service.interceptors.response.use(...responseInterceptors);

    return service;
};

export const service = serviceCreate();
