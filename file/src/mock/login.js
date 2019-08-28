import { param2Obj } from '@/utils'
import userInfo from '@/assets/data/login/userinfo.json'
const userMap = {
    "code": 0,
    "msg": "请求数据成功",
    "token": '@integer(10000)',
    "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    "name": 'admin'
}

export default {
  loginByToken: config => { //获取用户名
    return userMap
  },
  getUserInfo: config => { //获取用户详细信息
    return userInfo
  },
  logout: () => 'success'
}
