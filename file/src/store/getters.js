const getters = {
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  token: state => state.user.token,
  flag_back: state => state.home.flag_back, // 是否点击返回键
  depositUrl: state => state.home.depositUrl, // 充值连接
  customerUrl: state => state.home.customerUrl, // 商户连接
  flag_urlParameter: state => state.home.flag_urlParameter, //  路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
  getLotteryPoll: state => state.home.getLotteryPoll // 彩种定时任务
}
export default getters