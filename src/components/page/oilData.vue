<template>
    <div>
        
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom:0;">
                <el-form :inline="true">
                    <el-form-item>
                        <station-select @handleChangeChild="stationChange"></station-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        
        <!--表格-->
        
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." style="width: 100%">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="name" label="油罐名称" align="center"  min-width="120"></el-table-column>
            <el-table-column prop="unitname" label="所属加油站" align="center" min-width="120"></el-table-column>
            <el-table-column prop="avgtemp" label="平均温度(℃)" align="center" sortable min-width="140"></el-table-column>
            <el-table-column prop="waterlevel" label="水位(mm)" align="center" sortable min-width="150"></el-table-column>
            <el-table-column prop="wateruplim" label="水位上限(mm)" align="center" sortable min-width="150"></el-table-column>
            <el-table-column prop="oiluplim" label="油位上限(mm)" align="center" sortable min-width="150"></el-table-column>
            <el-table-column prop="oillevel" label="油位(mm)" align="center" sortable min-width="150"></el-table-column>
            <el-table-column prop="oildownlim" label="油位下限(mm)" align="center" sortable  min-width="150"></el-table-column>
        </el-table>
        
        <!--分页工具条-->
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination
                @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="listQuery.curPage" :page-sizes="[10, 15, 20, 30, 100]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" style="float:right">
            </el-pagination>
        </el-col>
    </div>
</template>
<script>
    import Axios from '../../util/fetch';
    import stationSelect from '../subItem/stationSelect.vue'
    import { mapGetters } from 'vuex'
    export default{
        components: {stationSelect},//导入联动下拉子组件
        data(){
            return {
                allTime: "",
                listQuery: {//获取表格数据需要传的参数
                    gasId: "",
                    curPage: 1,
                    pageSize: 20,
                    start: "",
                    end: "",
                    uid:""
                },
                tableData:null,//表格数据
                listLoading: false,//表格加载过程的等待
                total: null,//总的数据条数
            }
        },
        computed: {
            ...mapGetters([
                'uid'
            ])
        },
        mounted(){
            this.Timer();
        },
        destroyed () {
            clearInterval(this.timeout)//在离开本页之后，清除定时器
        },
        methods: {
            //获得表格数据
            getList(){
                this.listQuery.uid=this.uid;
                this.listLoading = true;
                Axios.get('selectOilTank.do', {
                    params: this.listQuery,
                })
                    .then((res) => {
                        if (res.code == 0) {
                            this.tableData = res.data.ots;
                            this.total = res.data.num;
                        }
                        this.listLoading = false;
                    })
                    .catch((err) => {
                        this.listLoading = false;
                    })
            },
            //            定时器函数
            Timer(){
                this.getList();
                this.timeout=setInterval(() => {
                    this.getList();
                },2000)
            },
            //            改变每页条数
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
//            改变当前页
            handleCurrentChange(val) {
                this.listQuery.curPage = val;
                this.getList();
            },
            //            加油站改变时搜索
            stationChange(value){
                this.listQuery.gasId=value;
                this.handleFilter();
            },
            //            搜索筛选函数
            handleFilter() {
                this.listQuery.curPage = 1;
                this.getList();
            }
        }
    }
</script>
