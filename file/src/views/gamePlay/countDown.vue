<template lang="jade">
    header.count-res-down-wrap
        .header
            vue-goBack
            span.lottery-name {{ curSubMenuName }}
            span(class="more", @touchend.prevent="goMember()")
                svg-icon(icon-class="more")
        .count-res-down
            //- div {{curDisable}}
            .count-res
                .cr-issue 【 {{ lastIssue }} 期 】开奖结果 :
                //- 非香港彩
                div.count-ball(v-if = "curParMenu != 'HK' ", :class="'count-ball-' + curParMenu")
                    em(v-for="list,index in lastResultNumger")
                        span(v-if="curParMenu != 'FT'", :class="'ball-color' + list.ballValue") {{ list.ballValue }}
                        img(v-if="curParMenu == 'FT'", :src="'../../../static/images/dice' + list.ballValue + '.png'")
                //- 香港彩
                div.count-ball(v-if = "curParMenu == 'HK' ", :class="'count-ball-' + curParMenu")
                    em(v-for="list,index in lastResultNumger", v-if=" index <= 5 ")
                        span(:class="list.color") {{ list.ballValue }}
                        span(v-if="index == 5") +
                        span {{ list.shengxiao }}
                    em(v-for="list,index in lastResultNumger", v-if=" index == 6 ")
                        span(:class="list.color") {{ list.ballValue }}
                        span {{ list.shengxiao }}
            .count-down-wrap
                div.fenpan(v-show="isStop == true")
                    p  {{ countDownTime }}
                .cr-issue 距【 {{ curIssue }} 期 】 截止投注时间 :
                div.count-down(v-show="isStop == false")
                    p(v-show="curParMenu == 'HK'")
                        span(:class = "'countDownNumb' + countDownDD0")
                        span(:class = "'countDownNumb' + countDownDD1")
                        span.colon
                    p
                        span(:class = "'countDownNumb' + countDownHH0")
                        span(:class = "'countDownNumb' + countDownHH1")
                        span.colon
                    p
                        span(:class = "'countDownNumb' + countDownSS0")
                        span(:class = "'countDownNumb' + countDownSS1")
                        span.colon
                    p
                        span(:class = "'countDownNumb' + countDownMM0")
                        span(:class = "'countDownNumb' + countDownMM1")
        .balance ￥{{ balance }}
        .member-wrap(:class="showMember? 'show-member' : 'hid-member'")
            .count-header
                svg-icon.logo-icon(icon-class="logo1", @touchend.prevent="goHome")
                svg-icon(icon-class="cancel", @touchend.prevent="close")
            vue-member(:class="showMember == true ? 'show-member' : ''")
</template>

