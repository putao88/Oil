<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom:0;">
                <el-form :inline="true">
                    <!--油罐选择-->
                    <el-form-item>
                        <mix-select @handleChangeChild="handleChange" :chang-selon="changSelon"></mix-select>
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
                    <!--导出-->
                    <el-form-item  style="float:right;">
                    <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
                    </el-form-item>
                
                </el-form>
            </el-col>
        </el-row>
        
        <!--表格-->
        
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." @selection-change="selsChange" height="560" style="width: 100%">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="unitname" label="加油站名称" align="center" width="120"></el-table-column>
            <el-table-column prop="name" label="油罐名称" align="center" width="100"></el-table-column>
            <el-table-column prop="avgtemp" label="平均温度(℃)" align="center" sortable width="140"></el-table-column>
            <el-table-column prop="waterlevel" label="水位(L)" align="center" sortable width="120"></el-table-column>
            <el-table-column prop="wateruplim" label="水位上限(L)" align="center" sortable width="140"></el-table-column>
            <el-table-column prop="oillevel" label="油位(mm)" align="center" sortable width="140"></el-table-column>
            <el-table-column prop="oiluplim" label="油位上限(L)" align="center" sortable width="140"></el-table-column>
            <el-table-column prop="oildownlim" label="油位下限(L)" align="center" sortable width="140"></el-table-column>
            <el-table-column prop="time" label="时间" align="center" sortable width="180"></el-table-column>
            <el-table-column label="操作" align="center" width="100">
                <template scope="scope">
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <!--分页工具条-->
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
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
    import mixSelect from '../subItem/select.vue'
    import Axios from '../../util/fetch';
    import { mapGetters } from 'vuex'
    export default{
        components: {mixSelect},//导入联动下拉子组件
        data(){
            return {
                changSelon:true,//判断下拉子组件的选择是否可以任选层级
                allTime: "",//时间段
                listQuery: {//获取历史数据需要传的参数
                    curPage: 1,
                    pageSize: 15,
                    gasId: "",//加油站id
                    tid: "",//油罐id
                    start: "",
                    end: "",
                    uid:""
                },
                listLoading: false,//表格加载过程的等待
                total: null,//总的数据条数
                sels: [],//列表选中行
                tableData: [],//表格数据
                allData:[],//所有数据
                listQuery1: {//获取历史数据需要传的参数
                    curPage: 0,
                    pageSize: 0,
                    gasId: "",//加油站id
                    tid: "",//油罐id
                    start: "",
                    end: "",
                    uid:""
                },
            }
        },
        computed: {
            ...mapGetters([
                'uid'
            ])
        },
        mounted(){
            this.getList();
        },
        methods: {
//            下拉菜单改变时
            handleChange(value){
                this.listQuery.gasId=value[0];
                this.listQuery.tid=value[1];
                this.handleFilter();
            },
//            获取表格数据
            getList(){
                this.listQuery.uid=this.uid;
                this.listLoading = true;
                Axios.get('selectHistories.do', {
                    params: this.listQuery,
                })
                    .then((res) => {
                        if (res.code == 0) {
                            this.tableData = res.data.histories;
                            this.total = res.data.num;
                            this.listLoading = false;
                        } else {
                            this.listLoading = false;
                        }
                    })
                    .catch((err) => {
                        this.listLoading = false;
                    })
            },
//            获取无分页的表格数据
            getAllList(){
                this.listQuery1.uid=this.uid;
                Axios.get('selectHistories.do', {
                    params: this.listQuery1,
                })
                    .then((res) => {
                        if (res.code == 0) {
                            this.allData = res.data.histories;
                        }
                    })
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
            //            搜索筛选函数
            handleFilter() {
                this.listQuery.curPage = 1;
                this.getList();
            },
//            时间段选择改变
            timeChange(){
                this.listQuery.start = this.allTime[0];
                this.listQuery.end = this.allTime[1];
                this.handleFilter();
            },
            //            选中行
            selsChange: function (sels) {
                this.sels = sels;
            },
            // 删除某一行数据
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.listLoading = true;
                        let para = {ids: row.id};
//                        删除数据提交
                        Axios.get('deleteHistory.do', {
                            params: para
                        })
                            .then((res) => {
                                this.listLoading = false;
                                //NProgress.done();
                                if (res.code == 0) {
                                    this.$message({
                                        message: res.message,
                                        type: 'success'
                                    });
                                    this.getList();
                                }
                            })
                            .catch((err) => {
                                this.listLoading = false;
                            })
                    })
            },
            //            批量删除
            batchRemove: function () {
                const ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.listLoading = true;
                        const para = {ids: ids};
                        Axios.get('deleteHistory.do', {
                            params: para
                        })
                            .then((res) => {
                                this.listLoading = false;
                                if (res.code == 0) {
                                    this.$message({
                                        message: res.message,
                                        type: 'success'
                                    });
                                    this.getList();
                                }
                            })
                            .catch((err) => {
                                this.listLoading = false;
                            })
                    })
            },
//            导出数据
            handleDownload(){
                this.getAllList();
                require.ensure([], () => {
                    const { export_json_to_excel } = require('vendor/Export2Excel')
                    const tHeader = ['加油站名称', '油罐名称', '平均温度(℃)', '水位(L)', '水位上限(L)','油位(L)','油位上限(L)','油位下限(L)','时间']
                    const filterVal = ['unitname', 'name', 'avgtemp', 'waterlevel', 'wateruplim','oillevel','oiluplim','oildownlim','time']
                    const data = this.formatJson(filterVal, this.allData)
                    export_json_to_excel(tHeader, data, '油罐数据')
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            }
        }
    }
</script>
