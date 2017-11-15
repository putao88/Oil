<template>
    <div class="fullWidth">
        <!--头部-->
        <el-menu theme="dark" class="el-menu-demo head" mode="horizontal">
            <el-menu-item index="1" @click="$router.push({ path: '/fullIndex' })">
                <i class="el-icon-oil-shuju"></i>大屏
            </el-menu-item>
            <el-menu-item index="3" @click="$router.push({ path: '/' })">
                <i class="el-icon-oil-shouye"></i>首页
            </el-menu-item>
        </el-menu>
        <!--底下内容-->
        <div style="padding:20px;">
            <el-row>
                <el-col :span="8">
                    <!--油罐图片-->
                    <div class="left1">
                        <div class="title">
                            <span class="titleSpan">
                                <span>{{tableData.unitname}}</span>
                                <span>{{tableData.name}}</span>
                            </span>
                        </div>
                        <img src="../../custom/img/tanks.png" class="gasTank">
                    </div>
                    <!--油罐数据-->
                    <div class="left2">
                        <div class="title">
                            <span class="titleSpan">实时测量数据</span>
                        </div>
                        <table cellspacing="0">
                            <tr>
                                <td rowspan="3">限制参数</td>
                                <td>水位上限</td>
                                <td>油位上限</td>
                                <td>油位下限</td>
                            </tr>
                            <tr>
                                <td>mm</td>
                                <td>mm</td>
                                <td>mm</td>
                            </tr>
                            <tr>
                                <td>{{tableData.wateruplim}}</td>
                                <td>{{tableData.oiluplim}}</td>
                                <td>{{tableData.oildownlim}}</td>
                            </tr>
                        </table>
                        <table cellspacing="0">
                            <tr>
                                <td rowspan="3">实时数据</td>
                                <td>水位</td>
                                <td>油位</td>
                                <td>平均温度</td>
                            </tr>
                            <tr>
                                <td>mm</td>
                                <td>mm</td>
                                <td>℃</td>
                            </tr>
                            <tr>
                                <td>{{tableData.waterlevel}}</td>
                                <td>{{tableData.oillevel}}</td>
                                <td>{{tableData.avgtemp}}</td>
                            </tr>
                        </table>
                    </div>
                </el-col>
                <!--折线图-->
                <el-col :span="16">
                    <div class="divRight">
                        <div class="title">
                            <span class="titleSpan">变化曲线图</span>
                        </div>
                        
                        <!--图表部分-->
                        <div class="components-container">
                            <div class='chart-container' id="timeCharts"></div>
                        </div>
                        <!--&lt;!&ndash;图表部分&ndash;&gt;-->
                        <!--<div class="components-container" style='height:90vh'>-->
                        <!--<div class='chart-container'>-->
                        <!--<time-chart height='100%' width='100%' :charts-data="chartsData" ref="mixChart"></time-chart>-->
                        <!--</div>-->
                        <!--</div>-->
                    
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import Axios from '../../util/fetch';
    //    import timeChart from '../subItem/timeChart.vue'
    import {mapGetters} from 'vuex'
    import echarts from 'echarts'
    
    export default({
        data(){
            return {
                listQuery: {//获取油罐数据需要传的参数
                    gasId: "",
                    curPage: 1,
                    pageSize: 20,
                    start: "",
                    end: "",
                    id: "",
                    uid: ""
                },
                tableData: "",
                timeout:"",
            }
        },
        computed: {
            ...mapGetters([
                'uid',
                'tanksId'
            ])
        },
        mounted(){
            this.Timer();
        },
        destroyed () {
            clearInterval(this.timeout)//在离开本页之后，清除定时器
        },
        methods: {
            //获得油罐数据
            getList(){
                if (this.tanksId) {
                    this.listQuery.id = this.tanksId;
                    this.listQuery.uid = this.uid;
                    Axios.get('selectOilTank.do', {
                        params: this.listQuery,
                    })
                        .then((res) => {
                            this.tableData = res.data.ots[0];
                            this.initChart(res)
                        })
                }
                else {
                    this.$router.push({path: '/fullIndex',})
                }
            },
//            初始化图表
            initChart(res) {
                this.chart = echarts.init(document.getElementById("timeCharts"))
                this.chart.setOption({
                    backgroundColor: '#344b58',
                    title: {
                        text: '油罐数据统计',
                        x: '4%',
                        top: 10,
                        textStyle: {
                            color: '#fff',
                            fontSize: '22'
                        },
                        subtextStyle: {
                            color: '#90979c',
                            fontSize: '16'
                        }
                    },
                    toolbox: {
                        feature: {
                            restore: {},
                            saveAsImage: {}
                        },
                        iconStyle:{
                            normal:{
                                borderColor :'rgb(255, 255, 255)'
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    grid: {//图表离调整容器边距
                        borderWidth: 0,
                        top: 90,
                        bottom: 30,
                        left: 50,
                        right: 20,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    legend: {
                        data: ['平均温度', '油位', '水位']
                    },
                    
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisLine: {
                                lineStyle: {
                                    color: '#90979c'
                                }
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            data: [res.data.ots[0].time]
                        }
                    ],
                    yAxis: [{
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#90979c'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0
                        },
                        splitArea: {
                            show: false
                        }
                    }],
                    series: [
                        {
                            name: '平均温度',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(219,50,51)',
                                    borderColor: 'rgba(219,50,51,0.2)',
                                    borderWidth: 12,
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: '#fff'
                                        },
                                        position: 'insideTop',
                                        formatter(p) {
                                            return p.value > 0 ? p.value : ''
                                        }
                                    }
                                }
                            },
                            data: [res.data.ots[0].avgtemp],
                        },
                        {
                            name: '油位',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(137,189,27)',
                                    borderColor: 'rgba(137,189,2,0.27)',
                                    borderWidth: 12,
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: '#fff'
                                        },
                                        position: 'insideTop',
                                        formatter(p) {
                                            return p.value > 0 ? p.value : ''
                                        }
                                    }
                                }
                            },
                            data:[res.data.ots[0].oillevel],
                        },
                        {
                            name: '水位',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(0,136,212)',
                                    borderColor: 'rgba(0,136,212,0.2)',
                                    borderWidth: 12,
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: '#fff'
                                        },
                                        position: 'insideTop',
                                        formatter(p) {
                                            return p.value > 0 ? p.value : ''
                                        }
                                    }
                                }
                            },
                            data: [res.data.ots[0].waterlevel],
                        }
                    ]
                });
            },
