# vue-sw

> 一个包含大部分通用模块功能的空白项目框架，对各个模块做了封装处理并简化操作，目的是为了能够快速搭建开发项目。
>
> **特性：**
>
> -   基本的框架逻辑，如：路由/请求拦截、登录流程等
> -   优化打包处理，如：按需加载、打包移除 `console.log / debugger`、打包移除多余的样式等
> -   方便本地假数据 mockjs 文件设置，存放于 /mock 文件夹
> -   方便快速切换后端代理环境，不需要重启服务
> -   使用后端代理时，支持将接口数据保存为 mockjs 文件，存放于 /.data 文件夹
> -   支持以 ServiceWork 方式缓存静态资源，甚至可配置为离线应用

[查看文档](./docs/readme.md)

[Vue 3.0 版本](https://github.com/sealice/vue-sw/tree/vue3.0)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
