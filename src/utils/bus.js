import Vue from 'vue';

export const bus = new Vue();

export default function install(Vue) {
    Vue.prototype.$bus = bus;
}
