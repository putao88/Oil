<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom:0;">
                <el-form :inline="true">
                    <!--油罐选择-->
                    <el-form-item>
                        <mix-select @handleChangeChild="handleChange" :chang-selon="changSelon" @initData="initCharts"></mix-select>
                    </el-form-item>
                    <!--时间选择-->
                    <el-form-item>
                        <el-date-picker
                            v-model="allTime"
                            type="datetimerange"
                            range-separator=" 至 "
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="---请选择时间段---"
                            @change="timeChange">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        
        <!--图表部分-->
        <div class="components-container" style='height:90vh'>
            <div class='chart-container'>
                <mix-chart height='100%' width='100%' :charts-data="chartsData" ref="mixChart"></mix-chart>
            </div>
        </div>
    </div>
</template>
<script>
    import Axios from '../../util/fetch';
    import mixChart from '../subItem/mixChart.vue'
    import mixSelect from '../subItem/select.vue'
    import { mapGetters } from 'vuex'
    export default({
        components: {
            mixChart,mixSelect
        },
        data(){
            return {
                changSelon:false,//判断下拉子组件的选择是否可以任选层级
                allTime: "",//时间段
                listQuery: {//获取图表数据需要传的参数
                    curPage: 0,
                    pageSize: 0,
                    gasId:"",//加油站id
                    tid: "",//油罐id
                    start: "",
                    end: "",
                    uid:"",
                },
                chartsData:[],//要传到子组件的图表数据
            }
        },
        computed: {
            ...mapGetters([
                'uid',
                'collapsed'
            ])
        },
        mounted(){
        },
        methods: {
//        初始化选择油罐
            initCharts(value){
                this.listQuery.gasId=value[0];
                this.listQuery.tid=value[1];
                this.getList()
            
            },
//            油罐选择变化时
            handleChange(value){
                if(value!=""){
                    this.listQuery.gasId=value[0];
                    this.listQuery.tid=value[1];
                    this.getList();
                }
            },
//            时间段选择
            timeChange(){
                this.listQuery.start = this.allTime[0];
                this.listQuery.end = this.allTime[1];
                if (this.listQuery.tid == "") {
                    this.$message({
                        message: '请选择油罐号',
                        type: 'warning'
                    });
                } else {
                    this.getList();
                }
            },
            //  获取油罐数据
            getList(){
                this.listQuery.uid=this.uid;
                Axios.get('selectHistories.do', {
                    params: this.listQuery
                })
                    .then((res) => {
                        const histories = res.data.histories;
                        this.chartsData = [];
                        for (let i = 0; i < histories.length; i++) {
                            const data = {
                                time:histories[i].time ,
                                waterlevel:histories[i].waterlevel ,
                                oillevel:histories[i].oillevel ,
                                temperature: histories[i].avgtemp
                            }
                            this.chartsData.push(data);
                        }
//                        调用子组件的初始化图表
                        this.$refs.mixChart.initChart(this.chartsData);
                    })
            },
        }
    })
</script>

<style scoped>
    .chart-container {
        position: relative;
        width: 100%;
        height: 90%;
        /*padding-bottom: 70px;*/
    }
    
    .components-container {
        margin-bottom: 30px;
    }
    
    /*.toolbar{*/
    /*background-color:rgb(52, 75, 88);*/
    /*}*/
</style>
