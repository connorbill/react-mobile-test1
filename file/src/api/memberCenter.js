import request from '@/utils/request'

export function getCustomerService() { // 获取首页banner
    return request({
        baseURL: '//192.168.60.237/mock/',
        url: '/5ca84cc2ea866b0dc477bbd9/wap/getCustomerService',
        method: 'post'
    })
}

export function getAllLottery() { // 获取彩种分类接口
    return request({
        baseURL: '//192.168.60.237/mock/',
        url: '/5ca84cc2ea866b0dc477bbd9/wap/getAllLottery',
        method: 'post'
    })
}
export function getHistoricRecordList(res) { // 获取历史开奖,带分页
    let data = {
        lotteryId: res.lotteryId,
        page: res.page,
        size: res.size,
    }
    return request({
        baseURL: 'http://192.168.60.237/mock/',
        url: '/5ca84cc2ea866b0dc477bbd9/wap/getHistoricRecord',
        method: 'post',
        params: data
    })
}
export function getRecordList(res) { // 获取投注记录,带分页
    let data = {
        lotteryId: res.lotteryId,
        settleStatus: res.settleStatus,
        page: res.page,
        size: res.size
    }
    return request({
        baseURL: 'http://192.168.60.237/mock/',
        url: '/5ca84cc2ea866b0dc477bbd9/wap/getbetsRecord',
        method: 'post',
        params: data
    })
}

export function getBettingDetail(res) { // 获取结算详情,带分页
    let data = {
        settleDateBegin: res.settleDateBegin,
        settleDateEnd: res.settleDateEnd,
        page: res.page,
        size: res.size
    }
    return request({
        baseURL: 'http://192.168.60.237/mock/5ca84cc2ea866b0dc477bbd9/wap/',
        url: '/cp4/front/h5/settleForDay',
        method: 'post',
        params: data
    })
}
export function getPanKouInfo(res) { // 获取盘口信息,带分页
    let data = {
        lotteryId: res.lotteryId,
        page: res.page,
        size: res.size
    }
    return request({
        baseURL: 'http://192.168.60.237/mock/5ca84cc2ea866b0dc477bbd9/wap/',
        url: '/cp4/front/h5/quota',
        method: 'post',
        params: data
    })
}
export function getRulelistContent(res) { // 获取游戏规则
    let data = { lotteryId: res.lotteryId }
    return request({
        baseURL: 'http://192.168.60.237/mock/5ca84cc2ea866b0dc477bbd9/',
        url: '/wap/getRuleDescription',
        method: 'post',
        params: data
    })
}