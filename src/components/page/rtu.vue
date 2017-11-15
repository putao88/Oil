<template>
    <div>
        <!--------------工具条-------------->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom:0;">
                <el-form :inline="true">
                    <el-form-item>
                        <station-select @handleChangeChild="stationChange"></station-select>
                    </el-form-item>
    
                    <el-form-item style="float:right;">
                        <el-button type="primary" @click="handleAdd" icon="plus">新增RTU</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    
        <!---------表格------------->
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." @selection-change="selsChange" height="560" style="width: 100%">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="rtuid" label="RTU编号" align="center"  sortable></el-table-column>
            <el-table-column prop="gas.unitname" label="所属加油站" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
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
    
        <!-- -----------------------新增界面-------------------->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :inline="true" :rules="addFormRules" ref="addForm">
                <!--油罐选择-->
                <el-form-item label="加油站名称" prop="gid">
                    <station-select @handleChangeChild="addRTUstation"></station-select>
                </el-form-item>
                <el-form-item label="RTU编号" prop="rtuid">
                    <el-input v-model="addForm.rtuid"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit('addForm')" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Axios from '../../util/fetch';
    import stationSelect from '../subItem/stationSelect.vue'
    import { mapGetters } from 'vuex'
    export default{
        components: {stationSelect},//导入联动下拉子组件
        data(){
            return{
                listQuery: {//获取表格数据需要传的参数
                    gasId: "",
                    curPage: 1,
                    pageSize: 20,
                    uid:""
                },
                tableData:null,//表格数据
                listLoading: false,//表格加载过程的等待
                total: null,//总的数据条数
                sels: [],//列表选中行
    
                /*------------------新增-------------------*/
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待
                addFormRules: {   //新增框的输入格式判断
                    gid:[{type:'number',required: true, message: '请绑定加油站', trigger: 'change'}],
                    rtuid: [{required: true, message: '请输入RTU编号', trigger: 'blur'}]
                },
                //新增界面数据
                addForm: {
                    gid:'',
                    rtuid: ''
                }
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
            //获得表格数据
            getList(){
                this.listQuery.uid=this.uid;
                this.listLoading = true;
                Axios.get('rtuGas/selectRTU.do', {
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
            //            选中行
            selsChange: function (sels) {
                this.sels = sels;
            },
            //            加油站改变时搜索
            stationChange(value){
                this.listQuery.gasId=value;
                this.handleFilter();
            },
            addRTUstation(value){
                this.addForm.gid=value;
            },
            //            搜索筛选函数
            handleFilter() {
                this.listQuery.curPage = 1;
                this.getList();
            },
//            显示新增RTU窗口
            handleAdd:function(){
                this.addFormVisible = true;
                this.addForm = {
                    gid:'',
                    rtuid: ''
                };
            },
            //            新增页面提交
            addSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            Axios.post('rtuGas/insert.do',para)
                                .then((res) => {
                                    this.addLoading = false;
                                    if (res.code == 0) {
                                        this.$message({
                                            message: '提交成功！',
                                            type: 'success'
                                        });
                                        this.$refs['addForm'].resetFields();
                                        this.addFormVisible = false;
                                        this.getList();
                                    }
                                })
                                .catch((err) => {
                                    this.addLoading = false;
                                })
                        })
                    }
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
                        const para={ids:ids};
                        Axios.get('rtuGas/deleteChoose.do', {
                            params:para
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
