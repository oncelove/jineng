<template>
    <ul class="navigation" @mouseleave="leave">
        <router-link 
            tag="li" 
            v-for="(item, index) in tonavList" 
            :key="index"
            :to="{path:item.url}">
            <i class="iconfont" :class="item.icon"></i>
            <span>{{ item.name }}</span>
        </router-link>
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
                item.url = item.url.replace(/modules/,'');
                item.url = item.url.replace(/.html/,'');
                this.current=index;
                this.$router.push({path:item.url});
            }
            
        }
    },
    created(){
    }

}
</script>

<style lang="scss" scoped>
.iconfont{
    font-size: 20px;
}
.router-link-exact-active{

}
</style>

