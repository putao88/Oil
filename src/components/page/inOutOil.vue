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
                    
                    <!--<el-form-item style="float:right;">-->
                    <!--<el-button type="primary" @click="handleAdd" icon="plus">新增记录</el-button>-->
                    <!--</el-form-item>-->
                    
                    <el-form-item style="float:right;">
                        <el-button type="primary" @click="handleAdd" icon="plus">新增进出油</el-button>
                    </el-form-item>
                
                </el-form>
            </el-col>
        </el-row>
        
        <!--表格-->
        
        <el-table :data="tableData" stripe highlight-current-row border v-loading="listLoading"
                  element-loading-text="拼命加载中..." @selection-change="selsChange" height="560" style="width: 100%">
            <el-table-column type="selection" align="center" width="55" fixed></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="66"></el-table-column>
            <el-table-column prop="unitname" label="加油站名称" align="center" min-width="120"></el-table-column>
            <el-table-column prop="event" label="事件" align="center" min-width="140"></el-table-column>
            <el-table-column prop="start" label="开始时间" align="center" min-width="170"></el-table-column>
            <el-table-column prop="end" label="结束时间" align="center" min-width="170"></el-table-column>
            <el-table-column prop="beforelevel" label="进/出油前油位(mm)" align="center" min-width="180"></el-table-column>
            <el-table-column prop="afterlevel" label="进/出油后油位(mm)" align="center" min-width="180"></el-table-column>
            <el-table-column prop="change" label="进出油总量(L)" align="center" min-width="160"></el-table-column>
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
        
        <!--&lt;!&ndash; -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;新增界面&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
        <!--<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">-->
        <!--<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" style="margin-right:30px;">-->
        <!---->
        <!--<el-form-item label="加油站" prop="gid">-->
        <!--<station-select @handleChangeChild="stationChange"></station-select>-->
        <!--</el-form-item>-->
        <!---->
        <!--<el-form-item label="开始时间" prop="start">-->
        <!--<el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择进油开始时间"-->
        <!--v-model="addForm.start">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--&lt;!&ndash;结束时间&ndash;&gt;-->
        <!--<el-form-item label="结束时间" prop="end">-->
        <!--<el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择进油结束时间"-->
        <!--v-model="addForm.end">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!---->
        <!--<el-form-item label="进油前油位" prop="beforelevel">-->
        <!--<el-input v-model="addForm.beforelevel"></el-input>-->
        <!--</el-form-item>-->
        <!---->
        <!--<el-form-item label="进油后油位" prop="afterlevel">-->
        <!--<el-input v-model="addForm.afterlevel"></el-input>-->
        <!--</el-form-item>-->
        <!---->
        <!--<el-form-item label="进油量" prop="change">-->
        <!--<el-input v-model="addForm.change"></el-input>-->
        <!--</el-form-item>-->
        <!---->
        <!--<el-form-item label="事件" prop="event">-->
        <!--<el-input v-model="addForm.event"></el-input>-->
        <!--</el-form-item>-->
        <!---->
        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="addFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="addSubmit('addForm')" :loading="addLoading">提交</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->
        
        <!-- -----------------------操作进出油界面-------------------->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <div style="float:right;margin-right:40px;margin-bottom:20px;">
                <el-button type="primary" @click="startOil" v-show="btnVisible" :disabled="!this.addForm.gid.length">
                    开始进/出油
                </el-button>
                
                <el-button type="primary" @click="endOil" v-show="!btnVisible">结束进/出油</el-button>
            </div>
            <el-form :model="addForm" label-width="120px" :inline="true" :rules="addFormRules" ref="addForm">
                
                <el-form-item label="加油站/油罐" prop="gid" style="width:100%;">
                    <mix-select @handleChangeChild="handleChange1" :chang-selon="changSelon1"></mix-select>
                </el-form-item>
                
                <el-form-item label="开始时间" prop="start">
                    <el-input v-model="addForm.start" :disabled="true"></el-input>
                </el-form-item>
                <!--结束时间-->
                <el-form-item label="结束时间" prop="end">
                    <el-input v-model="addForm.end" :disabled="true"></el-input>
                </el-form-item>
                
                <el-form-item label="进/出油前油位(mm)" prop="beforelevel">
                    <el-input v-model="addForm.beforelevel" :disabled="true"></el-input>
                </el-form-item>
                
                <el-form-item label="进/出油后油位(mm)" prop="afterlevel">
                    <el-input v-model="addForm.afterlevel" :disabled="true"></el-input>
                </el-form-item>
                
                <el-form-item label="进/出油量" prop="change">
                    <el-input v-model="addForm.change" :disabled="true"></el-input>
                </el-form-item>
                
                <el-form-item label="事件" prop="event">
                    <el-input v-model="addForm.event" :disabled="true"></el-input>
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
    import mixSelect from '../subItem/select.vue'
    import stationSelect from '../subItem/stationSelect.vue'
    import {mapGetters} from 'vuex'
    export default{
        components: {mixSelect, stationSelect},//导入联动下拉子组件
        data(){
            //            检验输入的是否为数值
            var filtNum = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请设置限值'));
                } else {
//                    输入必须为非负浮点数，且小数点最多2位
                    if (value.match(/^\+{0,1}\d+(\.\d{1,2})?$/) == null) {
                        callback(new Error('请输入不超过2位小数的数字！'));
                    }
                    callback();
                }
            };
            return {
                btnVisible: true,//进出油按钮
                changSelon: true,//判断下拉子组件的选择是否可以任选层级
                changSelon1: false,//判断下拉子组件的选择是否可以任选层级
                listQuery: {//获取表格数据需要传的参数
                    curPage: 1,
                    pageSize: 15,
                    gasId: "",//加油站id
                    tid: "",//油罐id
                    start: "",
                    end: "",
                    uid: ""
                },
                listLoading: false,//表格加载过程的等待
                total: null,//总的数据条数
                sels: [],//列表选中行
                tableData: [],//表格数据

//                获取最新一条油罐数据
                listQuery1: {//获取油罐数据需要传的参数
                    gasId: "",
                    curPage: 1,
                    pageSize: 20,
                    start: "",
                    end: "",
                    id: "",
                    uid: ""
                },
                
                /*------------------新增-------------------*/
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待
                addFormRules: {   //新增框的输入格式判断
                    gid: [{type: 'array', required: true, message: '请选择加油站/油罐', trigger: 'change'}],
                    afterlevel: [{required: true, message: '请点击结束进/出油'}],
                    beforelevel: [{required: true, message: '请点击开始进/出油'}],
                    change: [{required: true, message: '请点击结束进/出油'}],
                    start: [{required: true, message: '请点击开始进/出油'}],
                    end: [{required: true, message: '请点击结束进/出油'}],
                    event: [{required: true, message: '请点击结束进/出油'}],
                },
                //新增界面数据
                addForm: {
                    gid: [],
                    afterlevel: '',
                    beforelevel: '',
                    change: '',
                    event: '',
                    start: '',
                    end: ''
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
//        联动搜索改变时
            handleChange(value){
                this.listQuery.gasId = value[0];
                this.listQuery.tid = value[1];
                this.handleFilter();
            },
            //       进出油选择油罐时
            handleChange1(value){
//                清空
                this.btnVisible = true;
                this.addForm = {
                    gid: value,
                    afterlevel: '',
                    beforelevel: '',
                    change: '',
                    event: '',
                    start: '',
                    end: ''
                };
            },
            //            获取表格数据
            getList(){
                this.listLoading = true;
                this.listQuery.uid = this.uid;
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
            //            显示新增页面
            handleAdd: function () {
                this.addFormVisible = true;
                this.btnVisible = true;
                this.addForm = {
                    gid: '',
                    afterlevel: '',
                    beforelevel: '',
                    change: '',
                    event: '',
                    start: '',
                    end: ''
                };
            },
            //            新增页面提交
            addSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            let data={
                                gid:para.gid[0],
                                tid:para.gid[1],
                                afterlevel:para.afterlevel,
                                beforelevel:para.beforelevel,
                                change:para.change,
                                event:para.event,
                                start:para.start,
                                end: para.end
                            }
                            Axios.post('insertIOData.do', data)
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
//            //            加油站改变时搜索
//            stationChange(value){
//                this.addForm.gid = value;
//            },


//            开始进油
            startOil(){
                this.listQuery1.gasId = this.addForm.gid[0];
                this.listQuery1.id = this.addForm.gid[1];
                this.listQuery1.uid = this.uid;
                Axios.get('selectOilTank.do', {
                    params: this.listQuery1,
                })
                    .then((res) => {
                        this.addForm.start = res.data.ots[0].time;
                        this.addForm.beforelevel = res.data.ots[0].oillevel;
                        this.btnVisible = false;
                    })
            },

//            结束进油
            endOil(){
                Axios.get('selectOilTank.do', {
                    params: this.listQuery1,
                })
                    .then((res) => {
                        this.addForm.end = res.data.ots[0].time;
                        this.addForm.afterlevel=res.data.ots[0].oillevel;
//                        this.addForm.afterlevel = 188.23;
//                        调用减法函数
                        const change=this.accSub(this.addForm.beforelevel, this.addForm.afterlevel);
//                        去油位变化的绝对值
                        this.addForm.change=Math.abs(change);
                        if(change>0){
                            this.addForm.event=res.data.ots[0].name+"出油";
                        }else{
                            this.addForm.event=res.data.ots[0].name+"进油";
                        }
                    
                    })
            },
            
            accSub(arg1, arg2)
            {
                if (isNaN(arg1)) {
                    arg1 = 0;
                }
                if (isNaN(arg2)) {
                    arg2 = 0;
                }
                arg1 = Number(arg1);
                arg2 = Number(arg2);
                
                var r1, r2, m, n;
                try {
                    r1 = arg1.toString().split(".")[1].length;
                }
                catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split(".")[1].length;
                }
                catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m).toFixed(n);
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
            }
            ,
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
            }
            ,
        },
    }
</script>
