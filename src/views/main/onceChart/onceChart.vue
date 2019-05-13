<template>
    <div>
        <el-row :gutter="20" class="position">
            <el-col :span="4">
                <ul>
                    <li>一次接线图</li>
                    <li>一次接线图</li>
                    <li>一次接线图</li>
                    <li>一次接线图</li>
                </ul>
            </el-col>
            <el-col :span="20" ref="iframeBox" id="iframeBox" class="position2">
                <iframe id="show-iframe" 
                    name="google_ads_frame2"
                    frameborder="0" 
                    src="http://127.0.0.1:5500/HtmlPage2.html" 
                    marginwidth="0" 
                    marginheight="0" 
                    vspace="0" 
                    hspace="0" 
                    allowtransparency="true" 
                    scrolling="no" 
                    allowfullscreen="true">
                </iframe>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    mounted(){
        this.$nextTick(() => { //使用nextTick为了保证dom元素都已经渲染完毕 
            const oIframe = document.getElementById('show-iframe');
            var box = document.getElementById("iframeBox");
            oIframe.style.width = box.offsetWidth - 20 + 'px';
            oIframe.style.height = box.offsetHeight + 'px';
        });
    }
}
</script>

<style lang="scss" scoped>
.position{
    position: absolute;
    left: 30px;
    right: 30px;
    top: 30px;
    bottom: 30px;
}
.position2{
    position: absolute;
    left: 16.6%;
    right: 30px;
    top: 0;
    bottom: 0;
}
li{
    margin-bottom: 20px;
}

</style>

