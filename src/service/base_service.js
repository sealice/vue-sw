import http, { merge } from '@/utils/request';

// @config {headers, emulateJSON, loading, errMsg, disableInterceptor}

// @data {username, password}
export function login(data, config) {
    return http.post('v1/login', data, merge({ emulateJSON: true }, config));
}

export function getUser(config) {
    return http.get('v1/userInfo', merge({}, config));
}
