// import Vue from 'vue';
import axios from 'axios';
import buildURL from 'axios/lib/helpers/buildURL';

function isPlainObject(val) {
    return val && val.constructor.name === 'Object';
}

function random(lower, upper) {
    return Math.floor(Math.random() * (upper - lower) + lower);
}

// 请求拦截
axios.interceptors.request.use(cfg => {
    // 表单提交
    if (cfg.emulateJSON && isPlainObject(cfg.data)) {
        cfg.data = buildURL('', cfg.data).substr(1);
    }

    if (cfg.loading) {
        console.log('loading show');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(cfg);
            }, random(300, 1000));
        });
    }
    return cfg;
});

// 响应拦截
axios.interceptors.response.use(
    res => {
        const { config: cfg, data } = res;
        res.ok = true;
        if (cfg.errMsg === void 0) cfg.errMsg = '00';
        if (cfg.loading) console.log('loading hide');

        if (!cfg.disableInterceptor) {
            if (data.code == 0) {
                cfg.msg && console.error(data.msg || successText[cfg.msg] || cfg.msg);
                return res;
            }
            cfg.errMsg && console.error(data.msg || failText[cfg.errMsg] || cfg.errMsg);
            return Promise.reject(res);
        }
        return res;
    },
    err => {
        const { config: cfg, request: req } = err;
        err.ok = false;
        if (cfg.loading) console.log('loading hide');
        console.error(statusText[req.status] || req.statusText || err.message);
        return Promise.reject(err);
    }
);

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

const failText = {
    '00': '系统繁忙！',
    '01': '获取数据失败！',
    '02': '操作失败！',
};

const successText = {
    '00': '操作成功！',
};