<script>
import { mapState } from "vuex";
import { currentOpening, lastPrize } from '@/api/home' // 获取中奖榜单
import member from '@/views/home/member'  // 个人中心
import goBack from "@/views/common/goBack" // 返回上一页
export default {
    name: 'CountDown',
    components: {
        'vue-member': member, // 个人中心
        'vue-goBack': goBack, // 返回上一页
    },
    computed: {
        ...mapState({
            balance: state => state.home.balance, // 余额
            serviceTime: state => state.home.serviceTime, // 服务器时间
            curSubMenu: state => state.home.curSubMenu, // 当前子菜单CODE
            curSubMenuId: state => state.home.curSubMenuId, // 当前子菜单ID
            curSubMenuName: state => state.home.curSubMenuName, // 当前子菜单中文名
            nextTime: state => state.home.nextTime, // 下期开奖时间
            curDisable: state => state.home.curDisable, // 当前期开盘状态
            curIssue: state => state.home.curIssue, // 当前可下注期号
            curParMenu: state => state.home.curParMenu, // 信息类一级彩种code
            urlFrom: state => state.home.urlFrom, // 路径来自哪个 路由
            allGameList: state => state.home.allGameList, // 获取所有游戏列表
            parMenuCurId: state => state.home.parMenuCurId, // 获取初始父级菜单Id
            showQuick: state => state.home.showQuick, // 投注快捷菜单是否显示 false:不显示， true:显示
            oddActive: state => state.home.oddActive, // 当前赔率初始全部设为false
            allOddActive: state => state.home.allOddActive, // 曾被选中所有赔率
            hotGameList: state => state.home.hotGameList, // 获取推荐游戏列表
            isSucceed: state => state.home.isSucceed, // 下注是否完成 true:已请求完, false:未请求完
        }),
    },
    data() {
        return {
            lastResultNumger: [], // 最近一期开奖结果 开奖结果
            lastIssue: '', // 最近一期开奖结果 开奖期号
            isStop: false, // 是否关盘
            countTime: null , // 倒计时差
            countDownTime: [], // 倒计时
            countDownDD0: null, // 倒计时天
            countDownDD1: null, // 倒计时天
            countDownHH0: null, // 倒计时小时
            countDownHH1: null, // 倒计时小时
            countDownSS0: null, // 倒计时分
            countDownSS1: null, // 倒计时分
            countDownMM0: null, // 倒计时秒
            countDownMM1: null, // 倒计时秒
            alltime: 0, // 倒计时，时间戳
            showMember: false, // 会员中心是否显示
            timer: null,  // 定时器当前期开盘
            lastPoll: null,  // 定时器最近一期开奖
            countDownPoll: null,  // 定时器倒计时
            flag_lastPoll: false,  // 最近期开奖期号是否完成 true:已请求完, false:未请求完
            flag_rentOpening: false,  // 当期开奖信息是否完成 true:已请求完, false:未请求完
        }
    },
    watch: {
        isSucceed: { // 下注是否完成 true:已请求完, false:未请求完
            handler: function (val, oldVal) { // 回调函数
                    if(val == true) { // 是否请求完成，true:已请求完, false:未请求完
                        this.getAccount() // 获取用户信息
                    }
                },
            immediate: true // 确认是否初始执行handler
        },
        flag_lastPoll: { // 最近期开奖期号是否完成 true:已请求完, false:未请求完
            handler: function (val, oldVal) { // 回调函数
                    if(val == true) { // 是否请求完成，true:已请求完, false:未请求完
                        this.lastPoll = setInterval(() => { // 倒计时信息
                            this.getLastPrize() // 获取最近期开奖期号
                        }, 3000)
                    }
                },
            immediate: true // 确认是否初始执行handler
        },
        flag_rentOpening: {  // 当前选中模板  -- 获取当前开奖信息
            handler: function (val, oldVal) { // 回调函数
                    if(val == true) { // 是否关盘，true:关盘， false：开盘
                        clearInterval(this.countDownPoll)  // 清除定时器
                        this.timer = setInterval(() => { // 【3秒】倒计时信息
                            if(this.flag_rentOpening == true) {
                                this.getCurRentOpening() // 获取当前开奖信息
                            }
                        }, 3000)
                        this.countDown(); // 倒计时
                    } else {
                        clearInterval(this.timer)  // 清除定时器
                    }
                },
            immediate: true // 确认是否初始执行handler
        },
        nextTime: { // 监听当期投注结束时间
            handler: function (val, oldVal) { // 回调函数
                    let isArr = val instanceof Array // 下期投注时间是否数组
                    if(isArr == true) {
                        let arr = this.nextTime,
                            ss = parseInt(arr[arr.length - 1] * 1000), // 秒
                            mm = parseInt(arr[arr.length - 2] * 60 * 1000), // 分
                            hh = parseInt(arr[arr.length - 3] * 60 * 60 * 1000), // 时
                            dd = parseInt(arr[arr.length - 4] * 60  * 60 * 24 * 1000) // 天
                        if(arr.length == 4){
                            this.countTime = ss + mm + hh + dd
                        }
                    } else {
                        if(this.nextTime == '已关盘') {
                            this.countTime = 0
                        }else {
                            if(!this.serviceTime || !this.nextTime) {
                                return
                            }
                            let timeDiff = Date.parse(this.delimiterConvert(this.nextTime)), // 当期投注结束时间
                                serviceTime = Date.parse(this.delimiterConvert(this.serviceTime)); // 服务器时间
                                this.countTime = timeDiff - serviceTime // 倒计时差
                        }
                    }
                    if((this.countTime <= 1000) == true || this.curDisable == true){
                        this.isStop = true
                    }else{
                        this.isStop = false
                    }
                    // this.countDownTime = this.getCountDown(this.countTime, this.curDisable)
                    return this.$store.state.home.nextTime
            },
            // depp: true, // 深度监听
            immediate: false // 确认是否初始执行handler
        },
        curDisable: {
            handler: function (val, oldVal) { // 回调函数
                if(val != oldVal && val) {
                    function delimiterConvert(timeVal) {  //格式化数据
                        return timeVal.replace('-','/').replace('-','/')
                    }
                    if(!this.serviceTime || !this.nextTime) {
                        return
                    }
                    let timeDiff = Date.parse(delimiterConvert(this.nextTime)), // 当期投注结束时间
                        serviceTime = Date.parse(delimiterConvert(this.serviceTime)); // 服务器时间
                    this.countTime = timeDiff - serviceTime // 倒计时差
                    if(isNaN(this.countTime) == true) { // 监听倒计时数据是否正常
                        this.$store.dispatch('getFlagDisable', false)
                        this.setFlagDis() // 处理偶发遮罩不清除
                    } else {
                        this.$store.dispatch('getFlagDisable', true)
                        // return
                    }
                    if(this.curDisable == undefined) {
                        this.isStop = true
                        return
                    }
                    if((this.countTime <= 1000) == true || this.curDisable == true){
                        this.isStop = true
                    }else{
                        this.isStop = false
                    }

                    // this.countDownTime = this.getCountDown(this.countTime,this.curDisable)
                    return this.$store.state.home.nextTime
                }
            },
            // depp: true, // 深度监听
            immediate: false // 确认是否初始执行handler
        }
    },
    filters: {

    },
    created() {

    },
    mounted() {
        this.getCurRentOpening() // 获取当前开奖信息
        this.getLastPrize()
        this.alltime = 0
    },
    methods: {
        getAccount() { // 获取用户信息
            this.$store.dispatch('getAccount')
        },
        goHome() { // 返回主页
            this.$store.dispatch('getCurGameList', this.hotGameList)  // 重置推荐记录游戏列表
            this.$store.dispatch('getMenuActive', 1) // 当前选中菜单
            this.$router.push({name: 'home', query:{'id':1, 'temp':'hotGames'}})
            this.$store.dispatch('getTempMenu', 'hotGames')
            this.$store.dispatch('getMenuActive', 1) // 当前选中菜单
        },
        initialization() { // 初始化清空下注项
            this.oddActive.forEach((ov, ok) => { // 当前选中项设置全部置为 false
                for(let v in ov) {
                    this.$set(this.oddActive[ok], v, false)  // 当前赔率初始全部设为false
                }
            })
            for(let v in this.allOddActive) { // 所有选中项设置全部置为 false
                this.allOddActive[v].forEach((dv, dk) => {
                    for(let di in dv) {
                        this.$set(this.allOddActive[v][dk], di, false)  // 所有选中赔率初始全部设为false
                    }
                })
            }
            this.$store.dispatch('getisSucceed',false) // 恢复下注状态
            this.$store.dispatch('getShowBetList', false) // 是否显示下注列表 false:不显示， true:显示
            this.$store.dispatch('getShowKeyboard', false) // 是否显示键盘 false:不显示， true:显示
            this.$store.dispatch('getReadyBetList',[]) // 清空下注项
            this.$store.dispatch('getTotalBets',0) // 清除下注条数
            this.$store.dispatch('getBetAmount',0) // 清空单注下注金额
            this.message = '' // 恢复下注按钮
            if(this.showQuick) { // 判断投注快捷菜单是否是显示的
                this.$store.dispatch('getBetShowBg', true) // 下注页背景层是否显示 true:显示，false:不显示
                return
            }
            this.$store.dispatch('getBetShowBg', false) // 下注页背景层是否显示 true:显示，false:不显示
        },
        close() { // 关闭会员中心
            this.showMember = false
            this.lastPoll = setInterval(() => { // 倒计时信息
                this.getLastPrize() // 获取最近期开奖期号
            }, 3000)
        },
        goMember() { // 显示员中心
            this.showMember = true
            // this.$router.push({name: 'home', query:{'id':1, 'temp':'hotGames'}})
            this.initialization()  // 初始化清空下注项
            this.getAccount() // 获取用户信息
            clearInterval(this.lastPoll)
            clearInterval(this.timer)
        },
        getCountDown(endTime, d) { // 通过服务器时间与下期开奖时间获取倒计时
            if(d == true) {
                clearInterval(this.countDownPoll)  // 清除定时器
                return '已关盘';
            }
            let days = parseInt(endTime / (1000 * 60 * 60 * 24)), // 天
                hours = parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),  // 小时
                minutes = parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)),  // 转分钟
                seconds = (endTime % (1000 * 60)) / 1000;  // 秒
            if(days <= 9) {
                days = "0" + days
            }
            if(hours <= 9) {
                hours = "0" + hours
            }
            if(minutes <= 9) {
                minutes = "0" + minutes
            }
            if(seconds<=9) {
                seconds = "0" + seconds
            }
            let DD = days.toString(),
                HH = hours.toString(),
                SS = minutes.toString(),
                MM = seconds.toString()

            this.countDownDD0 = DD.substring(0,1)
            this.countDownDD1 = DD.substring(1,2)
            this.countDownHH0 = HH.substring(0,1)
            this.countDownHH1 = HH.substring(1,2)
            this.countDownSS0 = SS.substring(0,1)
            this.countDownSS1 = SS.substring(1,2)
            this.countDownMM0 = MM.substring(0,1)
            this.countDownMM1 = MM.substring(1,2)
            if(endTime >= 86400000) {
                return [days,hours,minutes,seconds];
            }
            if(endTime >= 3600000) {
                return [hours,minutes,seconds];
            }
            if(endTime >= 60000) {
                return [minutes,seconds];
            }
            if(typeof(this.curDisable) == 'undefined') {
                this.$store.dispatch('getCurDisable', true) // 没有开盘状态，默认关盘
            }
            if((endTime < 1000) == true || this.curDisable == true){
                this.isStop = true
                this.$store.dispatch('getCurDisable', true) // 当前期已关盘
                clearInterval(this.countDownPoll)  // 清除定时器
                return '已关盘';
            }else{
                this.isStop = false
                this.$store.dispatch('getCurDisable', false) // 当前期已开盘
                return [days,hours,minutes,seconds];
            }
        },
        countDown() {  // 倒计时定时器
            this.countDownPoll = setInterval(() => {
                if(this.countDownTime.length <= 0) { // 如果不是时间格式
                    return
                }
                let arr = this.countDownTime,
                    ss = parseInt(arr[arr.length - 1] * 1000), // 秒
                    mm = parseInt(arr[arr.length - 2] * 60 * 1000), // 分
                    hh = parseInt(arr[arr.length - 3] * 60 * 60 * 1000), // 时
                    dd = parseInt(arr[arr.length - 4] * 60  * 60 * 24 * 1000) // 天
                    // alltime = 0;
                    if(arr.length == 4) {
                        this.alltime = ss + mm + hh + dd
                    }
                    if(arr.length == 3) {
                        this.alltime = ss + mm + hh
                    }
                    if(arr.length == 2) {
                        this.alltime = ss + mm
                    }
                    if(arr.length == 1) {
                        this.alltime = ss
                    }
                    this.alltime -= 1000
                    if(this.alltime >= 1000 && this.curDisable == false) {
                        this.countDownTime = this.alltime
                        this.isStop = false // 是否关盘 false: 关盘, true: 开盘
                        this.$store.dispatch('getCurDisable', false) // 当前期已开盘
                        this.countDownTime = this.getCountDown(this.countDownTime, false)
                    } else {
                        this.isStop = true // 是否关盘 false: 关盘, true: 开盘
                        this.countDownTime = '已关盘'
                        this.$store.dispatch('getCurDisable', true) // 当前期已关盘
                        clearInterval(this.countDownPoll)  // 清除定时器
                    }

            }, 1000)
        },
        getCurRentOpening() { // 获取当前开奖信息 -- 开盘信息
            this.flag_rentOpening = false // 当期开奖信息是否完成 true:已请求完, false:未请求完
            let params = {
                    // pid: this.pid, // 当前一级菜单
                    id: this.curSubMenuId // 当前子级菜单Id
                }
                currentOpening(params).then(response => {
                    let res = response;
                    if(res && res.success == 1) {
                        let n = res.content.currentOpening.gameNo, // 当前期号
                            t = res.content.currentOpening.endTime, // 投注结束时间
                            d = res.content.currentOpening.disable, // 当前开盘状态
                            b = res.content.balance, // 余额
                            s = res.content.serverTime // 服务器时间
                        this.isStop = d; // 初设开盘状态
                        this.$store.dispatch('getCurIssue', n) // 当前期号
                        this.$store.dispatch('getNextTime', t) // 投注结束时间
                        let timeDiff = Date.parse(this.delimiterConvert(t)), // 下期结束投注时间
                            serviceTime = Date.parse(this.delimiterConvert(s)) // 服务器时间
                            this.countTime = timeDiff - serviceTime
                            this.$store.dispatch('getCurDisable', d) // 当前期已关盘
                            this.$store.dispatch('getBalance', b) // 余额
                            this.$store.dispatch('getSaverTime', s) // 服务器时间
                            this.countDownTime = this.getCountDown(this.countTime, d)
                            this.flag_rentOpening = true // 当期开奖信息是否完成 true:已请求完, false:未请求完
                    } else { // 获取开奖信息失败

                    }
                })
        },
        getLastPrize() { // 最近期开奖期号--最新开奖结果
            let serviceTime = this.serviceTime,
                params = {
                    id: this.curSubMenuId // 当前子级菜单Id
                }
                lastPrize(params).then(response => {
                    let res = response;
                    this.flag_lastPoll = true // 最近期开奖期号是否完成 true:已请求完, false:未请求完
                    if(res && res.success == 1) {
                        this.lastResultNumger = res.content.prizeResult,  // 最近一期开奖结果 开奖结果
                        this.lastIssue = res.content.gameNo  // 最近一期开奖结果 开奖期号
                    } else { // 获取上一期开奖期号失败

                    }
                })
        },
        // getSaverTime() { // 获取服务器时间
        //     this.$store.dispatch('getSaverTime').then((res) => {
        //         this.getCurRentOpening() // 获取当前开奖信息
        //     })
        // },
        delimiterConvert(val) {  //格式化数据
            if (val) {
                return val.replace('-','/').replace('-','/')
            }
        },
        setFlagDis() { // 处理偶发遮罩不清除
            setTimeout(() => {
                this.$store.dispatch('getFlagDisable', true)
            }, 2000)
        }
    },
    destroyed() { // 组件销毁时清除定时器
        clearInterval(this.countDownPoll)
        clearInterval(this.lastPoll) // 清除定时器-- this.getLastPrize() // 获取最近期开奖期号--事件
        clearInterval(this.timer)  // 清除定时器 --  this.getCurRentOpening() // 获取当前开奖信息--事件
    }
}
</script>

