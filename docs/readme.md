## 主要包含模块

### Router 路由模块

> router 路由官方教程都有详细的解析。但是嵌套路由的使用需要为每个路由写个空的页面，如果路由的层级比较深的话，那就需要写很多这样的空页面（当然，完全可以只写一个空页面作为变量重复使用）；但是嵌套路由有个很难处理的问题，就是使用 keep-alive 组件缓存页面问题，嵌套路由超过 2 级之后页面的缓存就很难处理了。<br>

为了避免这问题，特意写了个解构路由的方法 `disintegrationRoutes`，通过这个方法可以把嵌套路由解构成没有嵌套的路由（仅有 1 级路由），而且该方法还对路由做了些特别处理：<br>

1. 路由没有定义 `name` 属性的话会自动加上 `name` 属性（通过 `path` 转化）；<br>
2. 对路由 `meta` 对象属性 `requireAuth`（需要身份验证）、`keepAlive`（页面缓存）属性也做了处理：如果父级有设置了这 2 个属性的话，那么子路由将会直接继承；

```js
[
    {
        level: 2,
        path: '/about',
        meta: { title: 'About', requireAuth: true, keepAlive: true },
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
        children: [
            {
                path: 'bar',
                meta: { title: 'Bar' },
                components: require('../views/HelloWorld.vue'),
            },
        ],
    },
];

// 经过disintegrationRoutes处理后，输出 =>

[
    {
        level: 2,
        path: '/about',
        name: 'about',
        meta: { title: 'About', requireAuth: true, keepAlive: true },
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    },
    {
        path: '/about/bar',
        name: 'about/bar',
        meta: { title: 'Bar', requireAuth: true, keepAlive: true },
        components: require('../views/HelloWorld.vue'),
    },
];
```

> 注：页面的缓存需要自己实现（如有需要的话）

### Store 存储模块（vuex 状态管理）

主要做了：<br>

1. 用户登录流程：基本上只需要改下接口和登录后返回的数据格式；<br>
2. 系统菜单：菜单是根据路由自动生成的，所以无需再手动写菜单目录了；有发现上面路由多了 `level` 属性吗？这个属性是用来生成菜单的，数字的大小决定了生成的菜单级数，比如上面的路由生成的菜单如下：

```js
[
    {
        title: 'About',
        path: '/about',
        name: 'about',
        icon: undefined, // icon 属性可以在路由的meta里添加
        children: [
            {
                title: 'Bar',
                path: '/about/bar',
                name: 'about/bar',
                icon: undefined,
                children: [],
            },
        ],
    },
];
```

### Axios 封装模块

> @/utils/request 对 axios 做了请求、响应拦截器封装<br>

添加的 config 配置属性：<br>

1. `emulateJSON` boolean 是否表单提交，默认 false；<br>
2. `loading` boolean / string 是否立即显示全屏 loading，为字符串时会显示加载文字，默认 false；<br>
3. `errMsg` boolean / string 是否提示错误消息，默认提示接口返回 msg 字段，如果 msg 字段为空则提示“系统繁忙！”<br>
4. `noIntercept` boolean 是否禁用响应拦截处理，默认 false；<br> _注意：响应拦截处理默认返回请求响应实体 body 数据，当接口返回错误或 noIntercept: true 时返回完整的 response 数据_

> 重要：拦截器需要根据项目实际情况做些调整，比如：请求返回的成功字段不一样（默认是`code`等于 0）；有需要在`headers`请求头添加参数等等

### Dict 字典模块

> @/filter/dict 字典数据维护管理模块<br>

在开发的时候，后端接口返回的数据某个（类型或是状态）字段只是数字，需要前端根据数字解析对应的文本。<br>
而前端的做法常常是需要用到的时候才会定义字典数据，然后写过滤器来显示对应的文本。这样不好管理维护字典数据，而且对于从接口获取的动态字典数据很少会去考虑缓存的问题，所以写了这个模块统一处理这些问题。**字典数据是响应式的**<br>

**使用：**

```js
// @/filter/dict/index.js
// 初始化（设置）字典数据
Dict({
    // 启用状态
    enable: [
        { value: '1', label: '是' },
        { value: '0', label: '否' },
    ],
});

// 推荐用下面方式
Dict({
    // 启用状态
    enable: transformDict(`1：是，0：否`),
});

// 然后可以通过 getDict 方法获取
getDict('enable');
// => [{value: '1', label: '是'}, {value: '0', label: '否'}]
```

**方法：**
| 方法名 | 参数 | 返回值 | 描述 |
| ---- | ---- | ---- | ---- |
| Dict | `obj` _Object_ 字典数据 | 具有响应式的字典数据 | 初始化字典数据 |
| transformDict | `str` _String_ 字典数据对应字符串 | 字典数据 | 转换解析字典数据列表 |
| fetchDict | `api` _Function_ 获取接口数据方法，需返回 Promise<br>`mapper` _Object_ 映射字段为 value、label，默认映射接口返回的 id、name 字段<br>`isCache` _Boolean_ 是否缓存接口数据，默认缓存<br>`key` _String_ 接口返回字典数据列表的字段，默认 list | 字典数据 | 从接口获取字典数据列表，当 mapper 或 isCache 是 string 类型是会作为 key 值 |
| dictKey | `key` _String_ 字典键值<br>`numeric` _Boolean_ 是否返回数字，默认否 | 字典键值 | 解析字典键值（转为字符串/数字） |
| setDict | `key` _String_ 字典类型字段<br>`dict` _Object_ 字典数据 | - | 设置字典数据，支持多层级（注：只能通过该方法添加字典数据） |
| getDict | `key` _String_ 字典类型字段 | 字典数据 | 获取字典数据，支持多层级 |
| toDictLabel | `value` _String/Number_ 字典键值<br>`dict` _String/Object_ 字典类型字段/数据 | 字典键值对应的标签文本 | 字典键值转为标签文本 |

