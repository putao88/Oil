/**
 * Created by Administrator on 2017/11/9.
 */
import fetch from './fetch'

export function loginByUsername(username, password) {
    const data = {
        username,
        password
    }
    return fetch({
        url: 'login.do',
        method: 'post',
        data
    })
}

export function logout() {
    return fetch({
        url: 'logout.do',
        method: 'post'
    })
}

export function getUserInfo(token) {
    return fetch({
        url: 'selectUserHas.do',
        method: 'get',
        params: {uid:token }
    })
}


