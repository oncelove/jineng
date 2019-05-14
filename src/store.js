import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showNav:false,
        authorization: localStorage.getItem('authorization') ? localStorage.getItem('authorization') : '',
        navList:[],
        roleNames:null, // 角色列表
        departmentArray:null, // 部门列表
        usersList:null, // 登录后，用户保存的集合
        dialogTableVisible:false, // 显示弹窗
        permissions:null,
    },
    getters: {
        enterShowNav: state => {
            return state.showNav = true;
        },
        leaveShowNav: state => {
            return state.showNav = false;
        },
        listenDialogTableVisible: state => {
            return state.dialogTableVisible;
        }
        
    },
    mutations: {
        changeLogin:function(state,user){
            state.authorization = user.authorization;
            localStorage.setItem('authorization', user.authorization);
        },
        changeNavList(state,list){
            state.navList = list;
        },
        changeroleNames( state, list) {
            state.roleNames = list;
        },
        changeDepartmentArray( state, list) {
            state.departmentArray = list;
        },
        changeUsersList(state, list) {
            state.usersList = list;
            // localStorage.setItem('userType',list.userList.userType)
        },
        changeDialogTableVisible(state, data){
            state.dialogTableVisible = data;
        },
        // 权限
        changePower(state, list){
            state.permissions = list;
        }

    },
    actions: {

    }
})
