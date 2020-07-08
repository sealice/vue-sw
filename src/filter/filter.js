import stateText from './stateText';

// 格式化日期，默认 yyyy-MM-dd hh:mm:ss
export const date = function(date, format) {
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

// 格式化数字
export const number = function(number, precision, thousand) {
    precision = precision || 0;
    thousand = thousand || ',';
    if (typeof number == 'number' || (number -= 0)) {
        return (number.toFixed(precision) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&' + thousand);
    }
    return '';
};

// 格式化金钱
export const money = money => number(money, 2);

// 读取状态值对象，支持多层级
export const stateValue = stateKeys => {
    let value = stateText;
    const keys = stateKeys.split('.');

    for (let i in keys) {
        const val = value[keys[i]];
        if (val) {
            value = val;
        } else {
            value = [];
            break;
        }
    }

    return value;
};

// 状态过滤器
export const stateToText = (state, stateKeys) => {
    const value = stateValue(stateKeys);
    let text = '';

    for (let i in value) {
        const val = value[i];
        if (val.key == state) {
            text = val.text;
            break;
        }
    }

    return text;
};
