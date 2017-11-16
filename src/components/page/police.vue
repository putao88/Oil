<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom:0;">
                <el-form :inline="true">
                    <el-form-item>
                        <station-select @handleChangeChild="stationChange"></station-select>
                    </el-form-item>
                    
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
        <!--表格-->
        
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." @selection-change="selsChange" height="560" style="width: 100%">
            <el-table-column type="selection" align="center" fixed width="55"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="unitname" label="所属加油站" align="center" width="120"></el-table-column>
            <el-table-column prop="comment" label="报警描述" align="center" width="160"></el-table-column>
            <el-table-column prop="event" label="报警事件" align="center" width="120"></el-table-column>
            <el-table-column prop="type" label="报警类型" align="center" width="160"></el-table-column>
            <el-table-column prop="current" label="当前值(mm)" align="center" sortable width="160"></el-table-column>
            <el-table-column prop="limit" label="界限值(mm)" align="center" sortable width="160"></el-table-column>
            <el-table-column prop="time" label="报警时间" align="center" sortable width="170"></el-table-column>
            <el-table-column prop="check" label="是否处理" width="140" align="center">
                <template scope="scope">
                    <el-switch v-model="scope.row.check" on-text="no" off-text="yes"
                               @change="dealChange(scope.$index, scope.row)"
                               on-value="0" off-value="1">
                    </el-switch>
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
                    pageSize: 10,
                    start: "",
                    end: "",
                    uid:""
                },
                tableData: null,//表格数据
                listLoading: false,//表格加载过程的等待
                total: null,//总的数据条数
                sels: [],//列表选中行
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
            //获得表格数据
            getList(){
                this.listQuery.uid=this.uid;
                this.listLoading = true;
                Axios.get('selectAlarmer.do', {
                    params: this.listQuery,
                })
                    .then((res) => {
                        if (res.code == 0) {
                            this.tableData = res.data.alarmers;
                            this.total = res.data.num;
                        }
                        this.listLoading = false;
                    })
                    .catch((err) => {
                        this.listLoading = false;
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
            //            加油站改变时搜索
            stationChange(value){
                this.listQuery.gasId = value;
                this.handleFilter();
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
            dealChange: function (index, row) {
                this.$confirm('确认处理此条报警吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        Axios.get('dealAlarmer.do', {
                            params: {
                                id: row.id,
                                check: row.check
                            },
                        })
                            .then((res) => {
                                if (res.code == 0) {
                                    this.$message({
                                        message: res.message,
                                        type: 'success'
                                    });
                                    this.getList();
                                }
                            })
                    })
            },
            //            批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.listLoading = true;
                        const para = {ids: ids};
                        Axios.get('deleteAlarmer.do', {
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
            }
        }
    }
</script>
