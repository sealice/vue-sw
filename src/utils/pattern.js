const pattern = {
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,

    tel: /^(0\d{2,3}[- ]?[1-9]\d{6,7})|([48]00[- ]?[1-9]\d{6})$/,

    mobile: /^(0|86|17951)?(13[0-9]|14[57]|15[012356789]|1[6789][0-9])[0-9]{8}$/,

    // 字母、数字、特殊字符最少2种组合（不能有中文）
    password: /^(?!.*[^\x00-\xff])(?![a-zA-Z]+$)(?![\d]+$)(?![^a-zA-Z\d]+$).{6,20}$/,

    url: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,

    IDCard: /^([1-9]\d{7}((0\d)|(1[0-2]))(([012]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([012]\d)|3[0-1])((\d{4})|\d{3}[Xx]))$/,
};

const firstUpperCase = function(str) {
    return str.replace(/\w/, m => m.toUpperCase());
};

Object.keys(pattern).forEach(key => {
    pattern['is' + firstUpperCase(key)] = function(text) {
        return pattern[key].test(text);
    };
});

// 弱密码为3个以上的连续或重复字符
pattern.isWeakPassword = function(text) {
    let isWeak = false;
    if (text) {
        const str = 'abcdefghijklmnopqrstuvwxyz0123456789|9876543210zyxwvutsrqponmlkjihgfedcba';
        text.replace(/[^0-9]{3,}|[^a-z]{3,}/gi, function(m) {
            if (!isWeak) {
                isWeak = /^(.)\1{2,}$/.test(m) || str.indexOf(m.toLowerCase()) > -1;
            }
        });
    }
    return isWeak;
};

export default pattern;
