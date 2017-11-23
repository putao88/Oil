<template>
    <div class="header">
        <div class="nav" :class="collapsed?'collapse-width':'normal-width'">
            <div class="tools fleft" @click.prevent="toggleSideBar">
                <i class="el-icon-oil-zhedie"></i>
            </div>
            <div class="fleft">
                <span class="clock"></span>
                <span id="clock" class="date">
                        <span>{{clock}}</span>
                </span>
            </div>
            <el-dropdown trigger="hover" class="fright">
                      <span>
                      <img class="uesrPng" src="../../custom/img/usr.jpg">
                        <span id="userName" class="usrNaem">{{username}} </span>
                      </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item divided @click.native="Logout"
                                      style="border-top:none;text-align:center;margin:0;">退出登录
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    export default{
        data(){
            return {
                clock: '',
            }
        },
        computed: {
            ...mapGetters([
                'collapsed',
                'username'
            ]),
        },
        methods: {
            Clock: function () {
                var self = this;
                var week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                var timerID = setInterval(updateTime, 1000);
                updateTime();
                function updateTime() {
                    var cd = new Date();
                    self.clock = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ';
                    self.clock += zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2) + ' , ' + week[cd.getDay()];
                }
                
                function zeroPadding(num, digit) {
                    var zero = '';
                    for (var i = 0; i < digit; i++) {
                        zero += '0';
                    }
                    return (zero + num).slice(-digit);
                }
                
                return clock;
            },
            //折叠导航栏
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            //          退出登录
            Logout: function () {
                this.$confirm('确认退出吗？', '提示', {}).then(() => {
                    this.$store.dispatch('LogOut').then(() => {
                        location.reload()// 为了重新实例化vue-router对象 避免bug
                    })
                })
            },
        },
//    页面加载完成之后调用钩子的内部函数
        mounted() {
            this.Clock();
            var session = sessionStorage.getItem('session');
            if (session) {
                session = JSON.parse(session);
                this.username = session.username;
            }
            
        }
    }
</script>
<style scoped>
    .header {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
        box-shadow: 5px 0 5px #999999;
        -webkit-box-shadow: 5px 0 5px #999999;
        -moz-box-shadow: 5px 0 5px #999999;
    }
    
    .header .collapse-width {
        margin-left: 40px;
    }
    
    .header .normal-width {
        margin-left: 220px;
    }
    
    .header .tools {
        padding: 0 8px;
        width: 30px;
        height: 50px;
        line-height: 50px;
        margin-right: 0;
        cursor: pointer;
    }
    
    .header .tools i {
        color: #000;
    }
    
    .nav {
        height: 50px;
        background-color: #eef1f6;
    }
    
    .nav > div {
        height: 50px;
        margin-left: 5px;
        margin-right: 40px;
        line-height: 50px;
        font-size: 13px;
        color: #646464;
        cursor: pointer;
    }
    
    .fleft {
        float: left;
    }
    
    .fright {
        float: right;
    }
    
    .nav > div img {
        width: 14px;
        margin-top: 2px;
    }
    
    .nav > div span.clock {
        float: left;
        width: 14px;
        height: 48px;
        background: url("../../custom/img/time.png") no-repeat center;
        background-size: 14px;
        -webkit-background-size: 14px;
        -moz-background-size: 14px;
    }
    
    .nav > div span.date {
        float: left;
        height: 50px;
        line-height: 50px;
        margin-left: 6px;
    }
    
    .nav .loginOut {
        float: right;
        margin-right: 35px;
        width: 40px;
        height: 30px;
        margin-top: 10px;
        border-left: 2px solid #B4B4B4;
        background: url("../../custom/img/out.png") no-repeat right center;
        background-size: 21px;
        -webkit-background-size: 21px;
        -moz-background-size: 21px;
        cursor: pointer;
    }
    
    .nav .uesrPng {
        float: right;
        width: 36px;
        height: 36px;
        margin-top: 7px;
        border-radius: 50%;
    }
    
    .nav .usrNaem {
        display: inline-block;;
        height: 50px;
        float: right;
        font-size: 16px;
        line-height: 50px;
        padding-right: 10px;
        
    }
    
    .nav .userFont {
        float: right;
        margin-left: 10px;
        margin-right: 15px;
        height: 50px;
        line-height: 50px;
        color: #656565;
        font-size: 13px;
    }
</style>