//            定时器函数
            Timer(){
                this.getList();
                this.timeout=setInterval(() => {
                    this.getList();
            },2000)
            }

        },
    })
</script>

<style scoped>
    .fullWidth {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    
    .left1 {
        border: 3px solid silver;
        border-radius: 4px;
        margin-right: 20px;
        height: 330px;
        text-align: center;
    }
    
    .left2 {
        border: 3px solid silver;
        border-radius: 4px;
        margin-top: 20px;
        margin-right: 20px;
        height: 330px;
    }
    
    .divRight {
        border: 3px solid silver;
        border-radius: 4px;
        height: 686px;
        background-color: #344b58;
    }
    
    .title {
        width: 100%;
        height: 60px;
        text-align: center;
        /*position:relative;*/
    }
    
    .titleSpan {
        margin-top: 15px;
        width: 200px;
        height: 26px;
        line-height: 26px;
        border: 2px solid silver;
        background-color: #000;
        color: #fff;
        font-size: 14px;
        display: inline-block;
        /*position:absolute;*/
        /*left:40px;*/
        /*top:-30px;*/
    }
    
    .gasTank {
        height: 280px;
        max-width: 100%;
    }
    
    table {
        width: 90%;
        margin: 10px 5%;
    }
    
    table tr td {
        border: 1px solid #0094ff;
        text-align: center;
    }
    
    table tr td {
        width: 25%;
        height: 36px;
        line-height: 36px;
    }
    
    .components-container {
        width: 100%;
        height: 650px;
    }
    
    .chart-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

</style>
