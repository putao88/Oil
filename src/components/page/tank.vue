<template>
    <div>
        
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom:0;">
                <el-form :inline="true">
                    <el-form-item>
                        <station-select @handleChangeChild="stationChange"></station-select>
                    </el-form-item>
                    
                    <!--<el-form-item>-->
                        <!--<el-date-picker-->
                            <!--v-model="allTime"-->
                            <!--type="datetimerange"-->
                            <!--range-separator=" 至 "-->
                            <!--start-placeholder="开始时间"-->
                            <!--end-placeholder="结束时间"-->
                            <!--placeholder="-&#45;&#45;请选择时间段-&#45;&#45;"-->
                            <!--@change="timeChange">-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    
                    <el-form-item style="float:right;">
                    <el-button type="primary" @click="handleAdd" icon="plus">新增油罐</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    
        <!--表格-->
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." @selection-change="selsChange" height="560" style="width: 100%">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="name" label="油罐名称" align="center"  min-width="120"></el-table-column>
            <el-table-column prop="unitname" label="所属加油站" align="center" min-width="120"></el-table-column>
            <el-table-column prop="rtuid" label="RTU编号" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="wateruplim" label="水位上限(mm)" align="center" sortable min-width="160"></el-table-column>
            <el-table-column prop="oiluplim" label="油位上限(mm)" align="center" sortable min-width="160"></el-table-column>
            <el-table-column prop="oildownlim" label="油位下限(mm)" align="center" sortable  min-width="160"></el-table-column>
            <el-table-column prop="time" label="时间" align="center" sortable min-width="170"></el-table-column>
        </el-table>
    
        <!--分页工具条-->
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="primary" @click="updMessage" :disabled="this.sels.length===0" icon="edit">修改</el-button>
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" icon="delete">删除</el-button>
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
                <el-form-item label="所属加油站" prop="unitname">
                    <el-input v-model="editForm.unitname" :disabled=true></el-input>
                </el-form-item>
                <el-form-item label="rtu编号" prop="rtuid">
                    <el-input v-model="editForm.rtuid" :disabled=true></el-input>
                </el-form-item>
                <el-form-item label="油罐名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="水位上限" prop="wateruplim">
                    <el-input v-model="editForm.wateruplim"></el-input>
                </el-form-item>
                <el-form-item label="油位下限" prop="oildownlim">
                    <el-input v-model="editForm.oildownlim"></el-input>
                </el-form-item>
                <el-form-item label="油位上限" prop="oiluplim">
                    <el-input v-model="editForm.oiluplim"></el-input>
                </el-form-item>
        
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    
        <!-- -----------------------设置油位界面-------------------->
        <el-dialog title="修改" v-model="setFormVisible" :close-on-click-modal="false">
            <el-form :model="setForm" label-width="120px" :inline="true" :rules="setFormRules" ref="setForm">
                <el-form-item label="水位上限" prop="wateruplim">
                    <el-input v-model="setForm.wateruplim"></el-input>
                </el-form-item>
                <el-form-item label="油位下限" prop="oildownlim">
                    <el-input v-model="setForm.oildownlim"></el-input>
                </el-form-item>
                <el-form-item label="油位上限" prop="oiluplim">
                    <el-input v-model="setForm.oiluplim"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="setFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="setSubmit('setForm')" :loading="setLoading">提交</el-button>
            </div>
        </el-dialog>
    
        <!-- -----------------------新增界面-------------------->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :inline="true" :rules="addFormRules" ref="addForm">
                <!--油罐选择-->
                <el-form-item label="加油站/rtu" prop="gidArray">
                    <rtu-select @handleChangeChild="handleChange" :chang-selon="changSelon"></rtu-select>
                </el-form-item>
                <el-form-item label="油罐名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="水位上限" prop="wateruplim">
                    <el-input v-model="addForm.wateruplim"></el-input>
                </el-form-item>
                <el-form-item label="油位下限" prop="oildownlim">
                    <el-input v-model="addForm.oildownlim"></el-input>
                </el-form-item>
                <el-form-item label="油位上限" prop="oiluplim">
                    <el-input v-model="addForm.oiluplim"></el-input>
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
    import rtuSelect from '../subItem/rtuSelect.vue'
    import { mapGetters } from 'vuex'
    export default{
        components: {stationSelect,rtuSelect},//导入联动下拉子组件
        data(){
//            检验输入的是否为数值
            var filtNum = (rule, value, callback) =>{
                if (value === '') {
                    callback(new Error('请设置限值'));
                }else{
//                    输入必须为非负浮点数，且小数点最多2位
                    if(value.match(/^\+{0,1}\d+(\.\d{1,2})?$/)==null){
                        callback(new Error('请输入不超过2位小数的数字！'));
                    }
                    callback();
                }
            };
            var valueNum1=(rule, value, callback) =>{
                if (this.editForm.oildownlim>this.editForm.oiluplim) {
                    callback(new Error('油位下限必须小于油位上限'));
                }
                else{
                    callback();
                }
            };
            var valueNum2=(rule, value, callback) =>{
                if (this.setForm.oildownlim>this.setForm.oiluplim) {
                    callback(new Error('油位下限必须小于油位上限'));
                }
                else{
                    callback();
                }
            };
            var valueNum3=(rule, value, callback) =>{
                if (this.addForm.oildownlim>this.addForm.oiluplim) {
                    callback(new Error('油位下限必须小于油位上限'));
                }
                else{
                    callback();
                }
            };
            return {
                changSelon:false,//判断下拉子组件的选择是否可以任选层级
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
                sels: [],//列表选中行
                /*-------------编辑--------------*/
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待
                editFormRules: {   //编辑框的输入格式判断
                    name: [{required: true, message: '请输入加油站名称', trigger: 'blur'}],
                    oildownlim: [
                        {validator:filtNum,trigger: 'blur'},
                        {validator:valueNum1,trigger: 'blur'}
                    ],
                    oiluplim: [
                        {validator:filtNum,trigger: 'blur'},
                        {validator:valueNum1,trigger: 'blur'}
                    ],
                    wateruplim: [{validator:filtNum,trigger: 'blur'}],
                },
                //编辑界面数据
                editForm: {
                    ids: '',
                    name: '',
                    rtuid:'',
                    unitname:'',
                    oildownlim: '',
                    oiluplim: '',
                    wateruplim:''
                },
               /* ---------------批量设置限位-------------- */
                setFormVisible:false,
                setLoading: false,//设置提交等待
                setFormRules: {   //设置框的输入格式判断
                    name: [{required: true, message: '请输入加油站名称', trigger: 'blur'}],
                    oildownlim: [
                        {validator:filtNum,trigger: 'blur'},
                        {validator:valueNum2,trigger: 'blur'}
                        ],
                    oiluplim: [
                        {validator:filtNum,trigger: 'blur'},
                        {validator:valueNum2,trigger: 'blur'}
                    ],
                    wateruplim: [{validator:filtNum,trigger: 'blur'}],
                },
                //设置界面数据
                setForm: {
                    ids: '',
                    name: '',
                    oildownlim: '',
                    oiluplim: '',
                    wateruplim:''
                },
                /*------------------新增-------------------*/
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待
                addFormRules: {   //新增框的输入格式判断
                    gidArray:[{type:'array',required: true, message: '请绑定RTU', trigger: 'change'}],
                    name: [{required: true, message: '请输入加油站名称', trigger: 'blur'}],
                    oildownlim: [
                        {validator:filtNum,trigger: 'blur'},
                        {validator:valueNum3,trigger: 'blur'}
                        ],
                    oiluplim: [
                        {validator:filtNum,trigger: 'blur'},
                        {validator:valueNum3,trigger: 'blur'}
                        ],
                    wateruplim: [{validator:filtNum,trigger: 'blur'}],
                },
                //新增界面数据
                addForm: {
                    gidArray:[],
                    name: '',
                    oildownlim: '',
                    oiluplim: '',
                    wateruplim:'',
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
            //        联动搜索改变时
            handleChange(value){
                this.addForm.gidArray=value;
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
//            编辑页面提交
            editSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            let data={
                                ids:para.ids,
                                name:para.name,
                                oildownlim:para.oildownlim,
                                oiluplim:para.oiluplim,
                                wateruplim:para.wateruplim
                            }
                            Axios.post('updateOilTank.do', data)
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
//            批量设置页面提交
            setSubmit:function(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.setLoading = true;
                            let para = Object.assign({}, this.setForm);
                            let data={
                                ids:para.ids,
                                name:para.name,
                                oildownlim:para.oildownlim,
                                oiluplim:para.oiluplim,
                                wateruplim:para.wateruplim
                            }
                            Axios.post('updateOilTank.do',data)
                                .then((res) => {
                                    this.setLoading = false;
                                    if (res.code == 0) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['setForm'].resetFields();
                                        this.setFormVisible = false;
                                        this.getList();
                                    }
                                })
                                .catch((err) => {
                                    this.setLoading = false;
                                })
                        })
                    }
                })
            },
//            修改加油站设置
            updMessage:function (){
                var item=this.sels.map(item => item)[0];//单个修改时需要用
                var ids = this.sels.map(item => item.id);
                if(ids.length<2){
                    this.editFormVisible = true;
                    this.editForm = Object.assign({}, item);
                    this.editForm.ids=ids[0];
                }else{
                    this.setFormVisible = true;
                    this.setForm.ids= ids.toString();
                }
            },
//            显示新增页面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    gidArray:[],
                    name: '',
                    oildownlim: '',
                    oiluplim: '',
                    wateruplim:'',
                };
            },
            //            新增页面提交
            addSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            const data={
                                gid:para.gidArray[0],
                                rid:para.gidArray[1],
                                name:para.name,
                                oildownlim:para.oildownlim,
                                oiluplim:para.oiluplim,
                                wateruplim:para.wateruplim,
                            }
                            Axios.post('insertOilTank.do',data)
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
                        Axios.get('deleteOilTank.do', {
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
