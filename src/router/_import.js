/**
 * 动态路由页面导入方法
 */

// 自动加载 views 里的 .vue 页面文件
const pages = require.context('@/views/', true, /(?<!(@common|components)([\\/][\w-]+)*)[\\/][\w-]+.vue$/, 'lazy');

export default path => {
    return () => pages(`./${(path || 'unknown').replace(/^\.?\/|\.vue$/, '')}.vue`);
};
