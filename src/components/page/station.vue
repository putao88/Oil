<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom:0;">
                <el-form :inline="true">
                    <el-form-item>
                        <el-input placeholder="加油站名称"
                                  @change="handleFilter"
                                  v-model="listQuery.gname"></el-input>
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
                    <!--&lt;!&ndash;起始时间&ndash;&gt;-->
                    <!--<el-form-item>-->
                        <!--<el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间"-->
                                        <!--v-model="listQuery.start">-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <!--&lt;!&ndash;结束时间&ndash;&gt;-->
                    <!--<el-form-item>-->
                        <!--<el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间"-->
                                        <!--v-model="listQuery.end">-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <!--查询按钮-->
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="handleFilter">查询</el-button>-->
                    <!--</el-form-item>-->
                    <!--新增按钮-->
                    <el-form-item style="float:right;">
                        <el-button type="primary" @click="handleAdd" icon="plus">新增加油站</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        
        
        <!--表格-->
        
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." @selection-change="selsChange" style="width: 100%">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="unitname" label="名称" align="center" sortable width="120"></el-table-column>
            <el-table-column prop="principal" label="负责人" align="center" sortable width="100"></el-table-column>
            <el-table-column prop="phone" label="联系电话" align="center" sortable width="130"></el-table-column>
            <el-table-column prop="email" label="邮箱" align="center" sortable width="200"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" sortable width="180"></el-table-column>
            <el-table-column prop="address" label="单位地址" align="center" sortable></el-table-column>
            <el-table-column label="操作" align="center"  width="140">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        
        <!-- -----------------------编辑界面-------------------->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="120px" :inline="true" :rules="editFormRules" ref="editForm">
                <el-form-item label="加油站名称" prop="unitname">
                    <el-input v-model="editForm.unitname"></el-input>
                </el-form-item>
                
                <el-form-item label="负责人" prop="principal">
                    <el-input v-model="editForm.principal" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="email地址" prop="email">
                    <el-input v-model="editForm.email" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="单位地址" prop="address">
                    <el-input type="textarea" v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>
            
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        
        <!-- -----------------------新增界面-------------------->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :inline="true" :rules="addFormRules" ref="addForm">
                <el-form-item label="加油站名称" prop="unitname">
                    <el-input v-model="addForm.unitname"></el-input>
                </el-form-item>
                
                <el-form-item label="负责人" prop="principal">
                    <el-input v-model="addForm.principal" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="addForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="email地址" prop="email">
                    <el-input v-model="addForm.email" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="单位地址" prop="address">
                    <el-input type="textarea" v-model="addForm.address" auto-complete="off"></el-input>
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
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                allTime:"",
                tableData: null,//表格数据
                listQuery: {//获取表格数据需要传的参数
                    gname: "",
                    curPage: 1,
                    pageSize: 20,
                    start: "",
                    end: "",
                    uid: ""
                },
                listLoading: false,//表格加载过程的等待
                total: null,//总的数据条数
                sels: [],//列表选中行
                /*-------------编辑--------------*/
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待
                editFormRules: {   //编辑框的输入格式判断
                    unitname: [{required: true, message: '请输入加油站名称', trigger: 'blur'}],
                    principal: [{required: true, message: '请输入负责人', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
                    email: [{required: true, message: '请输入email地址', trigger: 'blur'}],
                    address: [{required: true, message: '请输入单位地址', trigger: 'blur'}]
                },
                //编辑界面数据
                editForm: {
                    id: '',
                    unitname: '',
                    principal: '',
                    phone: '',
                    email: '',
                    address: '',
                    uid:""
                },
                /*-------------新增--------------*/
                addFormVisible: false,//编辑界面是否显示
                addLoading: false,//编辑提交等待
                addFormRules: {   //编辑框的输入格式判断
                    unitname: [{required: true, message: '请输入加油站名称', trigger: 'blur'}],
                    principal: [{required: true, message: '请输入负责人', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
                    email: [{required: true, message: '请输入email地址', trigger: 'blur'}],
                    address: [{required: true, message: '请输入单位地址', trigger: 'blur'}]
                },
                //新增界面数据
                addForm: {
                    unitname: '',
                    principal: '',
                    phone: '',
                    email: '',
                    address: '',
                    uid:''
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
        methods: {
            getList(){
                this.listQuery.uid=this.uid;
                this.listLoading = true;
                Axios.get('selectAllGas.do', {
                    params: this.listQuery,
                })
                    .then((res) => {
                        if (res.code == 0) {
                            this.tableData = res.data.gass;
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
//            搜索筛选函数
            handleFilter() {
                this.listQuery.curPage = 1;
                this.getList();
            },
//            时间段选择改变
            timeChange(){
                this.listQuery.start=this.allTime[0];
                this.listQuery.end=this.allTime[1];
                this.handleFilter();
            },
//            选中行
            selsChange: function (sels) {
                this.sels = sels;
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
//            编辑页面提交
            editSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            let data={
                                id:para.id,
                                unitname:para.unitname,
                                principal:para.principal,
                                phone:para.phone,
                                email:para.email,
                                address:para.address,
                                uid:this.uid
                            }
                            Axios.post('updGas.do', data)
                                .then((res) => {
                                    this.editLoading = false;
                                    if (res.code == 0) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['editForm'].resetFields();
                                        this.editFormVisible = false;
                                        this.getList();
                                    }
                                })
                                .catch((err) => {
                                    this.editLoading = false;
                                })
                        })
                    }
                })
            },
//            显示新增页面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    unitname: '',
                    principal: '',
                    phone: '',
                    email: '',
                    address: '',
                    uid:this.uid
                };
            },
//            新增页面提交
            addSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addForm.uid=this.uid;
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
//                            const data = qs.stringify({
//                                id:para.id,
//                                unitname:para.unitname,
//                                principal:para.phone,
//                                phone:para.phone,
//                                email:para.email,
//                                address:para.address
//                            });
                            Axios.post('insertGas.do', para)
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
//            删除某一行数据
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.listLoading = true;
                        let para = {ids: row.id};
                        
//                        删除数据提交
                        Axios.get('deleteGasByIDs.do', {
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
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.listLoading = true;
//                        const para = {ids:JSON.stringify(ids)};
//                        const para=JSON.stringify({ids:ids});
                        const para={ids:ids};
                        Axios.get('deleteGasByIDs.do', {
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
