/**
 * Created by Administrator on 2017/11/8.
 */
import {getCookie, setCookie, delCookie} from '../../util/auth'

const app = {
    state: {
        collapsed:parseInt(getCookie("collapsed")),
        tanksId:parseInt(getCookie("tanksId")),
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            let expireDays = 1000 * 60 * 60;
            if (state.collapsed===0) {
                setCookie('collapsed', 1,expireDays)
            } else {
                setCookie('collapsed', 0,expireDays)
            }
            state.collapsed = !state.collapsed
        },
        SET_TANKID: (state, tanksId) => {
            state.tanksId = tanksId
        },
    },
    actions: {
        ToggleSideBar({ commit }) {
            commit('TOGGLE_SIDEBAR')
        },
        TankId({ commit },value) {
            let expireDays = 1000 * 60 * 60;
            setCookie('tanksId',value,expireDays);
            commit('SET_TANKID',value)
        },
    }
}

export default app

