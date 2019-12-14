import axios from 'axios';
import { merge } from 'axios/lib/utils';

// @config {headers, emulateJSON, loading, msg, errMsg, disableInterceptor}
export const baseService = {
    // @data {username, password}
    login: (data, config) => {
        return axios.post('v1/login', data, merge({ emulateJSON: true }, config));
    },
};
