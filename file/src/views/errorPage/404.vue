<template lang="jade">
    .login-container
        .tit GG彩票平台代理商游戏用户登录
            ul
                li
                    span * 帐号:
                    span 
                        input(type='text', @keyup.enter.native='submitForm', v-model='ruleForm.accout', auto-complete='off', placeholder='请输入用户名', maxlength='12', @blur='accoutBlur', clearable='')
</template>

<script>
export default {
    name: 'Login',
    components: { },
    data() {
        return {
            isClick: true  //判断是否可以点击
        }
    }
}
</script>

<style lang="stylus">
.electron
    position relative
</style>