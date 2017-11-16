/**
 * Created by Administrator on 2017/11/9.
 */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getCookie } from './util/auth' // 验权

// permissiom judge
function hasPermission(roles, permissionRoles) {
    if (roles.indexOf('superadmin') >= 0) return true // superadmin权限 直接通过
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// register global progress.
const whiteList = ['/login']// 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start() // 开启Progress
    if (store.getters.token!==null) { // 判断是否有token
        if (to.path === '/login') {
            next({ path: '/' })
        }
        else {
            if (store.getters.uid.length === 0) { // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GetUserInfo').then(res => { // 拉取user_info
                    const uid = res.data.userBeans.id;
                    const roles=[res.data.userBeans.roleSet[0].name];
                    // const roles=['admin'];
                    store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
                        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                        next(to.path);// hack方法 确保addRoutes已完成
                    })
                }).catch(() => {
                    store.dispatch('FedLogOut').then(() => {
                        next({ path: '/login' })
                    })
                })
            } else {
                next();//当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
            }
        }
    }
    else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login') // 否则全部重定向到登录页
            NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})

