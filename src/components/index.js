import * as Components from './components';

export default function install(Vue) {
    for (let [k, v] of Object.entries(Components)) {
        Vue.component((v.name = k), v);
    }
}
