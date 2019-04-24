<template>
    <div>
        <div
            id="myChart"
            :style="{width: '100%', height: '310px'}"
        ></div>
    </div>
</template>

<script>
export default {
    mounted() {
        this.drawLine();
    },
    methods: {
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(
                document.getElementById("myChart")
            );
            // 绘制图表
            myChart.setOption({
                tooltip: {},
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {
                    type:'value',
                    axisLabel:{
                        formatter:'{value} KW/H'
                    }
                },
                series: [
                    {
                        name: "销量",
                        type: "line",
                        data: [5, 20, 36, 10, 10, 20],
                        itemStyle : {  
                            normal : {  
                                color: '#35c99c',
                                lineStyle:{  
                                    color:'#35c99c'  
                                }  
                            }  
                        },
                        areaStyle:{
                            color:{
                                x: 0.5,
                                y: 0.5,
                                x2: 1,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(53,201,156,0.1)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(53,201,156,1)' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            }
                        }
                    }
                ]
            });
        }
    }
};
</script>


<style lang="scss" scoped>
</style>

