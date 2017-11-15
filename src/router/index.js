/**
 * Created by Administrator on 2017/11/9.
 */
import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/page/Login.vue'
import Home from '../components/common/Home.vue'
import index from '../components/page/index.vue'
import oilData from '../components/page/oilData.vue'
import inOutOil from '../components/page/inOutOil.vue'
import police from '../components/page/police.vue'
import oilExcel from '../components/page/oilExcel.vue'
import oilEcharts from '../components/page/oilEcharts.vue'
import tank from '../components/page/tank.vue'
import rtu from '../components/page/rtu.vue'
import station from '../components/page/station.vue'
import user from '../components/page/user.vue'
import power from '../components/page/power.vue'
import person from '../components/page/person.vue'
import NoPower from '../components/page/401.vue'
import NotFound from '../components/page/404.vue'
// 大屏显示
import fullIndex from '../components/fullScreen/index.vue'
// 油罐详情
import tankDetail from '../components/fullScreen/tankDetail.vue'

Vue.use(Router)//使用路由

// 公用路由表
export const constantRouterMap = [
    { path: '/login', component:login, hidden: true},
    { path: '/401', component:NoPower, hidden: true},
    {
        path: "/",
        component:Home,
        redirect: '/index',
        name: '',
        iconCls: 'el-icon-oil-shouye',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/index', component:index, name: '首页' }
        ]
    },
    {
        path: '/fullIndex',
        component: fullIndex,
        name: '大屏显示',
        iconCls: 'el-icon-oil-shuju',
        leaf: true,//只有一个节点
        children: [
            { path: '/fullIndex', component: fullIndex, name: '大屏显示' }
        ]
    },
    {
        path: '/tankDetail',
        component:tankDetail,
        name: '油罐数据',
        iconCls: 'el-icon-oil-shuju',
        hidden: true,
    },
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

// 需要权限角色的路由表
export const asyncRouterMap =[
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-oil-newData',
        leaf: true,//只有一个节点
        children: [
            { path: '/oilData', component: oilData, name: '油罐数据' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-oil-youtong',
        leaf: true,//只有一个节点
        children: [
            { path: '/inOutOil', component: inOutOil, name: '进出油管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-oil-jingbao',
        leaf: true,//只有一个节点
        children: [
            { path: '/police', component: police, name: '报警管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '报表管理',
        iconCls: 'el-icon-oil-baobiao',
        children: [
            { path: '/oilEcharts', component: oilEcharts, name: '油罐数据统计' },
            { path: '/oilExcel', component: oilExcel, name: '油罐数据报表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-oil-youpin',
        leaf: true,//只有一个节点
        children: [
            { path: '/tank', component: tank, name: '油罐管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-oil-youpin',
        leaf: true,//只有一个节点
        children: [
            { path: '/rtu', component: rtu, name: 'RTU管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-oil-jiayouzhan',
        leaf: true,//只有一个节点
        children: [
            { path: '/station', component: station, name: '加油站管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-oil-yonghu',
        meta: { role: ['admin'] },//用户角色权限
        leaf: true,//只有一个节点
        children: [
            { path: '/user', component: user, name: '用户管理', meta: { role: ['admin'] },}
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'el-icon-oil-anquan',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/power', component: power, name: '权限管理'}
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-oil-yonghu',
        leaf: true,//只有一个节点
        children: [
            { path: '/person', component: person, name: '个人中心' }
        ]
    },
    {
        path: '*',
        component: NotFound,
        name: '',
        hidden: true
    }
]



// router.beforeEach((to,from,next) => {
// })
