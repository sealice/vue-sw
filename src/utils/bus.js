import Vue from 'vue';

export const bus = new Vue({
    methods: {
        emit(event, ...args) {
            this.$emit(event, ...args);
        },
        on(event, cb) {
            this.$on(event, cb);
        },
        off(event, cb) {
            this.$off(event, cb);
        },
    },
});

const install = Vue => {
    Vue.prototype.$bus = bus;
};

export default install;
