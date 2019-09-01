import axios from 'axios'
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 300000 // 请求超时时间
})

service.interceptors.request.use(
  config => {
    // Do something before request is sent
    config.headers.channel = 'H5';
    if (localStorage.getItem('token')) {
      config.headers.authtoken = localStorage.getItem('token');
    }
    console.log(config)
    return config
  },
  error => {
    Promise.reject(error)
  }
)


// response 拦截器
service.interceptors.response.use(
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
          // 弹框提示
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
            localStorage.removeItem('token');
            // 提示，跳转链接

            return
          }
          if (!res.success) { // 如果获取不到成功信息
            res = '后台系统出错，请联络系统管理员'
            return
          }
          // 提示
          return res
        }
      }
    } else {
      let sarr5 = [502] // 服务器错误
      if (sarr5.includes(response.status) == true) {

        // 提示
        return
      }

      // 提示
    }
  },
  error => {
    loadingHidden() // 去掉Loading加载
    if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串

      // 提示
      return Promise.reject(error); // reject这个错误信息
    }
    return Promise.reject(error);
  }
)

export default service
