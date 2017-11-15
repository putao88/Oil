<template>
    <div>
        <el-select v-model="selectValue" @change="handleChange" filterable clearable placeholder="加油站名称">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    import Axios from '../../util/fetch';
    import { mapGetters } from 'vuex'
    export default{
       data(){
           return {
               selectValue:'',
               options: [],//加油站选择下拉
               getStation: {//获得加油站
                   gname: "",
                   curPage: 0,
                   pageSize: 0,
                   start: "",
                   end: "",
                   uid: ""
               }
           }
       },
        computed: {
            ...mapGetters([
                'uid'
            ])
        },
        mounted(){
            this.getSelect();
        },
        methods:{
            //            获取加油站下拉列表
            getSelect(){
                this.getStation.uid=this.uid;
                Axios.get('selectAllGas.do', {
                    params: this.getStation
                })
                    .then((res) => {
                        for (let i = 0; i < res.data.gass.length; i++) {
                            const data={
                                value:res.data.gass[i].id,
                                label:res.data.gass[i].unitname
                            }
                            this.options.push(data);
                        }
                    })
            },
            handleChange(value){
                this.$emit("handleChangeChild",value)
            }
            
        }
    }
</script>
