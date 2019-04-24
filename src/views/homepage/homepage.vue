<template>
    <div class="homepage">
        <p class="home-title box-styles">
            <span>安全运行天数：</span>
            <b>8888</b>
            <i>(天)</i>
        </p>
        <div class="routine-box clearfix">
            <div class="left-box lf">
                <div class="r-box box-styles">
                    <h4>常规数据</h4>
                    <ul>
                        <li>
                            <p><span>228</span><i>(台)</i></p>
                            <p>总接入量</p>
                        </li>
                        <li>
                            <p><span>228</span><i>(台)</i></p>
                            <p>总接入量</p>
                        </li>
                        <li>
                            <p><span>228</span><i>(台)</i></p>
                            <p>总接入量</p>
                        </li>
                        <li>
                            <p><span>228</span><i>(台)</i></p>
                            <p>总接入量</p>
                        </li>
                        <li>
                            <p><span>228</span><i>(台)</i></p>
                            <p>总接入量</p>
                        </li>
                        <li>
                            <p><span>228</span><i>(台)</i></p>
                            <p>总接入量</p>
                        </li>
                        <li>
                            <p><span>228</span><i>(台)</i></p>
                            <p>总接入量</p>
                        </li>
                        <li>
                            <p><span class="errorColor">228</span><i>(台)</i></p>
                            <p>总接入量</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="right-box rt">
                <div class="r-box box-styles">
                    <div class="lf-box">
                        <h4>日总负荷</h4>
                        <div class="delites">
                            <h5><span>32146</span><i>(kw)</i></h5>
                            <p>
                                <span>与昨日相比较：</span>
                                <em>
                                    <i class="iconfont"></i>
                                    <b>超出</b>
                                    <i class="iconfont"></i>
                                    <b>降低</b>
                                </em>
                            </p>
                        </div>
                    </div>
                    <div class="rt-box">
                        <h4>日总负荷</h4>
                        <div class="delites">
                            <h5><span>32146</span><i>(kw)</i></h5>
                            <p>
                                <span>与昨日相比较：</span>
                                <em>
                                    <i class="iconfont"></i>
                                    <b>超出</b>
                                    <i class="iconfont"></i>
                                    <b>降低</b>
                                </em>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="datashow-box clearfix">
            <div class="left-box lf box-styles">
                <h4>数据概览</h4>
                <div class="change-line">
                    <i class="iconfont iconkalendar"></i>
                    <span>本日</span>
                    <span class="active">本月</span>
                    <span>本年</span>
                </div>
                <lineshow></lineshow>
            </div>
            <div class="right-box rt ">
                <div class="right-top-box box-styles">
                    <h4>快捷入口</h4>
                    <ul>
                        <li>
                            <i class="iconfont icondaiding"></i>
                            <em>待定</em>
                        </li>
                        <li>
                            <i class="iconfont icondaiding"></i>
                            <em>待定</em>
                        </li>
                        <li>
                            <i class="iconfont icondaiding"></i>
                            <em>待定</em>
                        </li>
                        <li>
                            <i class="iconfont icondaiding"></i>
                            <em>待定</em>
                        </li>
                        <li>
                            <i class="iconfont icondaiding"></i>
                            <em>待定</em>
                        </li>
                        <li>
                            <i class="iconfont icondaiding"></i>
                            <em>待定</em>
                        </li>
                    </ul>
                </div>
                <div class="right-bottom-box box-styles">
                    <h4>实时监控</h4>
                    <p><b>78</b><i>%</i><em>设备在线率</em></p>
                    <div class="progress-box">
                        <el-progress :percentage="80" color="#ec494c" :show-text="false"></el-progress>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-box clearfix">
            <div class='left-box lf box-styles'>
                <h4>月警报怕行榜</h4>
                <ranktable></ranktable>
            </div>
            <div class="right-box rt box-styles">
                <h4>效果报告</h4>
                
            </div>
        </div>
    </div>
</template>

<script>
import ranktable from './ranktable'
import lineshow from './lineshow'
export default {
    components:{
        ranktable,lineshow
    }
}
</script>


<style lang="scss" scoped>

</style>

