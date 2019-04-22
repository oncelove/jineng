<template>
    <ul class="navigation" @mouseleave="leave">
        <li>
            <span>11111</span>
        </li>
        <li class="active">
            <span>22222</span>
        </li>
    </ul>
</template>

<script>
export default {
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
        }
    }

}
</script>

<style lang="scss" scoped>

</style>

