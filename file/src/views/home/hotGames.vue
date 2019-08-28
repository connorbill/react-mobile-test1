<template lang="jade">
    article.hot-warp
        .noData(v-if="isNoData()") 
            .content-box
                svg-icon.none(icon-class="noneData")
                span 暂无历史记录
        .title(v-if="isNoData()")
            span ——   
            svg-icon.none.recommendsvg(icon-class="recommend") 
            span.titlespan  为你推荐
            span   ——
        ul.hot-games(:class="[tempMenu == 'classGames' ? 'mt7' : '', isNoData() ? 'mt0' : '']")
            li(v-for="list,index in curGameList", :key="index", :class="'bg-'+ list.code", @touchend.prevent="goCountDown(list)")
                //- router-link(:to="{ name: 'gamePlay', query:{'id':list.id, 'pcode':list.parentCode, 'code':list.code, 'temp':list.name, 'from':'countDown' }}")
                    //- div {{list.id}}
                p.flag {{ list.name | nameFiltration}}
                p.lottery-ball
                p.hot-text {{ list.name }}
                p(v-if="list.disable == false && list.endTime != '已关盘'")
                    //- 香港彩显示天和时
                    //- span(v-if="list.endTime[0] != '00' && list.parentCode === 'HK'") {{ list.endTime[0] }}
                    //- span(v-if="list.endTime[0] != '00' && list.parentCode === 'HK'")  : 
                    //- span(v-if="list.parentCode === 'HK'")  {{ list.endTime[1] }}
                    //- span(v-if="list.parentCode === 'HK'")  : 
                    //- 香港彩显示天
                    span(v-if="list.endTime[0] != '00' && list.parentCode === 'HK'") {{ list.endTime[0] }}
                    span(v-if="list.endTime[0] != '00' && list.parentCode === 'HK'")  : 
                    //- 香港彩的时和天为00，不展示 getlistdata
                    span(v-if="getlistdata(list.endTime,list.parentCode,isDD,isHH)") {{ list.endTime[1] }}
                    span(v-if="getlistdata(list.endTime,list.parentCode,isDD,isHH)")  :     
                    //- 非香港彩根据条件显示天和时
                    span(v-if="isDD==true && list.parentCode !== 'HK'") {{ list.endTime[0] }}
                    span(v-if="isDD==true && isHH==true && list.parentCode !== 'HK'")  : 
                    span(v-if="isHH==true && list.parentCode !== 'HK'")  {{ list.endTime[1] }}
                    span(v-if="isHH==true && isSS==true && list.parentCode !== 'HK'")  : 
                    span(v-if="isSS==true") {{ list.endTime[2] }}
                    span(v-if="isSS==true && isMM==true")  : 
                    span(v-if="isMM==true") {{ list.endTime[3] }}
                p(v-if="list.endTime == '已关盘'")
                    span  {{ list.endTime }}
                p {{ list.description }}
                p.online 在线 {{ list.online }} 人
</template>

