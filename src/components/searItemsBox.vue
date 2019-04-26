<template>
    <div @mouseleave="onMouseout">
        <span class="item">电力监测</span>
        <span class="item">环境监测</span>
        <span class="item">电梯监测</span>
        <span class="item">水务监测</span>
        <span class="item">燃气监测</span>
    </div>
</template>

<script>
export default {
    methods: {
        onMouseout(){
            this.$emit('listenToChildEvent',false)
        }
    },
}
</script>


<style lang="scss" scoped>

</style>