<!-- 添加“scoped”属性以仅将CSS限制为此组件 -->
<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.countDownNumb0
    background-image url('./../../assets/images/number/00.png')
    background-size 78% auto
.countDownNumb1
    background-image url('./../../assets/images/number/01.png')
    background-size 78% auto
.countDownNumb2
    background-image url('./../../assets/images/number/02.png')
    background-size 78% auto
.countDownNumb3
    background-image url('./../../assets/images/number/03.png')
    background-size 78% auto
.countDownNumb4
    background-image url('./../../assets/images/number/04.png')
    background-size 78% auto
.countDownNumb5
    background-image url('./../../assets/images/number/05.png')
    background-size 78% auto
.countDownNumb6
    background-image url('./../../assets/images/number/06.png')
    background-size 78% auto
.countDownNumb7
    background-image url('./../../assets/images/number/07.png')
    background-size 78% auto
.countDownNumb8
    background-image url('./../../assets/images/number/08.png')
    background-size 78% auto
.countDownNumb9
    background-image url('./../../assets/images/number/09.png')
    background-size 78% auto
// .countDownNumb0
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 0px
//     transition background-position .5s
// .countDownNumb1
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -40px
//     transition background-position .5s
// .countDownNumb2
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -80px
//     transition background-position .5s
// .countDownNumb3
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -120px
//     transition background-position .5s
// .countDownNumb4
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -160px
//     transition background-position .5s
// .countDownNumb5
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -200px
//     transition background-position .5s
// .countDownNumb6
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -240px
//     transition background-position .5s
// .countDownNumb7
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -280px
//     transition background-position .5s
// .countDownNumb8
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -320px
//     transition background-position .5s
// .countDownNumb9
//     background-image url('./../../assets/images/number/0.png')
//     background-position 0 -360px
//     transition background-position .5s
.colon
    background-image url('./../../assets/images/number/colon.png')
    background-position 0 0px
    background-repeat no-repeat
    background-size 100% auto
