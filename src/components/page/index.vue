<template>
    <div class="homebg">
        <img src="../../custom/img/bg_picture.png">
        <div class="warnAlert" v-show="showAlert">
            <i class="el-icon-warning"></i>
            <h3>警告</h3>
            <span @click="runTo">油罐报警,请查看</span>
            <i class="el-icon-close" @click="close"></i>
        </div>
    </div>
</template>

<script>
    import Axios from '../../util/fetch';
    import { mapGetters } from 'vuex'
    export default {
        data: function () {
            return {
                showAlert:false,
                listQuery: {//获取表格数据需要传的参数
                    check: 0,
                    curPage: 0,
                    pageSize: 0,
                    start: "",
                    end: "",
                    uid:""
                }
            }
        },
        mounted(){
            this.getList();
        },
        computed: {
            ...mapGetters([
                'uid'
            ])
        },
        methods: {
            //获得未处理报警数据
            getList(){
                this.listQuery.uid=this.uid;
                Axios.get('selectAlarmer.do', {
                    params: this.listQuery,
                })
                    .then((res) => {
                        if (res.code == 0) {
                          if(res.data.alarmers.length>0){
                              this.showAlert=true;
                          }
                        }
                    })
            },
            close(){
                this.showAlert=false;
            },
            runTo(){
                this.$router.push("./fullIndex");
            }
        },
    }
</script>

<style scoped>
    .homebg {
        height: 100%;
        width: 100%;
        position:relative;
    }
    
    .homebg img {
        width: 100%;
        height: 100%;
    }
    .warnAlert{
        width:300px;
        height:80px;
        position:absolute;
        right:-5px;
        top:-5px;
        border-radius:3px;
        -moz-border-radius:3px;
        -webkit-border-radius:3px;
        box-shadow:0 0 3px 3px rgba(6,6,6,0.2);
        -webkit-box-shadow:0 0 3px 3px rgba(6,6,6,0.2);
        -moz-box-shadow:0 0 3px 3px rgba(6,6,6,0.2);
        background-color:#fff;
    }
    .warnAlert i.el-icon-warning{
        font-size:26px;
        color:#EB9E05;
        position:absolute;
        left:10px;
        top:10px;
    }
    .warnAlert i.el-icon-close{
       padding:3px;
        font-size:14px;
        position:absolute;
        right:10px;
        top:10px;
        color:#8F949F;
        cursor:pointer;
    }
    .warnAlert h3{
        color:#333;
        font-size:18px;
        margin:10px 0 10px 50px;
    }
    .warnAlert span{
        margin-left:40px;
        font-size:14px;
        color:#5A5E66;
        cursor:pointer;
    }
    .warnAlert span:hover{
        text-decoration: underline;
    }
</style>
