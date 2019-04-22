<template>
    <div class="sidebar" @mouseover="mouseOver" @mouseleave="mouseLeave">
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
        <ul class="side-bar-box" ref="sideBarItemBox">
            <li>
                <span>平台首页</span>
            </li>
            <li class="active">
                <span>能源监测</span>
            </li>
            <li>
                <span>能源分析</span>
            </li>
            <li>
                <span>设备状态</span>
            </li>
            <li>
                <span>报警管理</span>
            </li>
            <li>
                <span>运维管理</span>
            </li>
            <li>
                <span>档案管理</span>
            </li>
            <li>
                <span>配置管理</span>
            </li>
        </ul>
        <navigation v-if="showNavigation" class="leave"></navigation>
    </div>
</template>

<script>
import navigation from './navigation'
export default {
    components:{
        navigation,
    },
    data() {
        return {
            showNavigation:false,
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
        },
        mouseLeave(){
            this.showNavigation = this.leaveShowNav;
        }
    },
    mounted(){
    }
};
</script>

<style lang="scss" scoped>

</style>
