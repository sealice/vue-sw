/**
 * 配置 http-mock-middleware 的代理环境，前后端联调时设置
 * 说明：
 * 1、当 enabled: true 才会使用代理，可以随意设置多个代理环境
 * 2、当代理环境配置为对象时，key 为匹配地址前缀，value 为代理地址或对象 {target, rewrite}
 *    (target 为代理地址，rewrite 为重写匹配的地址前缀 key)
 * 3、通过设置 Cookies 的 PROXY_ENV 值使用以下对应的代理环境，默认为 dev
 * 4、当使用的环境没有设置代理地址时，将退回使用本地 Mockjs 假数据（文件夹 mock 里的 json 文件）
 */

module.exports = {
  enabled: true,
  proxy: {
    dev: '',
    test: '',
  },
};
