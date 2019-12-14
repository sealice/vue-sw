import axios from 'axios';
import './interceptor';

axios.defaults.baseURL = '/api/';
axios.defaults.timeout = 15000; // 请求超时/ms
// axios.defaults.emulateJSON = true; // 是否默认表单提交

export * from './apis/base_service';
