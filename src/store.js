import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showNav:false,
        authorization: localStorage.getItem('authorization') ? localStorage.getItem('authorization') : '',
        navList:[],
    },
    getters: {
        enterShowNav: state => {
            return state.showNav = true;
        },
        leaveShowNav: state => {
            return state.showNav = false;
        },
        
    },
    mutations: {
        changeLogin:function(state,user){
            state.authorization = user.authorization;
            localStorage.setItem('authorization', user.authorization);
        },
        changeNavList(state,list){
            state.navList = list;
        }
    },
    actions: {

    }
})
