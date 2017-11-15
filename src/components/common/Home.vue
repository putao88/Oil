<template>
    <div class="wrapper">
        <v-header></v-header>
        <!--侧边导航-->
        <v-sidebar></v-sidebar>
        <!--中间内容-->
        <div class="content" :class="collapsed?'left-40':'left-220'">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>
<script>
    import vSidebar from './Sidebar.vue';
    import vHeader from './Header.vue';
    import { mapGetters } from 'vuex'
    export default{
        components:
            {
                vSidebar,vHeader
            },
        data(){
            return {
                clock: ''
            }
        },
        computed: {
            ...mapGetters([
                'collapsed'
            ]),
        },
        methods: {
//          退出登录
            Logout: function () {
                var self = this;
                self.$confirm('确认退出吗？', '提示', {}).then(() => {
                    sessionStorage.removeItem("session");
                    self.$router.push("./login");
                }).catch(() => {
                
                })
            },
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
            }
        },
//    页面加载完成之后调用钩子的内部函数
        mounted() {
            this.Clock();
        }
    }
</script>
<style scoped>
    .left-220 {
        left: 220px;
    }
    
    .left-40 {
        left: 40px;
    }
</style>
