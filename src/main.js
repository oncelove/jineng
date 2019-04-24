import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
import axios_instance from './axios'
import VueAxios from 'vue-axios'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts 
Vue.use(ElementUI)
Vue.use(VueCookies)
Vue.use(VueAxios, axios_instance);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
