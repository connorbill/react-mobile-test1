/**
 * Created by jiachenpan on 16/11/18.
 */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// export function validUsername(str) {
//   const valid_map = ['admin', 'editor']
//   return valid_map.indexOf(str.trim()) >= 0
// }

/* 用户名验证*/
export function validatName(str) {
	const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{1,15}$/;
	return reg.test(str);
}
/* 新增用户名验证*/
export function addValidatName(str) {
  const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{2,15}$/;
  return reg.test(str);
}
/* 页面地址验证*/
export function pageUrl(str) {
  const reg = /^\/(\w+\/?[^._]+|.*\.\w|\/\w)+$/;
  return reg.test(str);
}

/* 修改用户密码验证*/
export function validatePwd(str) {
  const reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{4,15}$/;
  return reg.test(str);
}
/* 内网IP地址验证*/
// export function punlicIpArea(newPwd){
//   const re = /^(127\.0\.0\.1)|(localhost)|(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.((1[6-9])|(2\d)|(3[01]))\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})$/
//   return re.test(newPwd);
// }

/* IP地址验证*/
export function ipArea(newPwd){
  const re = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return re.test(newPwd);
}

/* 合法uri*/
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}
/*中文英文字母数字*/
export function validateUserName(str){
  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
  return reg.test(str)
}

/* 验证用户名长度 */
export function validUserNameLen(str){
  const reg = /^[0-9a-zA-Z]{2,15}$/;
	return reg.test(str);
} 
/* 小写字母*/
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/* 七位字符、保留两位小数、只支持数字*/
export function validsevendata(str) {
  //  const reg = /^[1-9]$/
 const reg = /(^\d{1,4}([\.]{1}\d{1,2})?$)|(^\d{1,7}$)/
  return reg.test(str)
}
