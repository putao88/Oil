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
                </el-form>
            </el-col>
        </el-row>
    
        <!--表格-->
    
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." @selection-change="selsChange" height="560" style="width: 100%">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="unitname" label="加油站名称" align="center" width="120"></el-table-column>
            <el-table-column prop="event" label="事件" align="center" width="140"></el-table-column>
            <el-table-column prop="start" label="开始时间" align="center" width="170"></el-table-column>
            <el-table-column prop="end" label="结束时间" align="center" width="170"></el-table-column>
            <el-table-column prop="beforelevel" label="进/出油前油位(mm)" align="center" width="180"></el-table-column>
            <el-table-column prop="afterlevel" label="进/出油后油位(mm)" align="center" width="180"></el-table-column>
            <el-table-column prop="change" label="进出油总量(L)" align="center" width="160"></el-table-column>
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
    import mixSelect from '../subItem/select.vue'
    import { mapGetters } from 'vuex'
    export default{
        components: {mixSelect},//导入联动下拉子组件
        data(){
            return {
                changSelon:true,//判断下拉子组件的选择是否可以任选层级
                listQuery: {//获取表格数据需要传的参数
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
        methods:{
//        联动搜索改变时
            handleChange(value){
                this.listQuery.gasId=value[0];
                this.listQuery.tid=value[1];
                this.handleFilter();
            },
            //            获取表格数据
            getList(){
                this.listLoading = true;
                this.listQuery.uid=this.uid;
                Axios.get('selectIOHistory.do', {
                    params: this.listQuery,
                })
                    .then((res) => {
                        if (res.code == 0) {
                            this.tableData = res.data.ioHistories;
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
        },
    }
</script>
