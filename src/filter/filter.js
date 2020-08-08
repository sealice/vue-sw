export { stateToText } from './state';

// 格式化日期
export const dateFormat = function (date, format) {
    if (typeof date === 'string') {
        date = date - 0 || (!/\d+T\d+/.test(date) ? date.replace(/-/g, '/') : date);
    }

    const d = new Date(date);
    if (!date || d.toUTCString() === 'Invalid Date') {
        return '';
    }

    var map = {
        y: d.getFullYear(), // 年
        M: d.getMonth() + 1, //月
        d: d.getDate(), //日
        h: d.getHours(), //时
        m: d.getMinutes(), //分
        s: d.getSeconds(), //秒
        S: d.getMilliseconds(), //毫秒
        q: Math.floor((d.getMonth() + 3) / 3), //季度
    };

    return format.replace(/([yMdhmsqS])\1*/g, function (m, t) {
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

export const date = date => dateFormat(date, 'yyyy-MM-dd');
export const datetime = date => dateFormat(date, 'yyyy-MM-dd hh:mm:ss');

// 格式化数字
export const number = function (number, precision, thousand) {
    precision = precision || 0;
    thousand = thousand || ',';
    if (typeof number == 'number' || (number -= 0)) {
        return (number.toFixed(precision) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&' + thousand);
    }
    return '';
};

// 格式化金钱
export const money = money => number(money, 2);
