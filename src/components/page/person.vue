<template>
    <div class="personBg">
        <div>
            <img class="uesrPng" src="../../custom/img/usr.jpg">
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item class="changBtn">
                <el-button type="text" @click="change">修改个人信息</el-button>
            </el-form-item>
            <el-form-item label="用户帐号" prop="username">
                <el-input v-model="ruleForm.username" :disabled=true></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realname">
                <el-input v-model="ruleForm.realname" :disabled="disabStr"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="ruleForm.sex">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="2">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="ruleForm.phone" :disabled="disabStr"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
                <el-input v-model="ruleForm.email" :disabled="disabStr"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
                <el-input v-model="ruleForm.unit" :disabled="disabStr"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="ruleForm.address" :disabled="disabStr"></el-input>
            </el-form-item>
            <!--按钮-->
            <el-form-item>
                <el-button type="primary" :disabled="disabStr" @click="submitForm('ruleForm')">提交</el-button>
                <el-button :disabled="disabStr" @click="resetForm('ruleForm')">重置</el-button>
                <el-button type="primary" @click="changePWD">修改密码</el-button>
            </el-form-item>
        </el-form>
    
        <!-- -----------------------新增界面-------------------->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                <el-form-item label="原密码" prop="oldPwd">
                    <el-input v-model="addForm.oldPwd" type="password"></el-input>
                </el-form-item>
            
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="addForm.newPwd" auto-complete="off" type="password"></el-input>
                </el-form-item>
            
                <el-form-item label="确认新密码" prop="confirmPwd">
                    <el-input v-model="addForm.confirmPwd" auto-complete="off" type="password"></el-input>
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
            var filtPhone=(rule, value, callback) =>{
                if (value === '') {
                    callback(new Error('请输入电话号码'));
                }else{
//                    输入必须为非负浮点数，且小数点最多2位
                    if(!(/^1[34578]\d{9}$/.test(value))){
                        callback(new Error('请输入正确格式的手机号码！'));
                    }
                    callback();
                }
            };
            var validatePwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addForm.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                disabStr:true,
                ruleForm: {
                    username: '',
                    phone: '',
                    realname: '',
                    address: '',
                    email: '',
                    sex:'',
                    unit: '',
                },
                rules: {
                    phone: [{validator:filtPhone,trigger: 'blur'}],
                    realname:[{required: true, message: '请输入真实姓名', trigger: 'blur'}],
                    address:[{required: true, message: '请输入加油站名称', trigger: 'blur'}],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type:'email',message: '请输入正确的邮箱地址', trigger: 'blur'}
                        ],
                    sex:[{required: true, message: '请选择性别', trigger: 'change'}],
                    unit:[{required: true, message: '请输入单位名称', trigger: 'blur'}],
                },
                /*-------------修改密码弹窗--------------*/
                addFormVisible: false,//界面是否显示
                addLoading: false,//提交等待
                addFormRules: {   //格式判断
                    oldPwd: [{required: true, message: '请输入原密码', trigger: 'blur'}],
                    newPwd: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                        ],
                    confirmPwd: [{ validator: validatePwd, trigger: 'blur' }],
                },
                //修改密码界面数据
                addForm: {
                    newPwd: '',
                    oldPwd: '',
                    confirmPwd: '',
                }
            };
        },
        computed: {
            ...mapGetters([
                'username'
            ])
        },
        mounted(){
            this.getList();
        },
        methods: {
            //获得个人信息
            getList(){
                Axios.get('selectUserByName.do', {
                    params:{
                        username:this.username
                    },
                })
                    .then((res) => {
                        if (res.code == 0) {
                            this.ruleForm = res.data.userBean;
                        }
                    })
            },
//            点击修改个人信息
            change(){
                this.disabStr=false;
            },
            submitForm(formName) {
                this.ruleForm.username=this.username;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.ruleForm);
                            let data={
                                username: para.username,
                                phone:para.phone,
                                realname: para.realname,
                                address:para.address,
                                email:para.email,
                                sex:para.sex,
                                unit:para.unit,
                            };
                            Axios.post('updateUser.do', data)
                                .then((res) => {
                                    if (res.code == 0) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['editForm'].resetFields();
                                        this.getList();
                                        this.disabStr=true;
                                    }
                                })
                        })
                    }
                });
            },
//            重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //            修改密码弹窗显示
            changePWD: function (){
                this.addFormVisible = true;
                this.addForm = {
                    newPwd: '',
                    oldPwd: '',
                    confirmPwd: '',
                };
            },
//            修改密码页面提交
            addSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            let data={
                                username:this.username,
                                oldPwd:para.oldPwd,
                                newPwd:para.newPwd,
                            }
                            Axios.post('updatePwd.do', data)
                                .then((res) => {
                                    this.addLoading = false;
                                    if (res.code == 0) {
                                        this.$message({
                                            message: '修改密码成功！',
                                            type: 'success'
                                        });
                                        this.$refs['addForm'].resetFields();
                                        this.addFormVisible = false;
                                        this.getList();
//                                        修改密码后退出登录
                                        this.$store.dispatch('LogOut').then(() => {
                                            location.reload()// 为了重新实例化vue-router对象 避免bug
                                        })
                                    }
                                })
                                .catch((err) => {
                                    this.addLoading = false;
                                })
                        })
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .personBg {
        width: 600px;
        height: 500px;
        margin: auto;
    }
    .changBtn button{
        float:right;
    }
    .changBtn button:hover{
        text-decoration:underline;
    }
    .uesrPng{
        width:100px;
        height: 100px;
        margin-top:20px;
        border-radius: 50%;
    }
</style>
