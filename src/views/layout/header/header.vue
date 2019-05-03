<template>
    <header class="topNav">
        <div class="left-show">
            <span class="address">余杭区</span>
            <span class="temperature">
                <i class="iconfont iconwenduji"></i>
                <em>13-19 °C</em>
            </span>
            <span class="flexBlock">
                <i class="iconfont iconxiayu"></i>
                <i>
                    <p>晴转多云</p>
                    <p>2019/4/1</p>
                </i>
            </span>
        </div>
        <div class="right-show">
            <div class="search-box">
                <!-- <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select" size="mini">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input> -->
                <input type="text" placeholder="Search for" v-model="searchText">
                <i class="iconfont iconsearch"></i>
            </div>
            <span class="iconfont iconjiankongshebei" title="监控"></span>
            <span class="iconfont iconxitong" title="大屏显示"></span>
            <span class="iconfont iconlingdang" title="提示"></span>
            <span class="iconfont iconquanping" title="全屏"></span>
            <span class="iconfont iconerweima1" title="二维码"></span>
            <div class=" user-box">
                <img src="https://wwc.alicdn.com/avatar/getAvatar.do" alt="">
                <el-dropdown trigger="click" @command="handleCommand" class="usernameBox">
                    <span class="el-dropdown-link">
                        {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            searchText:'',
            userName:'',
        }
    },
    created(){
        this.username = sessionStorage.getItem('username');
    },
    methods:{
        handleCommand(command){
            if (command == 'logout') {
                localStorage.removeItem('authorization');
                localStorage.removeItem('userType');
                sessionStorage.removeItem('username');
                this.$router.push({name:'login'})
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.usernameBox{
    width: 120px;
    text-align: center;
}
.el-dropdown-menu{
    width: 120px;
}
</style>