<script>
import { mapState } from 'vuex'
// import { gameHotList } from '@/api/home' // API
export default {
    name: 'HotGame', // 热门游戏
    computed:{
        ...mapState({
            serviceTime: state => state.home.serviceTime, // 服务器时间
            tempMenu: state => state.home.tempMenu, // 显示菜单组件
            parMenuActiveId: state => state.home.parMenuActiveId, // 获取初始父级菜单选中INDEX 下标
            historyGameList: state => state.home.historyGameList, // 获取历史记录
        }),
        curGameList: { // 热门游戏
            get() {
                this.$store.state.home.curGameList = this.$store.state.home.curGameList.map((val, key) => {
                    if(val.disable == true || val.endTime == undefined) {
                        val.endTime = '已关盘'
                        if(val.endTime == undefined) {
                            // this.$store.dispatch('getFlagMenu', false) // 切换当前状态是否加载完 treu：正常，false：不正常
                        }
                    } else {
                        // this.$store.dispatch('getFlagMenu', true) // 切换当前状态是否加载完 treu：正常，false：不正常
                        let oTime = 0;
                        if(val.endTime.constructor === Array) {
                            let arr = val.endTime,
                                ss = parseInt(arr[arr.length - 1] * 1000, 10),
                                mm = parseInt(arr[arr.length - 2] * 60 * 1000, 10),
                                hh = parseInt(arr[arr.length - 3] * 60 * 60 * 1000, 10),
                                dd = parseInt(arr[arr.length - 4] * 60  * 60 * 24 * 1000, 10)
                                if(arr.length == 4){
                                    oTime = ss + mm + hh + dd
                                }
                                if(arr.length == 3){
                                    oTime = ss + mm + hh
                                }
                                if(arr.length == 2){
                                    oTime = ss + mm
                                }
                                if(arr.length == 1){
                                    oTime = ss
                                }
                                val.endTime = this.getCountDown(oTime) // 时间差转格式
                        } else {
                            if(!this.serviceTime) {
                                return
                            }
                            oTime = Date.parse(this.delimiterConvert(val.endTime)) // 下期开盘时间  
                            let sTime = Date.parse(this.delimiterConvert(this.serviceTime)), // 服务器时间
                                cTime = oTime - sTime  // 倒计时差 时间戳
                                if(cTime > 0) {
                                    this.isStop = false // 是否关盘
                                    val.endTime = this.getCountDown(cTime) // 时间差转格式
                                } else {
                                    this.isStop = true // 是否关盘
                                    val.endTime = '已关盘'
                                }
                        }
                    }
                    // console.log("val endTime---------",val)
                    // console.log("endTime---------",val.endTime)
                    return val
                })
                // console.log("curGameList-----------",this.$store.state.home.curGameList)
                return this.$store.state.home.curGameList
            },
            set(item) {
                return item
            }
        }
    },
    data() {
        return {
            isDD: false, // 是否有倒计时天
            isHH: false, // 是否有倒计时小时
            isSS: false, // 是否有倒计时分
            isMM: false, // 是否有倒计时秒
            isStop: false, // 是否关盘
            countDownTimes: null  // 倒计时定时器名称  
        }
    },
    filters: {
        nameFiltration: function (v)　{ // 过滤玩法中文名称截取地区字符
            let str = v.slice(0,2)
            return str
        },
    },
    watch: {
        tempMenu: {  // 当前选中模板
            handler: function (val, oldVal) { // 回调函数
                    window.clearInterval(this.countDownTimes) // 防止多个定时任务BUG
                    if(oldVal != val) {
                        let arr = ['hotGames','classGames', 'historyGames']
                        if(arr.includes(this.tempMenu) == true) {
                            this.countDown() // 重启定时任务
                        }
                    }
                },
            immediate: true // 确认是否初始执行handler
        },

    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
            getlistdata(endTime,parentCode,isDD,isHH){
                let bul = false
                if(parentCode === 'HK'){
                    if(endTime[0] == '00' && endTime[1] == '00'){ // 如果天与时为00着不展示
                        bul = false
                    }else{
                        bul = true
                    }
                    
                }
                return bul
            },
            isNoData() {
                if(this.tempMenu == 'historyGames' && this.historyGameList && this.historyGameList.length == 0) {
                    return true // 没有历史数据
                } else {
                    return false // 有历史数据
                }
            },
            goCountDown(list) { // 路由跳转 list:当前彩种集合
                this.$store.dispatch('getFlagBack', false) // 是否点击返回键 false: 不是返回键， true:是返回键
                this.$router.push({name: 'gamePlay', query:{'id':list.id, 'menuIndex':this.parMenuActiveId, 'pcode':list.parentCode, 'code':'list.code', 'temp':list.name, 'from':'countDown'}})
            },
            getCountDown(endTime) { // 通过服务器时间与下期开奖时间获取倒计时
                if(endTime < 0){
                    this.isStop = true
                    return  '已关盘'
                }
                let days = parseInt(endTime / (1000 * 60 * 60 * 24), 10), // 天
                    hours = parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 10),  // 小时
                    minutes = parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60), 10),  // 转分钟
                    seconds = (endTime % (1000 * 60)) / 1000;  // 秒
                if(days <=9) {
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
                if(endTime >= 86400000) {
                    this.isDD = true // 是否有倒计时天
                    this.isHH = true // 是否有倒计时小时
                    this.isMM = true // 是否有倒计时分
                    this.isSS = true // 是否有倒计时秒
                    return [days,hours,minutes,seconds];
                }
                if(endTime >= 3600000) {
                    this.isDD = false // 是否有倒计时天
                    this.isHH = true // 是否有倒计时小时
                    this.isMM = true // 是否有倒计时分
                    this.isSS = true // 是否有倒计时秒
                    return [days, hours, minutes, seconds];
                }
                if(endTime >= 60000) {
                    this.isDD = false // 是否有倒计时天
                    this.isHH = false // 是否有倒计时小时
                    this.isMM = true // 是否有倒计时分
                    this.isSS = true // 是否有倒计时秒
                    return [days, hours, minutes, seconds];
                }
                if(endTime < 0){
                    this.isDD = false // 是否有倒计时天
                    this.isHH = false // 是否有倒计时小时
                    this.isMM = false // 是否有倒计时天
                    this.isSS = false // 是否有倒计时小时
                    this.isStop = true
                    return '已关盘';
                }else{
                    this.isMM = true, // 是否有倒计时天
                    this.isSS = true // 是否有倒计时小时
                    return [days, hours, minutes, seconds];
                }
                return [days, hours, minutes, seconds];
            },
            countDown() {  // 倒计时定时器
                this.countDownTimes = window.setInterval(() => {
                    this.curGameList = this.curGameList.map((val,k) => {
                        if(val.endTime.length <= 0) { // 如果不是时间格式
                            return
                        }
                        let arr = val.endTime,
                            ss = parseInt(arr[arr.length - 1] * 1000, 10),
                            mm = parseInt(arr[arr.length - 2] * 60 * 1000, 10),
                            hh = parseInt(arr[arr.length - 3] * 60 * 60 * 1000, 10),
                            dd = parseInt(arr[arr.length - 4] * 60  * 60 * 24 * 1000, 10),
                            alltime = 0;
                            if(arr.length == 4){
                                alltime = ss + mm + hh + dd
                            }
                            if(arr.length == 3){
                                alltime = ss + mm + hh
                            }
                            if(arr.length == 2){
                                alltime = ss + mm
                            }
                            if(arr.length == 1){
                                alltime = ss
                            }
                            alltime -= 1000

                            if(alltime > 0){
                                val.endTime = alltime
                                val.endTime = this.getCountDown(val.endTime)
                            }else{
                                this.isDD = false // 是否有倒计时天
                                this.isHH = false // 是否有倒计时小时
                                this.isMM = false // 是否有倒计时天
                                this.isSS = false // 是否有倒计时小时
                                this.isStop = true // 是否关盘
                                val.endTime = '已关盘'
                            }
                    })
                }, 1000)
            },
            delimiterConvert(val) {  //格式化数据
                return val.replace('-','/').replace('-','/')
            }
        },
    destroyed() {
        // this.$store.dispatch('getAlertMenu', false ) // 菜单获取完毕
        window.clearInterval(this.countDownTimes) // 防止多个定时任务BUG
    }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.hot-warp
    margin-top 0.85rem
    margin-bottom 1.2rem
    // height calc(100vh - 0.5rem)
    // overflow-y auto
    .noData
        margin-top 1.2rem!important
        margin-bottom 0.5rem!important
        .content-box
            svg 
                margin-bottom 0
                width 1.6rem
                height 1.3rem
            span 
                font-size 0.14rem