> 重要：为了方便使用，已将方法 `$setDict`、`$getDict`、`$dictKey`、`$toDictLabel` 绑定到 Vue 的原型上，将方法 `toDictLabel` 注册为过滤器

### 公共组件

为了提升开发的效率，提供了几个在 Element-UI 上进一步封装的组件。<br>

> 表单组件 FlSelect、FlCheckbox、FlRadio、FlDatePicker、FlDaterangePicker 帮助快速的编写表单及简化表单操作处理

**FlSelect 下拉选择器**
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| value / v-model | 绑定值 | string / number / array / object | - |
| data | 传入的数据，格式`[{value: 'x', label: 'xx'}]`，即上面的字典数据格式 | array | - |
| dict-key | 字典数据的`key`值，`data | dickKey`参数只需传一个 | string | - |
| exclude | 需要排除的选项，需是选项的`value`值 | string / number / array | - |
| numeric | 是否把`value`转为数字类型 | boolean | false |
| is-object | `value`是否为对象 | boolean | false |
| valueKey | 作为`value`唯一标识的键名，可以通过设置`valueKey`更改绑定的选项值 | string | value |
| width | 设置宽度，接收数字或字符串，如果为数字单位是`px` | number / string | - |

> 其他属性和事件请查看 Elememt-UI 的 [ElSelect](https://element.eleme.cn/#/zh-CN/component/select#select-attributes) 组件

**FlCheckbox 多选框**
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| value / v-model | 绑定值 | array | - |
| data | 传入的数据，格式`[{value: 'x', label: 'xx'}]`，即上面的字典数据格式 | array | - |
| dict-key | 字典数据的`key`值，`data | dickKey`参数只需传一个 | string | - |
| exclude | 需要排除的选项，需是选项的`value`值 | string / number / array | - |
| numeric | 是否把`value`转为数字类型 | boolean | false |
| border | 是否带边框 | boolean | false |
| button-group | 是否为按钮样式 | boolean | false |

> 其他属性和事件请查看 Elememt-UI 的 [ElCheckboxGroup](https://element.eleme.cn/#/zh-CN/component/checkbox#checkbox-group-attributes) 组件

**FlRadio 单选框**
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| value / v-model | 绑定值 | string / number | - |
| data | 传入的数据，格式`[{value: 'x', label: 'xx'}]`，即上面的字典数据格式 | array | - |
| dict-key | 字典数据的`key`值，`data | dickKey`参数只需传一个 | string | - |
| exclude | 需要排除的选项，需是选项的`value`值 | string / number / array | - |
| numeric | 是否把`value`转为数字类型 | boolean | false |
| border | 是否带边框 | boolean | false |
| button-group | 是否为按钮样式 | boolean | false |

> 其他属性和事件请查看 Elememt-UI 的 [ElRadioGroup](https://element.eleme.cn/#/zh-CN/component/radio#radio-group-attributes) 组件

**FlDatePicker 日期选择器**
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| value / v-model | 绑定值 | string / date | - |
| before-date | 设置大于等于此日期为可选，当前日期可直接传`now`字符串 | string / date | - |
| after-date | 设置小于等于此日期为可选，当前日期可直接传`now`字符串 | string / date | - |
| value-format | 可选，绑定值的格式。不指定则绑定值为 Date 对象 | string | yyyy-MM-dd |
| width | 设置宽度，接收数字或字符串，如果为数字单位是`px` | number / string | - |

> 其他属性和事件请查看 Elememt-UI 的 [ElDatePicker](https://element.eleme.cn/#/zh-CN/component/date-picker#attributes) 组件

**FlDaterangePicker 日期范围选择器**
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| value / v-model | 绑定值 | array | - |
| start-time.sync | 绑定开始时间，不可与 value / v-model 同时设置 | string / date | - |
| end-time.sync | 绑定结束时间，不可与 value / v-model 同时设置 | string / date | - |
| completion-time | 是否补全时间，开始时间补 00:00:00，结束时间补 23:59:59 | boolean | false |
| before-date | 设置大于等于此日期为可选，当前日期可直接传`now`字符串 | string / date | - |
| after-date | 设置小于等于此日期为可选，当前日期可直接传`now`字符串 | string / date | - |
| value-format | 可选，绑定值的格式。不指定则绑定值为 Date 对象 | string | yyyy-MM-dd |
| width | 设置宽度，接收数字或字符串，如果为数字单位是`px` | number / string | - |

> 其他属性和事件请查看 Elememt-UI 的 [ElDatePicker](https://element.eleme.cn/#/zh-CN/component/date-picker#attributes) 组件
