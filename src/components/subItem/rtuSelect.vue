<template>
    <div>
        <el-cascader
            placeholder="加油站/rtu"
            :options="rtuOptions"
            filterable clearable
            :change-on-select="changSelon"
            v-model="opArray"
            @change="handleChange"
        ></el-cascader>
    </div>
</template>
<script>
    import Axios from '../../util/fetch';
    import { mapGetters } from 'vuex'
    export default{
        props:{
            changSelon:{
                type:Boolean,
                required:true
            }
        },
        data(){
            return {
                rtuOptions:[],//联动下拉
                opArray:['',''],//默认选择
            }
        },
        computed: {
            ...mapGetters([
                'uid'
            ])
        },
        mounted(){
            this.rtuSelect();
        },
        methods:{
            //            获取加油站和rtu联动下拉列表
            rtuSelect(){
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
                                    this.rtuOptions.push(data1);
                                    //                            获取二级下拉
                                    if(gasList[i].rtuGasList!=""){
                                        const data2=gasList[i].rtuGasList
                                        const oilTankList=[];
                                        for (let x = 0; x < data2.length; x++) {
                                            const data3 = {
                                                value: data2[x].id,
                                                label: data2[x].rtuid,
                                            }
                                            oilTankList.push(data3);
                                        }
                                        this.rtuOptions[i].children=oilTankList;
                                    }
                                }
                            }
                        }
                    })
            },
            //            下拉选择改变时
            handleChange(value){
                this.$emit("handleChangeChild",value)
            }
        }
    }
</script>
