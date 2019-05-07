<template>
    <div class="wrap wrap-close">
        <div class="leftNav nav-close">
            <div class="logo">
                <a href="/">
                    <img src="./../../assets/logo.png" alt="" class="logo-open">
                    <img src="./../../assets/logo-close.png" alt="" class="logo-close">
                </a>
            </div>
            <sidebar :menuList="menuList"></sidebar>
        </div>
        <div class="main">
            <topheader></topheader>
            <!-- <div class="content"> -->
            <router-view class="content"/>
            <!-- <mainContent class="content"></mainContent> -->
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import sidebar from './sidebar/sidebar'
import topheader from './header/header'
import mainContent from './content/main'
import {getRequest} from './../../axios.js'
export default {
    data() {
        return {
            menuList:[],
        }
    },
    components: { sidebar, topheader, mainContent },
    created(){
        // 获取导航栏菜单
        this.getMenus();
        // 获取state中是否拥有用户信息
        this.getHaveUsersList();
        // 获取角色列表
        this.getRoles();
        // 获取部门列表
        this.getDepartments();
    },
    methods:{
        getMenus(){
            getRequest('/api/menus/nav').then(res => {
                if (res.data.code === 0) {
                    this.menuList = res.data.menuList;
                } else {
                    this.$message.error(res.data.code,res.data.msg);
                }
            }).catch( err => {
                console.log(err);
                this.$message.error(err + 'url:/menus/nav');
            });
        },

        getRoles(){
            getRequest('/api/roles/select').then( res => {
                if (res.data.code === 0) {
                    let rolesArray = [];
                    res.data.list.map( (val, index) => {
                        rolesArray.push({
                            roleId: val.roleId,
                            roleName: val.roleName
                        })
                    })
                    this.$store.commit('changeroleNames',rolesArray);
                } else {
                    this.$message.error(res.data.code,res.data.msg);
                }
            }).catch( err => {
                console.log(err);
                this.$message.error(err + 'url:/roles/select');
            })
        },

        getDepartments(){
            getRequest('/api/departments/select').then( res => {
                if (res.data.code === 0) {
                    let departmentArray = [];
                    res.data.deptList.map( (val, index) => {
                        departmentArray.push({
                            depid: val.departmentId,
                            name: val.name,
                        })
                    })
                    this.$store.commit('changeDepartmentArray',departmentArray);
                } else {
                    this.$message.error(res.data.code,res.data.msg);
                }
            }).catch( err => {
                console.log(err);
                this.$message.error(err + 'url:/departments/select');
            });
        },

        getHaveUsersList(){
            if ( !this.$store.state.usersList ) {
                getRequest('/api/users/info').then( res => {
                    if ( res.data.code === 0) {
                        this.$store.commit('changeUsersList',res.data.user)
                    }
                }).catch( err => {
                    console.log(err);
                })
            }
        }
    }
}
</script>

<style lang="scss">

</style>