.member-wrap
    z-index 101
    position fixed
    left 0
    width 100%
    background-color $menu-bg-color
    min-height 100vh
    -webkit-overflow-scrolling touch
.show-member
    bottom 0
    top 0
    left 0
    right 0
    transition bottom 0.5s ease-in
    padding-top 0.46rem
    min-height calc(100vh - 1rem)!important
    overflow auto
.hid-member
    bottom -110vh
    transition bottom 0.5s ease-out
.count-header
    height 0.5rem
    width 100%
    position absolute
    z-index 101
    top 0
    display flex
    flex-wrap wrap
    justify-content space-between
    flex-direction row
    text-align center
    align-items center
    svg:nth-child(1)
        width 1.3rem
        height 0.35rem
        margin-left 0.15rem
        margin-top 0.15rem
    svg:nth-child(2)
        width 12%
        height 0.2rem

// .goback
//     cursor pointer
//     float left
.count-res-down-wrap
    background $count-down-bg-color
    height 1.96rem
    border-radius 0px 0px 0.15rem 0.15rem
    position relative
    color $menu-font-color
    position fixed
    top 0
    width 100%
    z-index 10
    -webkit-overflow-scrolling touch
.header
    display flex
    flex-wrap wrap
    justify-content flex-start
    flex-wrap wrap
    flex-direction row
    text-align center
    line-height 0.46rem
    height 0.46rem
    // padding-top 0.05rem
    svg
        font-size 0.2rem
    span
        width 0.42rem
        &:nth-child(2)
            flex 1
            font-size 0.18rem
            font-weight 700
        &:nth-child(3)
            width 0.42rem
            margin-right 0.05rem
