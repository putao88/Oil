<template>
    <div class="wrap">
        <img src="../../custom/img/login_banner.png" class="banner">
        <!--中间部分的登录框-->
        <div class="middle">
            <!--大圆圈logo-->
            <img src="../../custom/img/LOGO.png" class="logo">
            <!--登录框-->
            <div class="login_bg">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                    <!--用户名输入-->
                    <div class="userbg" v-bind:class="{purBorder:userpur}">
                        <div class="useritem">
                            <el-form-item prop="username">
                                <el-input v-model="ruleForm.username" placeholder="username" v-on:focus="InputFoc"
                                          v-on:blur="InputBlur"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <!--密码输入-->
                    <div class="pwdbg" v-bind:class="{purBorder:pwpur}">
                        <div class="pwditem">
                            <el-form-item prop="password">
                                <el-input placeholder="password" :type="pwdType" v-model="ruleForm.password"
                                          v-on:focus="pInputFoc" v-on:blur="pInputBlur"
                                          @keyup.enter.native="submitForm('ruleForm')"></el-input>
                                <span class="show_pwd" @click='showPwd'><i class='el-icon-oil-eye'></i></span>
                            </el-form-item>
                        </div>
                    </div>
                    <!--&lt;!&ndash;记住密码&ndash;&gt;-->
                    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
                    <!--<button class="login" id="login" type="primary" @click="submitForm('ruleForm')">登  录</button>-->
                    <div class="login">
                        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                    </div>
                </el-form>
            </div>
            <!--底部字体提示-->
            <div class="botmFont">Copyright © 2017 INST.ALL Rights Reserved</div>
        </div>
        <loading v-if="isLoging" marginTop="5%"></loading>
    </div>
</template>
<script>
    import Loading from '../subItem/Loading.vue';
    import Axios from '../../util/fetch';
    import {setCookie} from '../../util/auth.js';
    //  ecport为ES6的导出语法，抛出接口，方便其他组件调用
    export default {
        components: {Loading},
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ]
                },
                pwdType: 'password',
                userpur: false,
                pwpur: false,
//        判断是否登录的加载圈
                isLoging: false
            }
        },
        methods: {
            // 密码的显示方式
            showPwd() {
                if (this.pwdType === 'password') {
                    this.pwdType = ''
                } else {
                    this.pwdType = 'password'
                }
            },
            //用户名文本获得焦点时
            InputFoc(){
                this.userpur = true;
            },
            //用户名文本失去焦点时
            InputBlur(){
                this.userpur = false;
            },
            //用户名文本获得焦点时
            pInputFoc(){
                this.pwpur = true;
            },
            //用户名文本失去焦点时
            pInputBlur(){
                this.pwpur = false;
            },
            submitForm(formName) {
//      Element ui自带的表单验证，其中引用了validate函数
                this.$refs[formName].validate((valid) => {
                    if (valid) {//当表单输入都不为空时才会向后台发送请求
                        this.isLoging = true;
                        this.$store.dispatch('LoginByUsername', this.ruleForm).then(() => {
                            this.isLoging = false;
                            this.$router.push({ path: '/' })
                        }).catch(() => {
                            this.isLoging = false;
                        })
                    }
                });
            }
        }
    }
</script>
<style>
    @import "../../custom/css/login.css";
</style>
