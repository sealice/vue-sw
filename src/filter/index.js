import stateText from './stateText';

let filter = {};
export default filter;

Object.defineProperty(filter, 'install', {
    value: Vue => {
        Object.assign(Vue.prototype, {
            // 解析状态码
            $stateKey: (key, numeric) => (numeric ? Number(key.substr(1)) : key.substr(1)),
            // 读取状态值对象
            $stateValue: stateType => stateText[stateType],
            // 状态转html
            $stateToHtml: (state, stateType, render) => render(state, filter.stateToText(state, stateType)),
        });

        // 注册过滤器
        for (let key in filter) {
            Vue.filter(key, filter[key]);
        }
    },
});

// 格式化日期，默认 yyyy-MM-dd hh:mm:ss
filter.date = function(date, format) {
    format = format || 'yyyy-MM-dd hh:mm:ss';
    if (typeof date === 'string') {
        date = date - 0 || (!/\d+T\d+/.test(date) ? date.replace(/-/g, '/') : date);
    }

    date = new Date(date);
    if (!date || date.toUTCString() == 'Invalid Date') {
        return '';
    }

    var map = {
        y: date.getFullYear(), // 年
        M: date.getMonth() + 1, //月
        d: date.getDate(), //日
        h: date.getHours(), //时
        m: date.getMinutes(), //分
        s: date.getSeconds(), //秒
        S: date.getMilliseconds(), //毫秒
        q: Math.floor((date.getMonth() + 3) / 3), //季度
    };

    return format.replace(/([yMdhmsqS])\1*/g, function(m, t) {
        var v = String(map[t]);
        if (t === 'y') {
            return v.substr(4 - m.length);
        }
        if (t === 'S') {
            return ('00' + v).substr(v.length - 1);
        }
        if (m.length > 1) {
            return ('0' + v).substr(v.length - 1);
        }
        return v;
    });
};

const number = function(number, precision, thousand) {
    precision = precision || 0;
    thousand = thousand || ',';
    if (typeof number == 'number' || (number -= 0)) {
        return (number.toFixed(precision) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&' + thousand);
    }
    return '';
};

// 格式化数字
filter.number = number;

// 格式化金钱
filter.money = money => number(money, 2);

// 状态过滤器
filter.stateToText = (state, stateType) => {
    return stateText[stateType]['k' + state] || stateText[stateType][state] || '';
};
