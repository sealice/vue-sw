/**
 * 配置 http-mock-middleware 的代理环境，前后端联调时设置
 * 说明：
 * 1、通过设置 localStorage.proxyEnv 为以下对应的环境使用，默认为 dev
 * 2、当使用的环境没有设置代理地址时，将使用mockjs假数据（文件夹mock里的json文件）
 */

module.exports = {
  dev: '',
  test: '',
};
