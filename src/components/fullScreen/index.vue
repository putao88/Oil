<template>
    <div class="fullWidth">
        <div class="fullbg">
            <Com-Back-Index></Com-Back-Index>
            <div v-for="item in options">
                <h2 class="title">{{item.label}}</h2>
                <ul>
                    <li v-for="(child,index) in item.children" :key="child.value" @click="TankDetail(child.value)">
                        <img src="../../custom/img/tank.png" class="gasTank">
                        <div>{{child.label}}</div>
                        <!--<router-link to="{ name: 'tankDetail', query: {tanksId: child.value }}">-->
                            <!--<img src="../../custom/img/tank.png" class="gasTank">-->
                            <!--<div>{{child.label}}</div>-->
                        <!--</router-link>-->
                    </li>
                </ul>
            </div>
            <h3 class="warnTitle">油罐报警信息</h3>
            <div class="WarnMes" @mouseover="Stop" @mouseout="Timer">
                <div class="mesBg">
                    <div v-for="item in tableData">{{item}}</div>
                </div>
            </div>
        </div>
        <div v-show="options.length===0" class="noData">
            <img src="../../custom/img/noData.png">
            <span> 没有任何数据</span>
        </div>
    </div>
</template>

<script>
    import Axios from '../../util/fetch';
    import { mapGetters } from 'vuex'
    import ComBackIndex from '../subItem/ComBackIndex.vue'
    export default{
        components:{ComBackIndex},
        data(){
            return {
                options: [],//联动数据
                listQuery: {//获取表格数据需要传的参数
                    gasId: "",
                    curPage: 0,
                    pageSize: 0,
                    start: "",
                    end: "",
                    uid:""
                },
                tableData:[],//表格数据
                timeout:'',//定时器
                mesBgTop:'',//div的top值
                mesBgHeight:''//div的高
            }
        },
        mounted(){
            this.getSelect();
            this.getList();
        },
        computed: {
            ...mapGetters([
                'uid'
            ])
        },
        destroyed () {
            clearInterval(this.timeout)//在离开本页之后，清除定时器
        },
        methods:{
            //获得报警数据
            getList(){
                this.listQuery.uid=this.uid;
                Axios.get('selectAlarmer.do', {
                    params: this.listQuery,
                })
                    .then((res) => {
                    const sign=0;
                        if (res.code == 0) {
                            for(let i = 0; i < res.data.alarmers.length; i++){
                                const arContent=res.data.alarmers[i].unitname+"   "+res.data.alarmers[i].comment+"   "+res.data.alarmers[i].time;
                                this.tableData.push(arContent);
                               if(i==res.data.alarmers.length-1){
                                   this.Timer();
                               }
                            }
                        }
                    })
            },
//            报警数据滚动显示
            Timer(){
                this.timeout=setInterval(() => {
                    this.DataScrol();
                },50)
            },
//            数据滚动
            DataScrol(){
                const WarnMes=document.getElementsByClassName("WarnMes")[0];
                const mesBg=document.getElementsByClassName("mesBg")[0];
               if(WarnMes.scrollTop==mesBg.offsetHeight-383||(WarnMes.scrollTop>mesBg.offsetHeight-383)){
                   WarnMes.scrollTop=0;
               }else{
                   WarnMes.scrollTop++;
               }
            },
//            停止滚动
            Stop(){
                clearInterval(this.timeout);
            },
            //            获取下拉列表
            getSelect(){
                Axios.get('selectUserHas.do', {
                    params: {
                        uid: this.uid
                    },
                })
                    .then((res) => {
                        if (res.code == 0) {
                            //判断是否含有某个字段
                            if(res.data.userBeans.gasList!=""){
                                const gasList = res.data.userBeans.gasList;
                                //                        获取一级下拉
                                for (let i = 0; i < gasList.length; i++) {
                                    const data1 = {
                                        value: gasList[i].id,
                                        label: gasList[i].unitname,
                                        children: []
                                    }
                                    this.options.push(data1);
                                    //                            获取二级下拉
                                    if(gasList[i].rtuGasList!=""){
                                        const rtuGasList = gasList[i].rtuGasList;
                                        const oilTankList = [];
                                        for (let x = 0; x < rtuGasList.length; x++) {
                                            if(rtuGasList[x].oilTankList){
                                                const data2 = rtuGasList[x].oilTankList;
                                                for (let y = 0; y < data2.length; y++) {
                                                    const data3 = {
                                                        value: data2[y].id,
                                                        label: data2[y].name,
                                                    }
                                                    oilTankList.push(data3)
                                                }
                                            }
                                        }
                                        this.options[i].children=oilTankList;
                                    }
                                }
                            }
                        }
                    })
            },
//            进入油罐详情页
            TankDetail(value){
                this.$store.dispatch('TankId',value)
                    .then(() => {
                        this.$router.push({path: '/tankDetail'})
                    });
            }
        }
    }
</script>

<style scoped>
    .fullWidth{
        width:100%;
        height:100%;
        background-color:#fff;
        overflow: auto;
    }
    .fullbg{
        padding:30px 350px 30px 30px;
        overflow:auto;
    }
    .title{
        color:#66a1f2;
        height:50px;
        line-height:50px;
        margin:30px 0;
        border-bottom:2px solid #66a1f2;
        font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
    }
    .gasTank{
        width:200px;
        height:200px;
    }
    ul li{
        display:inline-block;
        list-style: none;
        cursor:pointer;
    }
    ul li:hover{
        transform: scale(1.1);
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        background-color:rgba(244,244,244,0.5);
    }
    ul li div{
        width:200px;
        height:20px;
        line-height:20px;
        text-align:center;
        /*color:#878BF7;*/
        color:#66a1f2;
    }
    /*无数据*/
    .noData{
        width:500px;
        height:400px;
        position:absolute;
        left:0;
        top:0;
        right:0;
        bottom:0;
        margin:auto;
    }
    .noData img{
        width:100%;
        height:100%;
    }
    .noData span{
        display:inline-block;
        width:100%;
        height:20px;
        line-height:20px;
        text-align:center;
        margin-top:20px;
        font-size:16px;
        font-weight:bolder;
    }
    .warnTitle{
        position:fixed;
        right:160px;
        top:80px;
    }
    .WarnMes{
        width:380px;
        height:400px;
        /*border:1px solid #878BF7;*/
        position:fixed;
        right:20px;
        top:120px;
        box-shadow:0 0 3px 3px rgba(6,6,6,0.2);
        -webkit-box-shadow:0 0 3px 3px rgba(6,6,6,0.2);
        -moz-box-shadow:0 0 3px 3px rgba(6,6,6,0.2);
        z-index:100;
        background-color:#000;
        overflow: scroll;
        cursor:pointer;
    }
    .mesBg{
        padding:10px;
        position:absolute;
        left:0;
        top:0;
    }
    .mesBg div{
        font-size:16px;
        color:#fff;
        margin-top:10px;
        word-break:break-all;
    }
</style>
