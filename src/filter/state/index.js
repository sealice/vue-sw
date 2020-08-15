/* eslint no-unused-vars: "off" */

export { setState, getState, stateKey, stateToText } from './state';
import State, { transformState, fetchState } from './state';

// 设置对应状态文本对象，支持多层级书写。格式：[{ value: 'xx', label: 'xxx' }]
// 使用过滤器stateToText显示对应状态文本
// 建议使用 transformState、fetchState 2个方法来设置状态值

State({
    //
});
