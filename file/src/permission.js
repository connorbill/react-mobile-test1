import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import "./assets/stylus/load.styl";
import { getToken, setToken, removeToken } from '@/utils/auth' // getToken from cookie
import { loadingShow, loadingHidden } from '@/components/Loading/index'  // Loading
import Cookies from 'js-cookie'
// 动态改造路由

function mapRouter(roles) { // 遍历后台传来的路由字符串，转换为组件对象
    let itme_data = [];
    let itme = [];
    roles.forEach((route,i) => {
        itme = {
            "path": "/",
            "name": route.urlName,
            "component": route.component
        }
    })
    itme_data.push(itme)
    return itme_data
  }

function GetUrlQuery(name) // 获取地址栏参数  // GetUrlQuery('lotteryCode')  // 调用
    {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
        var r = window.location.search.substr(1).match(reg)
        if(r != null)
        return  unescape(r[2])
        return  null
    }


// OPENAPI信息 清空
// let oLotteryCode = '', // 一级彩种code
//     oPlayRuleCode = '', // 二级彩种code
//     oAuthtoken = '', // uid
//     oChannel =  '' // 登入设备端

// OPENAPI信息 赋值
let url = window.location.hash,
    oAuthtoken = window.location.oAuthtoken;
if(url.includes('#/lottery') == false) {
    let oLotteryCode = GetUrlQuery('lotteryCode'), // 一级彩种code
        oPlayRuleCode = GetUrlQuery('playRuleCode'), // 二级彩种code
        oAuthtoken = GetUrlQuery('authtoken'), // uid
        oChannel = GetUrlQuery('channel'), // 登入设备端
        flag = GetUrlQuery('flag') // 路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
    if(oLotteryCode) {
        store.dispatch('getOpenLotteryCode', oLotteryCode) // 一级彩种code
        Cookies.set('lotteryCode', oLotteryCode)
    } else {
        store.dispatch('getOpenLotteryCode', '') // 一级彩种code
        Cookies.remove('lotteryCode')
    }
    if(oPlayRuleCode) {
        store.dispatch('getOpenPlayRuleCode', oPlayRuleCode) // 二级彩种code
        Cookies.set('oPlayRuleCode', oPlayRuleCode)
    } else {
        Cookies.remove('oPlayRuleCode')
    }
    if(oChannel) {
        store.dispatch('getOpenChannel', oChannel) // 登入设备端
        Cookies.set('oChannel', oChannel)
    } else {
        store.dispatch('getOpenPlayRuleCode', '') // 二级彩种code
        Cookies.remove('oChannel')
    }
    if(oAuthtoken) {
        store.dispatch('getOpenAuthtoken', oAuthtoken) // openapitoken uid
        store.dispatch('getStoreToken', oAuthtoken) // openapitoken uid

        setToken(oAuthtoken)
    } else {
        store.dispatch('getOpenAuthtoken', '') // openapitoken uid
        store.dispatch('getOpenAuthtoken', '') // openapitoken uid
    }
   if(flag == 0|| flag == 1) {
        Cookies.set('flag', flag)
        store.dispatch('getOpenflag', Cookies.get('flag')) // 路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
    }
}


const whiteList = ['/login'] // no redirect whitelist
let urlFrom = [] // 临时存放路径来自哪个 路由
router.beforeEach((to, from, next) => {
    if(store.getters.flag_back == true) { // 如果是返回按扭进入的，删除最后一个历史记录数据
        urlFrom.pop() // 删除历史记录里最后一个数组
    } else { // 如果不是返回按扭进入的，存到历史返回
        let n = {'name': JSON.stringify(from.name), 'query': JSON.stringify(from.query)} // 当前来自路由
        urlFrom.push(n) // 临时存放路径来自哪个 路由
    }
    store.dispatch('getUrlFrom', urlFrom) // 路径来自哪个 路由-----记录跳路由的数据

    NProgress.start() // start progress bar
    if (getToken() || store.getters.token) { // determine if there has token
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
                loadingShow() // Loading加载
                store.dispatch('GetUserInfo').then(res => { // 拉取user_info
                    const roles = mapRouter(res) //动态设置路由
                    store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
                    router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                        loadingHidden()  // 去掉Loading加载
                    })
                }).catch((err) => {
                    store.dispatch('FedLogOut').then(() => {
                        next({ path: '/' })
                        loadingHidden()  // 去掉Loading加载
                    })
                })
            } else {
                if(getToken()) {
                    location.href = '/#'
                    next()
                } else {
                    next()

                }
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入 --如果为0，是本地环境
            next()
        } else {

            next() // 否则全部重定向到退出页

           // next(`/login`) // 否则全部重定向到登录页
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
            // MessageBox.alert('未生登入')
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
