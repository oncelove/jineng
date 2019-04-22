<template>
    <div class="wrap">
        <div class="leftNav">
            <div class="logo">
                <a href="#">
                    <img src="./../../assets/logo.png" alt="">
                </a>
            </div>
            <sidebar></sidebar>
        </div>
        <div class="main">
            <topheader></topheader>
            <div class="content">
                content
            </div>
        </div>
        <!-- <header class="topNav">
            topNav
        </header>
        <div class="main">
            <div class="leftNav">
                leftNav
                <sidebar></sidebar>
            </div>
            <div class="content">
                content
            </div>
        </div> -->
        
    </div>
</template>

<script>
import sidebar from './sidebar/sidebar'
import topheader from './header/header'
export default {
    components: { sidebar, topheader },
}
</script>

<style lang="scss">

</style>

