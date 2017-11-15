/**
 * Created by Administrator on 2017/11/8.
 */
const getters = {
    collapsed: state => state.app.collapsed,
    tanksId:state => state.app.tanksId,
    visitedViews: state => state.app.visitedViews,
    token: state => state.user.token,
    username: state => state.user.username,
    uid: state => state.user.uid,
    roles: state => state.user.roles,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters
}
export default getters

