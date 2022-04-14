import { requestWrapper, get, getParams, post } from '@/utils/request';
export { requestWrapper };

// @config {headers, emulateJSON, loading, errMsg, noIntercept}

export const login = post('/v1/login');
export const getUser = get('/v1/userInfo');
export const getTable = getParams('/v1/table');
