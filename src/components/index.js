const ctx = require.context('.', true, /\.vue$/);
const components = ctx.keys().map(key => ctx(key).default);

export default function install(Vue) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
}
