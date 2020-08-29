/* eslint no-unused-vars: "off" */

export { setDict, getDict, dictKey, toDictLabel } from './dict';
import Dict, { transformDict, fetchDict } from './dict';

// 设置字典文本数据，支持多层级书写。格式：[{ value: 'xx', label: 'xxx' }]
// 使用过滤器 toDictLabel 显示对应字典标签文本
// 建议使用 transformDict, fetchDict 2个方法来设置状态值

Dict({
    //
});