.count-res-down
    text-align center
.cr-issue
    line-height 0.2rem
    padding-bottom 0.03rem
    font-size 0.13rem
    color #ffffff !important
.count-ball
    margin 0rem auto 0.04rem
    display flex
    flex-wrap wrap
    justify-content center
    flex-wrap wrap
    flex-direction row
    align-items center
    height 0.48rem
    em
        margin-right 0.12rem
        &:nth-last-of-type(1)
            margin-right 0
        span
            display inline-block
            width 0.24rem
            height 0.24rem
            line-height 0.24rem
            border-radius 50%
            // margin 0.05rem 0.05rem
            font-size 0.14rem
            font-weight bold
        img
            width 0.25rem
            height 0.25rem
.count-down
    margin 0px auto
    display flex
    flex-wrap wrap
    justify-content center
    flex-wrap wrap
    flex-direction row
    align-items center
    p
        height 0.4rem
        span
            height 0.4rem
            line-height 0.4rem
            float left
            width 0.14rem
            text-align center
            font-weight bold
            background-repeat no-repeat
            background-position center
        .colon
            width 0.03rem
            height 0.11rem
            margin 0.15rem 0.12rem 0 0.12rem
.balance
    height 0.2rem
    line-height 0.2rem
    position absolute
    right 0
    bottom 0
    background $count-balance-color
    border-radius 0.15rem 0 0.15rem 0
    padding 0 0.1rem
// 香港彩
.count-ball-HK
    em
        display flex
        flex-direction column
        span
            &:nth-child(2)
                font-weight normal
        &:nth-child(6)
            flex-direction row
            flex-wrap wrap
            width 0.48rem
            margin-right 0
            span
                &:nth-child(2)
                    font-size 0.2rem
                &:nth-child(3)
                    font-weight normal

// pk10
.count-ball-PKT
    em
        margin-right 0.05rem

.fenpan
    position absolute
    width 100%
    height 0.7rem
    border-radius 0.08rem
    background $count-down-bg-color
    display block
    transition opacity 1s
    opacity 1
    top 0
    p
        line-height 0.7rem
        font-size 0.16rem
.count-down-wrap
    position relative
    .cr-issue
        margin-top 0.1rem
@media screen and (min-width:430px) and (max-width:2000px)
    .hid-member
        bottom -200vh
        transition bottom 0.5s ease-out
</style>
