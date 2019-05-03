<template>
    <div class="sidebar" @mouseleave="mouseLeave">
        <ul class="side-bar-box side-close" ref="sideBarItemBox">
            <li v-for="(items, index) in menuList" :key="index"  @mouseover="selectItem(items)" @click="itemHref(items)">
                <i class="iconfont" :class="items.icon"></i>
                <span>{{items.name}}</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
        </ul>
        <navigation v-if="showNavigation" class="leave" :tonavList='tonavList'></navigation>
    </div>
</template>

<script>
import navigation from './navigation'
// import './../../../assets/icon/iconfont.css'
export default {
    props:['menuList'],
    components:{
        navigation,
    },
    data() {
        return {
            showNavigation:false,
            tonavList:[],
        };
    },
    computed:{
        showNavList(){
            return this.$store.state.showNav;
        },
        enterShowNav(){
            return this.$store.getters.enterShowNav;
        },
        leaveShowNav(){
            return this.$store.getters.leaveShowNav;
        }
    },
    methods:{
        mouseLeave(){
            this.showNavigation = this.leaveShowNav;
            document.getElementsByClassName('wrap')[0].classList.add('wrap-close');
        },
        selectItem(item){
            if ( !item.children || item.children.length === 0) {
                this.showNavigation = false;
                document.getElementsByClassName('wrap')[0].classList.remove('wrap-close');
            } else {
                this.showNavigation = this.enterShowNav;
                document.getElementsByClassName('wrap')[0].classList.remove('wrap-close');
                this.tonavList = item.children;
            }
        },
        itemHref(item){
            if (item.url) {
                this.$router.push({path:item.url})
            }
        }
    },
    mounted(){

    }
};
</script>

<style lang="scss" scoped>
.iconfont{
    font-size: 20px;
}
</style>
