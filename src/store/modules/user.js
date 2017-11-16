/**
 * Created by Administrator on 2017/11/8.
 */
import { loginByUsername, logout, getUserInfo } from '../../util/login'
import {getCookie, setCookie, delCookie} from '../../util/auth'


const user = {
    state: {
        uid: '',
        username: '',
        token: getCookie("token"),
        roles: [],
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },

        SET_UID: (state, uid) => {
            state.uid = uid
        },
        SET_USERNAME: (state, username) => {
            state.username = username
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({ commit }, userInfo) {
            const username = userInfo.username.trim();
            return new Promise((resolve, reject) => {
                loginByUsername(username, userInfo.password).then(response => {
                    const data = response.data;
                    let expireDays = 1000 * 60 * 60;
                    setCookie('token',data.uid,expireDays);
                    commit('SET_TOKEN', data.uid);
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    const data = response.data.userBeans
                    commit('SET_ROLES', data.roleSet[0].name)
                    commit('SET_UID', data.id)
                    commit('SET_USERNAME', data.username)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    delCookie("token");
                    delCookie("collapsed");
                    delCookie("tanksId");
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出，不向后台传送
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                delCookie("token")
                resolve()
            })
        },

        // 动态修改权限
        ChangeRole({ commit }, role) {
            return new Promise(resolve => {
                commit('SET_TOKEN', role)
                let expireDays = 1000 * 60 * 60;
                setCookie('token', role,expireDays);
                getUserInfo(role).then(response => {
                    const data = response.data.userBeans
                    commit('SET_ROLES',data.roleSet[0].name)
                    commit('SET_UID', data.id)
                    commit('SET_USERNAME', data.username)
                    delCookie("token");
                })
            })
        }
    }
}

export default user;

