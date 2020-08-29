export * from './filter';
import * as filter from './filter';
import * as dict from './dict';

export default function install(Vue) {
    // 把处理字典数据的方法dictKey、setDict、getDict、toDictLabel添加到Vue原型上
    for (let [k, v] of Object.entries(dict)) {
        Vue.prototype['$' + k] = v;
    }

    // 注册过滤器
    for (let key in filter) {
        Vue.filter(key, filter[key]);
    }
}
