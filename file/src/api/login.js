import request from '@/utils/request'
import qs from 'qs'

// export function loginByToken(paramenters) {
//     const data = {
//         hashCode: paramenters.hashCode, // 代理商账号
//         command:  paramenters.command, //  登录命令
//         version:  paramenters.version, // 接口版本号
//         data:  paramenters.data // 设备端
//     }
//     return request({
//         baseURL: '/openapi', // 请求自己配的json
//         url: '/app/test',
//         method: 'post',
//         data: qs.stringify(data)
//     })
// }

export function loginByToken(paramenters) {
    const data = {
        userName: paramenters.userName, // 代理商帐号
        password:  paramenters.password, // 代理商密码
        gameName:  paramenters.gameName, // 游戏用户名称
        device:  paramenters.device, // 设备端
        parentGame: paramenters.parentGame, // 父级彩种
        childGame: paramenters.childGame // 子级彩种
    }
    return request({
        baseURL: '//192.168.60.237/mock/', // 请求自己配的json
        url: '/5ca84cc2ea866b0dc477bbd9/wap/login',
        method: 'post',
        data: data
    })
}

export function logout() {
    return request({
        url: '/login/logout',
        method: 'post'
    })
}

export function getUserInfo(token) {
    return request({
        baseURL: '//192.168.60.237/mock/', // 请求自己配的json
        url: '/5ca84cc2ea866b0dc477bbd9/wap/info',
        method: 'post',
        headers: {
          'Authorization': token,
        }
    })
}