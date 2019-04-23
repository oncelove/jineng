<template>
    <div class="wrap wrap-close">
        <div class="leftNav nav-close">
            <div class="logo">
                <a href="/">
                    <img src="./../../assets/logo.png" alt="" class="logo-open">
                    <img src="./../../assets/logo-close.png" alt="" class="logo-close">
                </a>
            </div>
            <sidebar></sidebar>
        </div>
        <div class="main">
            <topheader></topheader>
            <!-- <div class="content"> -->
            <mainContent class="content"></mainContent>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import sidebar from './sidebar/sidebar'
import topheader from './header/header'
import mainContent from './content/main'
export default {
    components: { sidebar, topheader, mainContent },
}
</script>

<style lang="scss">

</style>

