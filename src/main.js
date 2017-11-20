// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui'; //New Added，引入ElementUI
import 'element-ui/lib/theme-default/index.css'; //New Added，引用ElementUI的主题
import App from './App';//引入APP组件
import router from './router/index';//引入路由配置
// import axios from 'axios';
// import Vuex from 'vuex';
import store from './store';
import './permission' // 权限


// 引入mockjs，本地模拟测试，若是需要则打开注释
// require('./mock.js');

Vue.config.productionTip = false;
Vue.use(ElementUI);//使用ElementUI
Vue.config.debug = true;//开启debug模式
// Vue.prototype.$axios = axios;//将axios扩展到Vue原型上，从而在vue内部可以用`this.$axios`访问axios。这样就可以避免在每一个vue组件中引入axios的麻烦。
// axios.defaults.withCredentials = true;//withCredentials默认是false，意思就是不携带cookie信息
// axios.defaults.baseURL = 'http://192.168.2.230:8080/GAS_New/'//每个请求的共用前缀，正式开发时删除掉
// Vue.use(Vuex);//使用vuex


// // 路由钩子
// router.beforeEach((to,from,next) => {
//   if(to.path == '/login'){
//     sessionStorage.removeItem("session");
//   }
//   let session=JSON.parse(sessionStorage.getItem("session"));
//   if(!session&&to.path!= '/login'){
//     next({path:'/login'});
//   }else{
//     next();
//   }
// })

/* eslint-disable no-new */
new Vue({
    el: '#app', /*最后效果将会替换页面中id为app的div元素*/
    router, /*使用路由*/
    store,//使用vuex全局变量
    template: '<App/>', /*告知页面这个组件用这样的标签来包裹着,并且使用它*/
    components: {App}/*告知当前页面想使用App这个组件*/
})


