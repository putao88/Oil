<template>
    <div>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom:0;">
                <el-form :inline="true">
                    
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
                    <!--新增用户-->
                    <el-form-item style="float:right;">
                        <el-button type="primary" @click="handleAdd" icon="plus">新增用户</el-button>
                    </el-form-item>
                
                </el-form>
            </el-col>
        </el-row>
        
        <!--表格-->
        
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." @selection-change="selsChange"
                  height="560" style="width: 100%">
            <!--扩展表格-->
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="right" label-width="120px" inline class="demo-table-expand">
                        <el-form-item label="性别：">
                            <span v-if="props.row.sex==1">男</span>
                            <span v-if="props.row.sex==2">女</span>
                        </el-form-item>
                        <el-form-item label="联系电话：">
                            <span>{{ props.row.phone }}</span>
                        </el-form-item>
                        <el-form-item label="邮箱地址：">
                            <span>{{ props.row.email }}</span>
                        </el-form-item>
                        <el-form-item label="单位：">
                            <span>{{ props.row.unit }}</span>
                        </el-form-item>
                        <el-form-item label="地址：">
                            <span>{{ props.row.address }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="username" label="用户名" align="center" width="140"></el-table-column>
            <el-table-column label="真实姓名" align="center" width="140">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>真实姓名: {{ scope.row.realname }}</p>
                        <p>性别:
                            <span v-if="scope.row.sex==1">男</span>
                            <span v-if="scope.row.sex==2">女</span>
                        </p>
                        <p>联系电话: {{ scope.row.phone }}</p>
                        <p>邮箱地址: {{ scope.row.email }}</p>
                        <p>单位: {{ scope.row.unit }}</p>
                        <p>住址: {{ scope.row.address }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.realname }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            
            <el-table-column prop="roleids" label="用户角色" align="center" width="120">
                <template scope="scope">
                    <span v-for="item in scope.row.roleSet" :class="item.name">{{item.name}}</span>
                </template>
            </el-table-column>
            
            <el-table-column label="拥有加油站" align="center">
                <template scope="scope">
                    <span class="tag" v-for="item in scope.row.gasList"
                          @click="gasTab(scope.row)">{{item.unitname}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
            <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm"
                     style="margin-right:50px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" :disabled=true></el-input>
                </el-form-item>
                
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="editForm.realname" auto-complete="off"></el-input>
                </el-form-item>
    
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="email地址" prop="email">
                    <el-input v-model="editForm.email" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="editForm.unit" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="地址" prop="address">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>
            
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        
        <!-- -----------------------新增界面-------------------->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" style="margin-right:50px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="addForm.realname" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <!--<el-form-item label="角色分配">-->
                <!--<el-checkbox-group v-model="addForm.roleids">-->
                <!--<el-checkbox label="1">superadmin</el-checkbox>-->
                <!--<el-checkbox label="2">admin</el-checkbox>-->
                <!--<el-checkbox label="3">general</el-checkbox>-->
                <!--<el-checkbox label="4">visitor</el-checkbox>-->
                <!--</el-checkbox-group>-->
                <!--</el-form-item>-->
                
                <el-form-item label="选择加油站" prop="gids">
                    <el-select v-model="addForm.gids" multiple placeholder="请选择" style="width:100%;">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="addForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="email地址" prop="email">
                    <el-input v-model="addForm.email" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="addForm.unit" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="地址" prop="address">
                    <el-input v-model="addForm.address" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit('addForm')" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        
        <!--------------------------更新用户加油站界面--------------------------------------->
        <el-dialog title="编辑" v-model="gasFormVisible" :close-on-click-modal="false">
            <el-form :model="gasForm" label-width="120px" :rules="gasFormRules" ref="gasForm"
                     style="margin-right:50px">
                <el-form-item label="选择加油站:" prop="gids">
                    <el-checkbox-group v-model="gasForm.gids">
                        <el-checkbox
                            v-for="item in options"
                            :key="item.value"
                            :label="item.value"
                            class="checkBox">
                            {{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="gasFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="gasSubmit('gasForm')" :loading="gasLoading">提交</el-button>
            </div>
        </el-dialog>
    
    </div>
</template>
<script>
    import Axios from '../../util/fetch';
    import {mapGetters} from 'vuex'
    export default{
        data(){
            var filtPhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入电话号码'));
                } else {
//                    输入必须为非负浮点数，且小数点最多2位
                    if (!(/^1[34578]\d{9}$/.test(value))) {
                        callback(new Error('请输入正确格式的手机号码！'));
                    }
                    callback();
                }
            };
            return {
                allTime: "",
                options: [],//加油站下拉
                selectValue: '',//加油站id
                getStation: {//获得加油站
                    gname: "",
                    curPage: 0,
                    pageSize: 0,
                    start: "",
                    end: "",
                    uid: ""
                },
                tableData: null,//表格数据
                listQuery: {//获取表格数据需要传的参数
                    curPage: 1,
                    pageSize: 15,
                    start: "",
                    end: "",
                },
                listLoading: false,//表格加载过程的等待
                total: null,//总的数据条数
                sels: [],//列表选中行
                /*-------------编辑--------------*/
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待
                editFormRules: {   //编辑框的输入格式判断
                    realname: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
                    unit: [{required: true, message: '请输入单位', trigger: 'blur'}],
                    phone: [{validator: filtPhone, trigger: 'blur'}],
                    password:[
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                    ],
                    address: [{required: true, message: '请输入单位地址', trigger: 'blur'}]
                },
                //编辑界面数据
                editForm: {
                    username: '',
                    realname: '',
                    password:'',
                    phone: '',
                    email: '',
                    address: '',
                    unit: '',
                    sex: ''
                },
                /*------------------新增-------------------*/
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待
                addFormRules: {   //新增框的输入格式判断
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    realname: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
                    password: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ],
                    unit: [{required: true, message: '请输入单位', trigger: 'blur'}],
                    phone: [{validator: filtPhone, trigger: 'blur'}],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                    ],
                    address: [{required: true, message: '请输入地址', trigger: 'blur'}],
                    roleids: [
                        {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
                    ],
                    gids: [
                        {type: 'array', required: true, message: '请至少选择一个加油站', trigger: 'change'}
                    ],
                },
                //新增界面数据
                addForm: {
                    username: '',
                    realname: '',
                    password: '',
                    phone: '',
                    email: '',
                    address: '',
                    unit: '',
                    sex: '',
                    roleids: [2],
                    gids: []
                },
                
                /*-------------更新用户加油站--------------*/
//                gasArray: [], //已选中的用户加油站
                gasFormVisible: false,//更新界面是否显示
                gasLoading: false,//更新提交等待
                gasFormRules: {   //更新框的输入格式判断
                    gids: [
                        {type: 'array', required: true, message: '请至少选择一个加油站', trigger: 'change'}
                    ],
                },
                //更新界面数据
                gasForm: {
                    uid: '',
                    gids: []
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
            this.getSelect();
        },
        methods: {
            getList(){
                this.listLoading = true;
                Axios.get('selectUser.do', {
                    params: this.listQuery,
                })
                    .then((res) => {
                        if (res.code == 0) {
                            this.tableData = res.data.userBeans;
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
                this.listQuery.start = this.allTime[0];
                this.listQuery.end = this.allTime[1];
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
                            let data = {
                                username: para.username,
                                realname: para.realname,
                                password:para.password,
                                phone: para.phone,
                                email: para.email,
                                address: para.address,
                                unit: para.unit,
                                sex: para.sex
                            }
                            Axios.post('updateUser.do', data)
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
                    username: '',
                    realname: '',
                    password: '',
                    phone: '',
                    email: '',
                    address: '',
                    unit: '',
                    sex: '1',
                    roleids: [2],
                    gids: []
                };
            },
            //            新增页面提交
            addSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            para.roleids = this.addForm.roleids.toString();
                            para.gids = this.addForm.gids.toString();
                            Axios.post('insertUserWithRoleOrGas.do', para)
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
            //            获取加油站下拉列表
            getSelect(){
                this.getStation.uid = this.uid;
                Axios.get('selectAllGas.do', {
                    params: this.getStation
                })
                    .then((res) => {
                        for (let i = 0; i < res.data.gass.length; i++) {
                            const data = {
                                value: res.data.gass[i].id,
                                label: res.data.gass[i].unitname
                            }
                            this.options.push(data);
                        }
                    })
            },
//        更新某一用户的加油站的编辑框显示
            gasTab: function (row) {
                this.gasForm.uid = row.id;
                const gasArray=[];
                for (let i = 0; i < row.gasList.length; i++) {
                    gasArray.push(row.gasList[i].id);
                }
                this.gasForm.gids =gasArray;
                this.gasFormVisible = true;
            },
            //            用户的加油站页面提交
            gasSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.gasLoading = true;
                           let para = Object.assign({}, this.gasForm);
                            para.gids = this.gasForm.gids.toString();
                            Axios.post('updateUserHasGas.do', para)
                                .then((res) => {
                                    this.gasLoading = false;
                                    if (res.code == 0) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['gasForm'].resetFields();
                                        this.gasFormVisible = false;
                                        this.getList();
                                    }
                                    this.gasFormVisible = false;
                                })
                                .catch((err) => {
                                    this.gasLoading = false;
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
                        const para = {ids: ids};
                        Axios.get('deleteUser.do', {
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

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    
    /*标签样式*/
    .tag {
        display: inline-block;
        padding: 0 3px;
        font-size: 12px;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        margin-right: 3px;
        color: #20A0FF;
        transform: scale(0.9);
        background-color: rgb(230, 250, 239);
        border: 1px solid #BFE4FF;
        cursor: pointer;
    }
    
    /*各种不同角色赋予不同颜色*/
    .superadmin {
        display: inline-block;
        padding: 0 3px;
        font-size: 12px;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        margin-right: 3px;
        transform: scale(0.9);
        background-color: #F7EAFA;
        border: 1px solid #E4D2E6;
        color: #979CF8;
    }
    
    .admin {
        display: inline-block;
        padding: 0 3px;
        font-size: 12px;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        margin-right: 3px;
        transform: scale(0.9);
        background-color: rgba(251, 0, 0, 0.1);
        border: 1px solid #FCAEAE;
        color: red;
    }
    
    .general {
        display: inline-block;
        padding: 0 3px;
        font-size: 12px;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        margin-right: 3px;
        color: #13CE66;
        transform: scale(0.9);
        background-color: #E6FAEF;
        border: 1px solid #BBF1D3;
    }
    
    .visitor {
        display: inline-block;
        padding: 0 3px;
        font-size: 12px;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        margin-right: 3px;
        color: #20A0FF;
        transform: scale(0.9);
        background-color: rgb(230, 250, 239);
        border: 1px solid #BFE4FF;
    }
    
    .gasTab {
        cursor: pointer;
    }
    
    .gasTab:hover {
        background-color: yellow;
    }
    
    .checkBox {
        width: 30%;
    }
    
    .checkBox:first-child {
        margin-left: 15px;
    }
</style>
