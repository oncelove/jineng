<template>
    <div class="wrap">
        <header class="topNav">
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
        </div>
        
    </div>
</template>

<script>
import sidebar from './sidebar'
export default {
    components: { sidebar },
}
</script>

<style lang="scss">

</style>

