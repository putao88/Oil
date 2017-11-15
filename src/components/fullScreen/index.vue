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
        </div>
        <div v-show="options.length===0">
            没有任何数据
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
            }
        },
        mounted(){
            this.getSelect();
        },
        computed: {
            ...mapGetters([
                'uid'
            ])
        },
        methods:{
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
        overflow: auto;
    }
    .fullbg{
        padding:30px;
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
        color:#878BF7;
    }
</style>
