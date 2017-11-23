<template>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            id: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '200px'
            },
            height: {
                type: String,
                default: '200px'
            }
        },
        data() {
            return {
                chart: null,
                chartsData: []//图表数据
            }
        },
        mounted() {
            this.initChart(this.chartsData)
            this.chart = null
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            this.chart.dispose()
            this.chart = null
        },
        methods: {
            initChart(chartsData) {
                this.chart = echarts.init(document.getElementById(this.id))
//        获取横轴数据
                const xData = [];
                const waterlevel = [];
                const oillevel = [];
                const temperature = [];
                for (let i = 0; i < chartsData.length; i++) {
                    xData.push(chartsData[i].time);
                    waterlevel.push(chartsData[i].waterlevel);
                    oillevel.push(chartsData[i].oillevel);
                    temperature.push(chartsData[i].temperature);
                }
                var dates = xData.map(function (item) {
                    return item[0];
                });
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
                        top: 70,
                        bottom: 140,
                        left: 50,
                        right: 20,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    legend: {
                        x: 'center',
                        top: '10',
                        textStyle: {
                            color: '#90979c'
                        },
                        data: ['平均温度', '油位', '水位']
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                color: '#90979c'
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        },
//                        axisLabel: {
//                            interval: 0,
//                            rotate: 30,//横坐标文字旋转角度
//                            textStyle: {
//                                fontSize: '8'
//                            }
//                        },
                        data: xData.map(function (str) {
                            return str.replace(' ', '\n')
                        })   //让横坐标换行显示
                    }],
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
                    dataZoom: [{
                        show: true,
                        height: 30,
                        xAxisIndex: [
                            0
                        ],
                        bottom: 10,
                        start: 10,
                        end: 80,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '110%',
                        handleStyle: {
                            color: '#d3dee5'
                            
                        },
                        textStyle: {
                            color: '#fff'
                        },
                        borderColor: '#90979c'
                        
                    }, {
                        type: 'inside',
                        show: true,
                        height: 15,
                        start: 1,
                        end: 35
                    }],
                    series: [{
                        name: '平均温度',
                        type: 'line',
//                        stack: '总量',
                        barMaxWidth: 35,
                        barGap: '10%',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(219, 50, 51, 0.3)'
                                }, {
                                    offset: 0.8,
                                    color: 'rgba(219, 50, 51, 0)'
                                }], false),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10
                            }
                        },
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
                        data: temperature
                    },
                        {
                            name: '油位',
                            type: 'line',
//                            stack: '总量',
                            barMaxWidth: 35,
                            barGap: '10%',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 5,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(137, 189, 27, 0.3)'
                                    }, {
                                        offset: 0.8,
                                        color: 'rgba(137, 189, 27, 0)'
                                    }], false),
                                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                                    shadowBlur: 10
                                }
                            },
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
                            data: oillevel
                        },
                        {
                            name: '水位',
                            type: 'line',
//                            stack: '总量',
                            barMaxWidth: 35,
                            barGap: '10%',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 5,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(0, 136, 212, 0.3)'
                                    }, {
                                        offset: 0.8,
                                        color: 'rgba(0, 136, 212, 0)'
                                    }], false),
                                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                                    shadowBlur: 10
                                }
                            },
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
                            data: waterlevel
                        }
                    ]
                })
            }
        }
    }
</script>
