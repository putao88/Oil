/**
 * Created by Administrator on 2017/10/27.
 */
import axios from "axios";
import qs from  'qs';
import { Message } from "element-ui";
import router from "../router/index";

const Axios = axios.create({
    baseURL: "/api", // 因为我本地做了反向代理.api指代GAS_New
    // baseURL: "/GAS_New",
    timeout: 10000,
    responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
});

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
    config => {
        // 在发送请求之前做某件事
        if (
            config.method === "post" ||
            config.method === "put" ||
            config.method === "delete"
        ) {
            // 序列化
            config.data = qs.stringify(config.data);
        }
        // // 若是有做鉴权token , 就给头部带上token
        // if (localStorage.token) {
        //     config.headers.Authorization = localStorage.token;
        // }
        return config;
    },
    error => {
        Message({
            //  饿了么的消息弹窗组件,类似toast
            showClose: true,
            message: error,
            type: "error.data.error.message"
        });
        return Promise.reject(error.data.error.message);
    }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
    response => {
        const res = response.data;
        if(res.code!=0){///加油站项目当code=0时，请求成功
            Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject('error')
        }else{
            return response.data;
        }
    },
    error => {
        // console.log('err' + error)// for debug
        Message({
            message:error.message,
            type: 'error',
            duration: 5 * 1000
        });
        this.listLoading = false;
        return Promise.reject(error)
    }
);
// // 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
// export default {
//     install: function(Vue, Option) {
//         Object.defineProperty(Vue.prototype, "$http", { value: Axios });
//     }
// };
export default Axios;
