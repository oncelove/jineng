<template>
    <div class="sidebar" @mouseleave="mouseLeave">
        <!-- default-active="1-1" -->
        <!-- <el-menu class="el-menu-vertical-demo">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>平台首页</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                    <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>能源监测</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="2-1">选项1</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>能源分析</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="3-1">选项1</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>设备状态</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="4-1">选项1</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>报警管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="5-1">选项1</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>运维管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="6-1">选项1</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="7">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>档案管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="7-1">选项1</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="8">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>配置管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="8-1">选项1</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu> -->
        <!-- <ul class="side-bar-box side-close" ref="sideBarItemBox">
            <li>
                <i class="iconshouye1-copy iconfont"></i>
                <span>平台首页</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
            <li class="active">
                <i class="iconfont iconleida"></i>
                <span>能源监测</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
            <li>
                <i class="iconfont iconshuju2"></i>
                <span>能源分析</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
            <li>
                <i class="iconfont iconshuju2"></i>
                <span>设备状态</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
            <li>
                <i class="iconfont iconbaojingxiaoxi"></i>
                <span>报警管理</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
            <li>
                <i class="iconfont iconyunweizhongxin"></i>
                <span>运维管理</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
            <li>
                <i class="iconfont icondangan"></i>
                <span>档案管理</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
            <li>
                <i class="iconfont iconpeizhi"></i>
                <span>配置管理</span>
                <i class="iconfont iconrightArrows"></i>
            </li>
        </ul> -->
        <ul class="side-bar-box side-close" ref="sideBarItemBox">
            <li v-for="(items, index) in menuList" :key="index"  @mouseover="selectItem(items)" @click="itemHref(items)">
                <i class="iconfont iconpeizhi"></i>
                <span>{{items.name}}</span>
                <i class="iconfont iconrightArrows"></i>
                <!-- <navigation v-if="showNavigation" class="leave" :tonavlist="items.list"></navigation> -->
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
        mouseOver(){
            this.showNavigation = this.enterShowNav;
            document.getElementsByClassName('wrap')[0].classList.remove('wrap-close');
        },
        mouseLeave(){
            this.showNavigation = this.leaveShowNav;
            document.getElementsByClassName('wrap')[0].classList.add('wrap-close');
        },
        selectItem(item){
            if (item.list) {
                this.showNavigation = this.enterShowNav;
                document.getElementsByClassName('wrap')[0].classList.remove('wrap-close');
                this.tonavList = item.list;
            } else {
                this.showNavigation = false;
                document.getElementsByClassName('wrap')[0].classList.remove('wrap-close');
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
