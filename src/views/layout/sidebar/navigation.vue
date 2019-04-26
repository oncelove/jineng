<template>
    <ul class="navigation" @mouseleave="leave">
        <!-- <li>
            <span>11111</span>
        </li>
        <li class="active">
            <span>22222</span>
        </li> -->
        <li v-for="(item, index) in tonavList" :key="index" @click="toItemUrl(item, index)" v-bind:class="{'active':index == current}">
            <i class="iconfont" :class="item.icon"></i>
            <span>{{ item.name }}</span>
        </li>
    </ul>
</template>

<script>
export default {
    props:['tonavList'],
    data() {
        return {
            current: 0,
            showNavigation: true,
        };
    },
    computed:{
        leaveShowNav(){
            return this.$store.getters.leaveShowNav;
        },
    },
    methods:{
        leave(){
            this.showNavigation = this.leaveShowNav;
        },
        toItemUrl(item,index){

            if (item.url) {
                item.url = item.url.replace(/modules\/sys\//,'');
                item.url = item.url.replace(/.html/,'');
                this.current=index;
                this.$router.push({path:item.url});
            }
            
        }
    }

}
</script>

<style lang="scss" scoped>
.iconfont{
    font-size: 20px;
}
</style>

