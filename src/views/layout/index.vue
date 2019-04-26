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
export default {
    data() {
        return {
            menuList:[],
        }
    },
    components: { sidebar, topheader, mainContent },
    created(){
        this.$http.post('/menus/nav').then(res => {
            console.log(res)
            this.menuList = res.data.menuList;
            // console.log(this.menuList);
        }).catch( err => {
            console.log(err);
        })
    }
}
</script>

<style lang="scss">

</style>

