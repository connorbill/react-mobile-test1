import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [{
        path: '/tologin', // 重定向配置退出页面
        name: 'tologin',
        component: () => import('@/views/login/tologin')
    },
    // {
    //     path: '/home', // 重定向配置初始化页面
    //     name: 'home',
    //     component: () => import('@/views/home/index')
    // },
    {
        path: '/login', // 登入
        name: 'login',
        component: () =>
            import ('@/views/login/index')
    },
    {
        path: '/gamePlay/index', // 投注大厅
        name: 'gamePlay',
        component: () =>
            import ('@/views/gamePlay/index')
    },
    {
        path: '/member/checkDetails', // 结算详情
        name: 'checkDetails',
        component: () =>
            import ('@/views/member/checkDetails')
    },
    {
        path: '/member/gameRules', // 游戏规则
        name: 'gameRules',
        component: () =>
            import ('@/views/member/gameRules')
    },
    {
        path: '/member/postionInfo', // 盘口信息
        name: 'postionInfo',
        component: () =>
            import ('@/views/member/postionInfo')
    },
    {
        path: '/member/history', // 历史记录
        name: 'history',
        component: () =>
            import ('@/views/member/history')
    },
    {
        path: '/member/orderPage', // 投注记录
        name: 'orderPage',
        component: () =>
            import ('@/views/member/orderPage')
    }
]

export default new Router({
    scrollBehavior: function scrollBehavior() {
        return { y: 0 };
    },
    routes: constantRouterMap
});