.title
    font-size 0.2rem
    width 1.76rem
    margin 0 auto
    color $menu-font-color-active
    text-align center
    height 0.3rem  
    span 
        width 0.37rem
    .titlespan
        width 0.65rem
        font-weight bold
        font-size 0.18rem
    .recommendsvg    
        vertical-align middle
        font-size 0.26rem
.mt0
    margin-top 0!important
.hot-games
    display flex
    flex-wrap wrap
    justify-content flex-start
    flex-direction row
    text-align center
    width 3.5rem
    margin 0.38rem auto 0
    li
        cursor pointer
        width 1.1rem
        height 1.55rem
        margin-right 0.1rem
        margin-top 0.12rem
        background-repeat no-repeat
        background-size 100% 100%
        border-radius 0.05rem
        position relative
        color $menu-font-color
        p
            height 0.15rem
            line-height 0.15rem
        &:nth-child(3n +0)
            margin-right 0rem
        .flag
            width 0.3rem
            height 0.18rem
            line-height 0.18rem
            position absolute
            border-radius 0 0.03rem 0 0.05rem
            right 0
            top 0
            background $menu-flag
            color $menu-font-color
        .online
            color $menu-font-color-alpha
.lottery-ball
    height 0.9rem !important
.hot-text
    font-size 0.14rem    
    font-weight 700
.mt7
    margin-top 1.15rem
</style>