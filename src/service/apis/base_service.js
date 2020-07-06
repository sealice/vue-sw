import { merge } from 'axios/lib/utils';
import { service } from '@/utils/request';

// @config {headers, emulateJSON, loading, msg, errMsg, disableInterceptor}
export const baseService = {
    // @data {username, password}
    login: (data, config) => {
        return service.post('v1/login', data, merge({ emulateJSON: true }, config));
    },
    getUser: config => {
        return service.get('v1/userInfo', merge({}, config));
    },
};
