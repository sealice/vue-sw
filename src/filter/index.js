export * from './filter';
import * as filter from './filter';
import * as state from './state';

export default function install(Vue) {
    // 把处理状态值的方法stateKey、setState、getState、stateToText添加到Vue原型上
    for (let [k, v] of Object.entries(state)) {
        Vue.prototype['$' + k] = v;
    }

    // 注册过滤器
    for (let key in filter) {
        Vue.filter(key, filter[key]);
    }
}
