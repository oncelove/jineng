import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import './styles/index.scss'

Vue.config.productionTip = false

import axios from 'axios'
Object.defineProperty(Vue.prototype, '$http', {
    value: axios
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
