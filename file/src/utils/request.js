import axios from 'axios'
// import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { loadingShow, loadingHidden } from '@/components/Loading/index' // Loading
import Cookies from 'js-cookie' // 设置cookie
// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api 的 base_url
    timeout: 300000 // 请求超时时间
})

service.interceptors.request.use(
    config => {
        // Do something before request is sent
        config.headers.channel = 'H5';
        if (getToken() || store.getters.token) {
            config.headers.authtoken = getToken() || store.getters.token;
        }
        console.log(config)
        return config
    },
    error => {
        Promise.reject(error)
    }
)


// function removeURLParameter(url, parameter) { // 去掉url传参
//     var urlparts = url.split('?');
//     if(urlparts.length >= 2) {
//       //参数名前缀
//       var prefix = encodeURIComponent(parameter) + '=';
//       var pars = urlparts[1].split(/[&;]/g);

//       //循环查找匹配参数
//       for(var i = pars.length; i-- > 0;) {
//         if(pars[i].lastIndexOf(prefix, 0) !== -1) {
//           //存在则删除
//           pars.splice(i, 1);
//         }
//       }

//       return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
//     }
//     return url;
// }

// removeURLParameter('http://localhost:8091/#/login', 'ccc')
// response 拦截器
service.interceptors.response.use(
    // response => {
    //     return response;
    // },

    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */

    response => {
        let sarr = [200, 304] // 被动退出
        if (sarr.includes(response.status) == true) {
            let res = response.data
            if (res && res.version) {
                if (res && res.data.success == 1) {
                    return res
                } else {
                    store.dispatch('getFlagalert', true) // 弹出组件
                    store.dispatch('getAlertTit', '') // 弹出提示标题存状态库
                    store.dispatch('getAlertIcon', "warring") // 弹出提示图标
                    store.dispatch('getAlertCon', res.data.respMsg) // 弹出提示内容存状态库
                    store.dispatch('getAlertBut', '确定') // 弹出按扭文字
                    store.dispatch('getAlertClass', 'center') // 清除三秒轮询
                    store.dispatch('getAlertShowCancel', false) // 弹出不显示 “取消” 按钮
                    return res
                }
            } else {
                // res = res.data // MOCK时期
                if (res && res.success == 1) {
                    return res
                } else {
                    // 10002: 未登陆,
                    // 10009: 在其他地方登录,
                    // 10010: 被代理商禁用,
                    // 10011: 被代理商踢出,
                    // 10012: 被平台踢出,
                    // 10013: 被平台禁用,
                    // 10014: 登录超时，请重新登录,
                    // 10015: 代理商被禁用
                    loadingHidden() // 去掉Loading加载
                    let arr = ['10002', '10009', '10010', '10011', '10012', '10013', '10014', '10015', '10017'], // 被动退出
                        msg = res.respMsg // 返回消息
                    if (arr.includes(res.respCode) == true) {
                        removeToken() // 清除cookies
                        Cookies.remove('uid') // 清除cookies
                        Cookies.remove('GGWAP-Token') // 清除cookies
                        store.dispatch('getFlagalert', true) // 弹出框显示
                        store.dispatch('getAlertTit', '') // 弹出提示标题存状态库
                        store.dispatch('getAlertIcon', "warring") // 弹出提示图标
                        store.dispatch('getAlertCon', msg) // 弹出提示内容存状态库
                        store.dispatch('getAlertBut', '确定') // 弹出按扭文字
                        store.dispatch('getAlertClass', 'center') // 清除三秒轮询
                        store.dispatch('getAlertShowCancel', false) // 弹出不显示 “取消” 按钮
                        store.dispatch('getAlertUrlyes', "yes") // 是否跳转商户连接
                        let url = store.getters.customerUrl // 商户连接
                        let flag = Cookies.get('flag'); // 在缓存中取出来做判断，判断之后需要清除缓存中的flag
                        // let flag = store.getters.flag_urlParameter //  路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
                        if (flag == 1) { // 1为后台自定义提供的url需要弹出退出图片，10s后跳转到相对应的url中
                            let host = window.location.host
                            url = host + '/#/tologin'

                        }
                        Cookies.remove('flag') // 清除cookies 路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
                        store.dispatch('getAlertUrl', url) // 商户连接

                        return
                    }
                    if (!res.success) { // 如果获取不到成功信息
                        res = '后台系统出错，请联络系统管理员'
                        return
                    }
                    store.dispatch('getFlagalert', true) // 弹出组件
                    store.dispatch('getAlertTit', '') // 弹出提示标题存状态库
                    store.dispatch('getAlertIcon', "warring") // 弹出提示图标
                    store.dispatch('getAlertCon', msg) // 弹出提示内容存状态库
                    store.dispatch('getAlertBut', '确定') // 弹出按扭文字
                    store.dispatch('getAlertClass', 'center') // 清除三秒轮询
                    store.dispatch('getAlertShowCancel', false) // 弹出不显示 “取消” 按钮
                    return res
                }
            }
        } else {
            let sarr5 = [502] // 服务器错误
            if (sarr5.includes(response.status) == true) {
                store.dispatch('getFlagalert', true) // 弹出框显示
                store.dispatch('getAlertTit', '') // 弹出提示标题存状态库
                store.dispatch('getAlertIcon', "warring") // 弹出提示图标
                store.dispatch('getAlertCon', '服务器错误，请联络系统管理员') // 弹出提示内容存状态库
                store.dispatch('getAlertBut', '确定') // 弹出按扭文字
                store.dispatch('getAlertClass', 'center') // 清除三秒轮询
                store.dispatch('getAlertShowCancel', false) // 弹出不显示 “取消” 按钮
                return
            }
            store.dispatch('getFlagalert', true) // 弹出组件
            store.dispatch('getAlertTit', '') // 弹出提示标题存状态库
            store.dispatch('getAlertIcon', "warring") // 弹出提示图标
            store.dispatch('getAlertCon', response.respMsg) // 弹出提示内容存状态库
            store.dispatch('getAlertBut', '确定') // 弹出按扭文字
            store.dispatch('getAlertClass', 'center') // 清除三秒轮询
            store.dispatch('getAlertShowCancel', false) // 弹出不显示 “取消” 按钮
        }
    },
    error => {
        loadingHidden() // 去掉Loading加载
        if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
            store.dispatch('getFlagalert', true) // 弹出框显示
            store.dispatch('getAlertTit', '') // 弹出提示标题存状态库
            store.dispatch('getAlertIcon', "warring") // 弹出提示图标
            store.dispatch('getAlertCon', '网络连接超时,请检查网络是否正常') // 弹出提示内容存状态库
            store.dispatch('getAlertBut', '确定') // 弹出按扭文字
            store.dispatch('getAlertClass', 'center') // 清除三秒轮询
            store.dispatch('getAlertShowCancel', false) // 弹出不显示 “取消” 按钮
            return Promise.reject(error); // reject这个错误信息
        }
        return Promise.reject(error);
    }
)

export default service
