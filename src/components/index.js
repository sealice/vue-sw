import * as Components from './components';

export default function install(Vue) {
    for (let [k, v] of Object.entries(Components)) {
        if (!v.name) {
            v.name = k;
        }

        Vue.component(v.name, v);
    }
}
