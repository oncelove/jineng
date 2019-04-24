import Vue from 'vue'
import Axios from 'axios'
import Qs from 'qs'
import { Message } from 'element-ui'
import router from './router'

Vue.prototype.$http= Axios; 
Axios.defaults.timeout = 5000 // 请求超时
Axios.defaults.baseURL = '/api/'  // api 即上面 vue.config.js 中配置的地址

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

var axios_instance = Axios.create({
    // config里面有这个transformRquest， 这个选项会在发送参数前进行处理。 这时候我们通过Qs.stringify转换为表单查询参数
    transformRequest: [function (data) {
        data = Qs.stringify(data);
        return data;
    }],
    // 设置Content - Type
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }    
});

// 添加请求拦截器
axios_instance.interceptors.request.use(config => {
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
axios_instance.interceptors.response.use(response => {
    // 对响应数据做些事
    endLoading();
    if (response.status === 200) {
        // console.log(response)
        if (response.data.msg == "成功" && response.data.code === 0) {
            console.log('成功')
            // response.data.data.value = '我是返回成功' // 在请求成功后可以对返回的数据进行处理，再返回到前台
        }

        if(response.data.code === 401){
            localStorage.removeItem('authorization');
            console.log(router);
            // Vue.$router.push('/login')
        }
    }

    if (response.status === 401) {
        localStorage.removeItem('authorization');
        Vue.$router.push('/login')
    }
    return response;
}, error => {
    endLoading();
    if (!err.response.status) {
        return Promise.reject(error.data); // 返回接口返回的错误信息
    }
    if (err.response.status == 500) {
        Message.error({ message: '服务器被吃了⊙﹏⊙∥' });
    }
})

export default axios_instance;