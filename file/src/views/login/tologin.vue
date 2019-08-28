<template lang="jade">
    div.quitSkipImg
        img(src='../../assets/images/home/quitSkipImg.jpg')
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'tologin',
    data() {
        return {}
    },
    created(){
        //  Cookies.remove('flag') // 清除cookies 路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
    },
    mounted() {

    },
    methods:{
    }
}
</script>

<style lang="stylus" scoped>
.quitSkipImg
    img
        width 100vh
        height 100vh
        position relative
        z-index 99999

</style>
