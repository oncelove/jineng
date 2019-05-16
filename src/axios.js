import axios from 'axios'
import { Message } from 'element-ui'
import Vue from 'vue'
import baseUrl from './setBaseUrl'
import router from './router'
axios.defaults.baseURL = baseUrl;
// loading框设置局部刷新，且所有请求完成后关闭loading框
var loading;
function startLoading() {
    loading = Vue.prototype.$loading({
        lock: true,
        text: "Loading...",
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        // target: document.querySelector('.loading-area')//设置加载动画区域
    });
}
function endLoading() {
    loading.close();
}

// 请求拦截
axios.interceptors.request.use(config => {
    // 在发送请求之前做某事，比如说 设置token
    // config.headers['token'] = 'token';
    startLoading();
    if (localStorage.getItem('authorization')) {
        config.headers.token = localStorage.getItem('authorization');
    }
    return config;
}, error => {
    // 请求错误时做些事
    endLoading();
    Message.error({ message: '请求超时!' });
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // 对响应数据做些事
    endLoading();
    if (response.status === 200) {
        // console.log(response)
        if (response.data.msg == "成功" && response.data.code === 0) {
            // console.log('成功')
            // response.data.data.value = '我是返回成功' // 在请求成功后可以对返回的数据进行处理，再返回到前台
        }

        if(response.data.code === 401){
            localStorage.removeItem('authorization');
            localStorage.removeItem('userType');
            router.push({path:'/login'});
        }
    }

    if (response.status === 401) {
        localStorage.removeItem('authorization');
        localStorage.removeItem('userType');
        router.push('/login')
    }
    return response;
}, error => {
    endLoading();
    console.log(error);
    if ( error && error.response) {
        switch ( error.response.status) {
            case 400:
                Message.error('错误请求')
                break;
            case 500:
                Message.error({ message: '服务器被吃了⊙﹏⊙∥' })
                break;
            default:
                Message.error(`连接错误${error.response.status}`)
        }
    } else {
        Message.error('网络出现了问题，请稍后刷新重试');
    }
    // if (!error.response.status) {
    //     return Promise.reject(error.data); // 返回接口返回的错误信息
    // }
    // if (error.response.status == 500) {
    //     Message.error({ message: '服务器被吃了⊙﹏⊙∥' });
    // }
})
axios.defaults.timeout = 30000;// 请求超时5fen
// RequestBody => post
export const postJsonRequest = (url, params) => {
    return axios({
        method: 'post',
        url: url,
        data: params,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
// RequestBody => put
export const putJsonRequest = (url, params) => {
    return axios({
        method: 'put',
        url: url,
        data: params,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
// formData => post
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: url,
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
// get
export const getRequest = (url, data = '') => {
    return axios({
        method: 'get',
        params: data,
        url: url,
    });
}
// DELETE
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: url,
        data: params,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
// RequestBody => uploadPost
export const uploadPostRequest = (url, params) => {
    return axios({
        method: 'post',
        url: url,
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}