import Vue from 'vue';

const bus = new Vue();

export default {
    install(Vue) {
        Vue.prototype.$bus = this;
    },
    on(event, callback) {
        bus.$on(event, callback);
        return this;
    },
    once(event, callback) {
        bus.$once(event, callback);
        return this;
    },
    off(event, callback) {
        bus.$off(event, callback);
        return this;
    },
    emit(event, ...args) {
        bus.$emit(event, ...args);
        return this;
    },
};
