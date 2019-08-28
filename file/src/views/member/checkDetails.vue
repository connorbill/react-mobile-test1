<template lang="jade">
    .news-check
        vue-header
        .check-flex
            ul.check-count
                li(v-for="list, index in count", :class="activeCheck == list.count ? 'active' : ''", @touchend.prevent="getActive(list.count)") {{ list.name }}
            ul.check-title
                li(v-for="list, index in tite") {{ list }}
        ul.check-list(ref="checkListHeigth")
            li(v-for="list, index in setLeList", v-show="!isLoading", @touchend.prevent="gotoOrderPage(list.betDate, list.state)")
                span {{ list.betDate }}
                span {{ list.amount }}
                span {{ list.winLoss }}
            li(v-show="!isLoading")
                span 合计
                span {{ setTotal.totalAmount }}
                span {{ setTotal.totalWinLoss }}
            
            .noData(v-if="setLeList && setLeList.length == 0") 
                .content-box
                    svg-icon.none(icon-class="noneData")
                    span 暂无结算信息
            vue-loading-gif(v-show="isLoading")
</template>
<script>
import { mapState } from "vuex";
import header from '@/views/member/header'  // 头部
import loadingGif from '@/views/member/loadingGif' // loading
export default {
    name: 'CheckDetails', // 结算详情
    components: {
        "vue-header": header, // 头部组件
        'vue-loading-gif':loadingGif // loading
    },
    computed: {
        ...mapState({
            activeCheck: state => state.home.activeCheck, // 选中结算详情 7:最近七天, 0:本周, 1:上周
            setLeList: state => state.home.setLeList, // 结算详情列表
            setTotal: state => state.home.setTotal, // 结算详情总计
            isLoading: state => state.home.isLoading // 是否显示loading
        })
    },
    data() {
        return{  
           count: [
                    {'id':'0', 'name':'近7天', 'count':'7'},
                    {'id':'1', 'name':'本周', 'count':'0'},
                    {'id':'2', 'name':'上周', 'count':'1'},
                ],
           tite: ['日期','金额','输赢'],
           active: 7,
           topId:'' , // 用于切换tab时给来判断滚动条是否要初始化
        }
    },
    created() {

    },
    mounted() {
        this.getSaverTimeAsyn(this.activeCheck)
        // this.$store.dispatch('getActiveCheck', '7')
    },
    filters: {
        isEmpty: function(v) { //  判断是否为空
            if(v == undefined || v == '') {
                return '--'
            } else {
                return v
            }
        }
    },
    methods: {
        gotoOrderPage(betDate, state) {
            this.$store.dispatch('getFlagBack', false) // 是否点击返回键 false: 不是返回键， true:是返回键
            this.$router.push({name: 'orderPage', query:{'temp': '结算详情','from': 'checkDetails', 'betDate': betDate, 'state': state}})
        },
        getActive(id) { // 获取当前选中
            this.$store.dispatch('getIsLoading', true) // 显示loading
            this.$store.dispatch('getActiveCheck', id)
            this.getSaverTimeAsyn(id)
            if(this.topId != id) {
                this.$refs.checkListHeigth.scrollTop = 0
                this.topId = id
            }
            this.$store.dispatch('getFlagBack', false) // 是否点击返回键 false: 不是返回键， true:是返回键
            this.$router.push({name: 'checkDetails', query:{'id':2, 'menuIndex':id, 'temp':'结算详情', 'from':'memberCenter'}})
        },
        getSaverTimeAsyn(id) { // 获取服务器时间
            this.$store.dispatch('getSaverTimeAsyn', id).then((res) => {
                let st = res.content.serverTime, // 服务器时间
                    countTime = this.getDayCount(st, -6), // 获取近7天 本周 上周 开始及结束时间
                    start = null, // 开始时间
                    end = null // 结束时间
                id = id + ""
                switch (id) {
                    case '7':
                        start = countTime['Day7'].start
                        end = countTime['Day7'].end
                        break;
                    case '0':
                        start = countTime['thisWeek'].start
                        end = countTime['thisWeek'].end
                        break;
                    case '1':
                        start = countTime['lastWeek'].start
                        end = countTime['lastWeek'].end
                        break;
                    default:
                        break;
                }
                this.getCheckDetials(start, end)
            })
        },
        getDateStr(st, addDayCount) { // 最近n天 st:服务器时间, addDayCount:前n天
            let now = new Date(st);
            now.setDate(now.getDate() + addDayCount); //获取AddDayCount天后的日期
            let y = now.getFullYear(), // 当前年
                m = now.getMonth() + 1, // 当前月1: 补0开始
                d = now.getDate() // 当前日
            return y + "-" + m + "-" + d;
        },
        getDayCount(t, addDayCount) { // 获取最近七天本周上周时间 t:服务器时间, addDayCount：近n天
            let st = t.replace(/-/g, "/"), // IE,safari时间格式兼容
                now = new Date(st), // 实例化当前时间 服务器时间为准
                nowDayOfWeek = now.getDay(), // 今天本周的第几天
                nowDay = now.getDate()
            let weekStart = this.getDateStr(st, - nowDayOfWeek + 1) + ' ' + '00:00:00', // /获得本周的开始日期
                weekEnd = this.getDateStr(st, 7 - nowDayOfWeek) + ' ' + '23:59:59', // 获得本周的结束日期
                lastWeekStart = this.getDateStr(st, - now.getDay(0) - 6) + ' ' + '00:00:00', // /获得本周的开始日期
                lastWeekEnd = this.getDateStr(st, (- now.getDay(0))) + ' ' + '23:59:59' // 获得本周的结束日期
    
            let foremaDay7Start = this.getDateStr(st, addDayCount) + ' ' + '00:00:00', // 格式化最近七天的开始日期
                foremaDay7End = this.getDateStr(st, 0) + ' ' + '23:59:59' // 格式化最近七天的结束日期
            let data = { // 返回数据
                        'thisWeek': {'start': weekStart, 'end': weekEnd}, // 本周开始结束时间
                        'lastWeek': {'start': lastWeekStart, 'end': lastWeekEnd}, // 上周开始结束时间
                        'Day7': {'start': foremaDay7Start, 'end': foremaDay7End}, // 最近七天的开始结束时间
                       }
            return data
        },
        getCheckDetials(start, end) { // 获取结算详情 start:开始时间 end:结束时间
            let s = start.replace(/\//g, '-'), // 转为后面需要的格式 2019-7-15 00:00:00
                e = end.replace(/\//g, '-'), // 转为后面需要的格式 2019-7-15 00:00:00
                params = {
                    beginTime: s, // 开始时间
                    endTime: e // 结束时间
                }
            this.$store.dispatch('getCheckDetials', params)
        }
    },
    destroyed() { // 组件销毁时清除定时器

    }
}
</script>

<style lang="stylus" scoped>
@import "../../assets/stylus/blue"
.active
    color $date-active-font
    border 0.01rem solid $date-active-font!important
    font-weight bold
.check-flex
    position fixed
    top 0.44rem
    left 0rem
    background $allmenu-bg
    padding 0 0.14rem
    padding-top 0.16rem
    width 100%
    -webkit-overflow-scrolling touch
.check-count
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    text-align center
    align-items center
    width 3.47rem
    margin 0 auto
    color $order-font
    li
        border 0.01rem solid $odds-line
        width 33%
        border-radius 0.05rem 0 0 0.05rem
        line-height 0.3rem
        font-size 0.15rem
        cursor pointer
        &:nth-child(1)
            width 34%
        &:nth-child(2)
            border-radius 0rem 0rem 0rem 0rem
            border-left none
            border-right none
        &:nth-child(3)
            border-radius 0rem 0.05rem 0.05rem 0rem
.check-title
    margin 0.12rem auto 0
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    text-align center
    align-items center
    background $order-tit-bg
    border-bottom 0.01rem solid $odds-line
    li
        line-height 0.4rem
        font-size 0.15rem
        width 30%
        color $order-title-font
        &:nth-child(1)
            width 40%
.check-list
    margin-top 1.44rem
    height calc(100vh - 1.45rem)
    overflow auto
    padding 0 0.14rem
    li
        margin 0rem auto
        display flex
        flex-wrap wrap
        justify-content flex-start
        flex-direction row
        text-align center
        align-items center
        border-bottom 0.01rem solid $odds-line
        span
            line-height 0.4rem
            font-size 0.14rem
            color $order-tit-font
            white-space nowrap
            text-overflow ellipsis
            overflow hidden
            width 30%
            &:nth-child(1)
                width 40%
        &:nth-last-of-type(1)
            a
                border-bottom none

</style>