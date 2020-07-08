import * as filter from './filter';
export * from './filter';

export default function install(Vue) {
    Object.assign(Vue.prototype, {
        // 解析状态码
        $stateKey: (key, numeric) => (numeric ? Number(key) : String(key)),
        // 读取状态值对象
        $stateValue: filter.stateValue,
        // 状态转html
        $stateToHtml: (state, stateKeys, render) => render(filter.stateToText(state, stateKeys), state),
    });

    // 注册过滤器
    for (let key in filter) {
        Vue.filter(key, filter[key]);
    }
}
