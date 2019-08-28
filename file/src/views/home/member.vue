<template lang="jade">
    article.member
        ul.member-acount
            li
                span 当前用户 ：
                span {{ userName }}
            li
                span 当前余额 ：
                span.coin ￥
                span.ma-font {{ balance }}
            li
                span 今日输赢 ：
                span.coin ￥
                span.ma-font {{ winLose }}
        ul.member-list
            li(v-for="list,index in menuList", @touchend.prevent="goToUrl(list.name, list.temp)")
                svg-icon.m-icon(:icon-class="list.icon")
                span {{ list.temp }}
            li(v-for="item,index in service", v-show="depositUrl", @touchend.prevent="changePage(depositUrl)", v-if="index == 0")
                a
                    svg-icon.m-icon(:icon-class="item.icon")
                    span {{ item.temp }}
            li(v-for="item,index in service", v-show="onlineService", @touchend.prevent="changePage(onlineService)", v-if="index == 1")
                a
                    svg-icon.m-icon(:icon-class="item.icon")
                    span {{ item.temp }}
            li(v-for="item,index in service", v-show="customerUrl", @touchend.prevent="changePage(customerUrl, item.temp)", v-if="index == 2")
                a
                    svg-icon.m-icon(:icon-class="item.icon")
                    span {{ item.temp }}
</template>

<script>
import { mapState } from 'vuex'
// import { account } from '@/api/home' // API router-link(:to="{ name: list.url, query:{'name':list.name}}")
export default {
    name: 'Member', // 会员中心
    computed:{
        ...mapState({
            balance: state => state.home.balance, // 余额
            winLose: state => state.home.winLose, // 当日输赢
            userName: state => state.home.userName, // 用户名
            onlineService: state => state.home.onlineService, // 在线客服连接
            depositUrl: state => state.home.depositUrl, // 充值连接
            customerUrl: state => state.home.customerUrl, // 商户连接地址

        }),
    },
    data() {
        return {
            'menuList':[
                    {'icon': 'history', 'temp': '历史开奖', 'name':'history'},
                    {'icon': 'betRecord1', 'temp': '投注记录', 'name':'orderPage'},
                    {'icon': 'settlement', 'temp': '结算详情', 'name':'checkDetails'},
                    {'icon': 'info2', 'temp': '盘口信息', 'name':'postionInfo'},
                    {'icon': 'rule', 'temp': '游戏规则', 'name':'gameRules'},
                ],
            service:[
                    {'icon': 'deposit', 'temp': '在线充值', 'name':''},
                    {'icon': 'customer','temp': '在线客服', 'name':''},
                    {'icon': 'home','temp': '退出游戏', 'name':''}
                ]
        }
    },
    watch: {

    },
    filters: {

    },
    created() {

    },
    mounted() {
        this.getAccount()
    },
    methods: {
        goToUrl(name, temp) { // name:连接的URL， temp:模板中文名
            this.$store.dispatch('getFlagBack', false) // 是否点击返回键 false: 不是返回键， true:是返回键
            this.$store.dispatch('getIsLoading',true) // 显示loading
            if(name == 'checkDetails') {
                this.$router.push({name: name, query:{'id':2, 'menuIndex':7, 'temp':temp, 'from':'memberCenter'}})
            } else {
                this.$router.push({name: name, query:{'id':2, 'temp':temp}})
            }

        },
        getAccount() { // 获取用户信息
            this.$store.dispatch('getAccount')
        },
        changePage(url, temp){ // url:跳转地址， temp:按扭名称 跳转在线充值  /  在线客服  /  退出游戏
            if(temp == '退出游戏') {
                this.$store.dispatch('getFlagalert', true) // 弹出框显示
                this.$store.dispatch('getAlertTit', '') // 弹出提示标题存状态库
                this.$store.dispatch('getAlertCon', '是否退出GG彩票平台') // 弹出提示内容存状态库
                this.$store.dispatch('getAlertIcon', "goback") // 弹出提示图标
                this.$store.dispatch('getAlertClass', 'center') // 弹出样式
                this.$store.dispatch('getAlertBut', '退出') // 弹出按扭文字
                let url = this.$store.getters.customerUrl // 商户连接
                    if(!url) {
                        let host = window.location.host // 获取host地址
                        url = host + '/#/login'
                    }
                this.$store.dispatch('getAlertUrl', url) // 商户连接
            } else {
                var reURL = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;
                if(url && url != '') {
                    if(url.match(reURL)) {
                        // window.location.href = url
                        window.open(url)
                    } else {
                       // window.location.href = 'http://' + url
                       window.open('http://' + url)
                    }
                    return
                }
            }

        }
    },
    destroyed() {

    }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.member
    // min-height 100vh
    background-color $menu-bg-color
    // overflow hidden
    width 100%
    // .logo-box
    //     margin-top 0.2rem
    //     padding 0.25rem
    //     .logo-img
    //         width 1.3rem
    //         height 0.4rem
    //     .cancel
    //         font-size 0.2rem
    //         color #ffffff
    //         float right
    .member-acount
        clear both
        color $menu-font-color
        width 3.25rem
        margin 0.8rem auto 0
        li
            color $menu-font-color
            line-height 0.26rem
            text-align left
            span
                padding-right 0.1rem
                font-size 0.14rem
            .coin
                font-size 0.12rem
                padding-right 0.01rem
                color $font-amount
        .ma-font
            color $font-amount
            font-weight bold
            font-size 0.17rem
    .member-list
        clear both
        padding-top 0.15rem
        width 3.25rem
        margin 0 auto

        li
            color $menu-font-color
            line-height 0.36rem
            display flex
            flex-wrap wrap
            justify-content flex-start
            flex-direction row
            text-align center
            cursor pointer
            &:nth-child(6)
                margin-top 0.5rem
            .m-icon
                padding-right 0.2rem
                font-size 0.2rem
                line-height 0.44rem
                height 0.44rem
                float left
            span
                padding-right 0.1rem
                font-size 0.16rem
                line-height 0.44rem
                height 0.44rem
            &:nth-child(5)
                // padding-bottom 0.3rem
.show-member
    .member-acount
        margin-top 0
.memberheard
    .member-acount
        margin-top 0
</style>
