import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showNav:false,
    },
    getters: {
        enterShowNav: state => {
            return state.showNav = true;
        },
        leaveShowNav: state => {
            return state.showNav = false;
        }
    },
    mutations: {

    },
    actions: {

    }
})
