import request from '@/utils/request'
import qs from 'qs'

export function loginByToken(params) {
    // const data = {
    //     hashCode: params.hashCode, // 代理商账号
    //     command: params.command, //  登录命令
    //     version: params.version, // 接口版本号
    //     data: params.data // 设备端
    // }
    return request({
        baseURL: '/openapi', // 请求自己配的json
        url: '/app/test',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function getSaverTimeAsyn() { // 获取服务器时间
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/front/pc/serverTime',
        method: 'post'
    })
}

export function gameHotList() { // 获取推荐游戏
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/front/h5/hot',
        method: 'post'
    })
}

export function gameHistoryList() { // 获取历史游戏
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/front/h5/history',
        method: 'post'
    })
}

export function gameMenuClass() { // 获取所有彩种游戏
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/front/h5/menuClass',
        method: 'post'
    })
}

export function getAccount() { // 获取用户信息
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/front/h5/account',
        method: 'post'
    })
}

export function currentOpening(params) { // 当前期和下一期信息
    // const data = {
    //     id: params.id // 子级菜单
    // }
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/currentOpening',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function lastPrize(params) { // 最近一期开奖结果
    // const data = {
    //     id: params.id // 二级彩种id
    // }
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/lastPrize',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function oddsList(params) { // 获取赔率
    // const data = {
    //     lotteryId: params.lotteryId // 二级彩种id
    // }
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/oddsList',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function allMenu() { // 所有彩种
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/allMenu',
        method: 'post'
    })
}

export function getHistory(params) { // 历史开奖
    // const data = {
    //     lotteryId: params.lotteryId, // 二级彩种id
    //     page: params.page, // 当前页
    //     size: params.size, // 每页条数
    //     govPrizeDateBegin: params.govPrizeDateBegin, // 开始时间
    //     govPrizeDateEnd: params.govPrizeDateEnd // 结束时间
    // }
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/prizeHistoryPage',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function getOrderPage(params) { // 获取投注记录
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/orderPage',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function getGameRules(params) { // 获取游戏规则信息
    // const data = {
    //     lotteryId: params.lotteryId, // 二级彩种id
    // }
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/lotteryDesc',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function getPlayRule(params) { // 获取游戏规则信息
    // const data = {
    //     lotteryId: params.lotteryId, // 二级彩种id
    // }
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/playRuleDesc',
        method: 'post',
        data: qs.stringify(params)
    })
}


export function getCheckDetials(params) { // 结算详情
    // const data = {
    //     betTimeBegin: params.betTimeBegin, // 开始时间
    //     betTimeEnd: params.betTimeEnd, // 结束时间
    // }
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/settleForDay',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function getPostionInfo(params) { // 盘口信息
    // const data = {
    //     lotteryId: params.lotteryId, // 二级彩种id
    // }
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/front/h5/quota',
        method: 'post',
        data: qs.stringify(params)
    })
}

export function getTrentLst(params) { // 路子接口
    // const data = {
    //     lotteryId: params.lotteryId, // 二级彩种id
    //     betOn: params.betOn
    // }
    return request({
        baseURL: '/api', // 请求自己配的json
        url: '/cp4/front/h5/prizeTrend',
        method: 'post',
        data: qs.stringify(params)
    })
}


export function betOrder(params) { // 下注
    const data = {
        lotteryId: params.lotteryId, // 子级菜单
        betList: params.betList // 下注号码集合
    }
    return request({
        baseURL: '/api',
        url: '/cp4/front/pc/betOrder',
        method: 'post',
        data: data
    })
}


export function oddsAllList() { // 玩法赔率列表[全部]
    return request({
        baseURL: '/api',
        url: '/cp4/front/h5/oddsAllList',
        method: 'post'
    })
}


// export function getPostionInfo(params) { // 盘口信息
//     const data = {
//         lotteryId: params.lotteryId, // 二级彩种id
//     }
//     return request({
//         baseURL: '//192.168.60.237/mock/5cfcfbcbf8b9f00f129ae35d/H51',
//         url: '/cp4/front/h5/quota',
//         method: 'post',
//         data: data
//     })
// }