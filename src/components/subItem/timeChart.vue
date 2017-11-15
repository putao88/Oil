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
            initChart(res) {
                this.chart = echarts.init(document.getElementById(this.id))
                function randomData() {
                    now = new Date(+now + oneDay);
                    value = value + Math.random() * 21 - 10;
                    return {
                        name: now.toString(),
                        value: [
                            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                            Math.round(value)
                        ]
                    }
                }
    
                var data = [];
                var now = +new Date(1997, 9, 3);
                var oneDay = 24 * 3600 * 1000;
                var value = Math.random() * 1000;
                for (var i = 0; i < 1000; i++) {
                    data.push(randomData());
                }

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
                    series: [{
                        name: '平均温度',
                        type: 'bar',
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
                        data: res.data.ots[0].avgtemp
                    },
                        {
                            name: '油位',
                            type: 'bar',
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
                            data: res.data.ots[0].oillevel
                        },
                        {
                            name: '水位',
                            type: 'bar',
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
                            data: res.data.ots[0].waterlevel
                        }
                    ]
                });
    
//                setInterval(() =>{
//
//                    for (var i = 0; i < 5; i++) {
//                        data.shift();
//                        data.push(randomData());
//                    }
//
//                    this.chart.setOption({
//                        series: [{
//                            data: data
//                        }]
//                    });
//                }, 1000);
            }
        }
    }
</script>

<style></style>
