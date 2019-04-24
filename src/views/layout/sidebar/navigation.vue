<template>
    <ul class="navigation" @mouseleave="leave">
        <!-- <li>
            <span>11111</span>
        </li>
        <li class="active">
            <span>22222</span>
        </li> -->
        <li v-for="(item, index) in tonavList" :key="index" @click="toItemUrl(item)">
            <span>{{ item.name }}</span>
        </li>
    </ul>
</template>

<script>
export default {
    props:['tonavList'],
    data() {
        return {
            showNavigation:true,
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
        toItemUrl(item){
            if (item.url) {
                this.$router.push({path:item.url});
            }
        }
    }

}
</script>

<style lang="scss" scoped>

</style>

