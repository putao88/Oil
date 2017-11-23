<template>
    <div>
        <el-cascader
            placeholder="选择加油站/油罐"
            :options="options"
            filterable clearable
            :change-on-select="changSelon"
            v-model="opArray"
            @change="handleChange"
        ></el-cascader>
    </div>
</template>
<script>
    import Axios from '../../util/fetch';
    import {mapGetters} from 'vuex'
    export default{
        props: {
            changSelon: {
                type: Boolean,
                required: true
            }
        },
        data(){
            return {
                options: [],//联动数据
                opArray: [],//默认选择
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
        methods: {
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
                            if (res.data.userBeans.gasList != "") {
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
                                    if (gasList[i].rtuGasList != "") {
                                        const rtuGasList = gasList[i].rtuGasList;
                                        const oilTankList = [];
                                        for (let x = 0; x < rtuGasList.length; x++) {
                                            if (rtuGasList[x].oilTankList) {
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
                                        this.options[i].children = oilTankList;
                                    }
                                }
                            }
//                            调用默认赋值
                            this.opArrayValue();
                        }
                        
                    })
            },
//            下拉选择改变时
            handleChange(value){
                this.$emit("handleChangeChild", value)
            },
            // 默认赋值函数
            opArrayValue(){
                for (let i = 0; i < this.options.length; i++) {
                    for (let j= 0; j < this.options[i].children.length;) {
                        this.opArray[0]=this.options[i].value;
                        this.opArray[1]=this.options[i].children[0].value;
                        this.$emit("initData", this.opArray);
                       return false;
                    }
                }
            },
        }
    }
</script>
