<template lang="jade">
    .datadialog
        .title 日期选择
        ul.date-list
            li(v-for="item,index in dateList", :key="index", @touchend.prevent="getCurDate(index, item.count)", :class='index == activeDate ? "active-date" : ""')
                span {{item.title}}
                svg-icon.activebet(icon-class="odds", v-show='index == activeDate')
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: "hkDataDialog",
    computed:{
        ...mapState({
           activeDate: state => state.home.activeDate, // 选中日期
           curSubMenuId: state => state.home.curSubMenuId, // 当前子级菜单Id
        })
    },
    data() {
        return {
            // dateArr: [] // 最近10天
            dateList:[
                {'title':'近三周','count':21},
                {'title':'近一个月','count':30},
                {'title':'近三个月','count':90},
                {'title':'近六个月','count':180},
                {'title':'近十二个月','count':365},

            ],
            active:0, // 选中的下标
        }
    },
    created() {

    },
    mounted() {
        // this.getTime()
    },
    methods: {
        getCurDate(i, num) { // 获取当前时间 i: 下标
            this.active = i
            this.$store.dispatch("getCurrentPage",0) // 每次切换开间区间时当前页码初始化
            this.getSaverTimeAsyn(num)
            this.$store.dispatch('getActiveDate', i) // 当前选中
            this.$store.dispatch('getHkShowDataDialog', false)  // 时间选择框 true:显示， false:不显示
            this.$store.dispatch('getShowBg', false) // 背景层是否显示 true:显示， false:不显示
            this.$store.dispatch("getNoMore",false) // 初始化是否已加载全部 
        },
        getHistory(starDate, endDate) { // 获取历史记录 
            this.$store.dispatch('getIsLoading',true) // 显示loading
            let params = {
                lotteryId: this.curSubMenuId, // 二级彩种id
                page: this.$store.state.home.currentPage, // 页码
                size: 20, // 每页条数
                govPrizeTimeBegin: starDate, // 开始时间
                govPrizeTimeEnd: endDate // 结束时间
            }
            this.$store.dispatch('getHistory', params)
        },
        getSaverTimeAsyn(id) { // 获取服务器时间
            this.$store.dispatch('getSaverTimeAsyn', id).then((res) => {
                let st = res.content.serverTime, // 服务器时间
                    countTime = this.getDayCount(st, -(id-1)), // 获取近n天 开始及结束时间
                    start = null, // 开始时间
                    end = null // 结束时间
                id = id + ""
                switch (id) {
                    case '21': // 近三周的开始和结束时间
                        start = countTime['Day'].start
                        end = countTime['Day'].end
                        break;
                    case '30': // 近一个月的开始和结束时间
                        start = countTime['Day'].start
                        end = countTime['Day'].end
                        break;
                    case '90': // 近三个月的开始和结束时间
                        start = countTime['Day'].start
                        end = countTime['Day'].end
                        break;
                    case '180': // 近六个月的开始和结束时间
                        start = countTime['Day'].start
                        end = countTime['Day'].end
                        break;
                    case '365': // 近十二个月的开始和结束时间
                        start = countTime['Day'].start
                        end = countTime['Day'].end
                        break;
                    default:
                        break;
                }
                this.$store.dispatch("getHkDateArrStore", {'start':start, 'end':end}) // 香港彩选中的时间范围存状态
                this.getHistory(start, end) // 调获取历史记录方法
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
        getDayCount(t, addDayCount) { // 获取最近n天时间 t:服务器时间, addDayCount：近n天
            let st = t.replace(/-/g, "/") // IE,safari时间格式兼容
            let foremaDay7Start = this.getDateStr(st, addDayCount) + ' ' + '00:00:00', // 格式化最近n天的开始日期
                foremaDay7End = this.getDateStr(st, 0) + ' ' + '23:59:59' // 格式化最近n天的结束日期
            let data = { // 返回数据
                        'Day': {'start': foremaDay7Start, 'end': foremaDay7End}, // 最近n的开始结束时间
                       }
            return data
        },
        // }
        
    }
};
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.active
    background $date-activebg
    color $date-active-font
    font-weight bold
.datadialog
    position fixed
    width 3.06rem
    height 2.6rem
    top 50%
    left 50%
    margin-left -1.53rem
    margin-top -2.2rem
    opacity 0
    visibility hidden
    background $allmenu-bg
    border-radius 0.08rem
    z-index 10
    -webkit-overflow-scrolling touch
.title
    background $parmenu-bg
    line-height 0.4rem
    border-radius 0.08rem 0.08rem 0 0
    width 100%
    position relative
    font-size .16rem
    span
        position absolute
        right 0.3rem
        top 0
        font-size .14rem
.date-list
    // margin-top 0.1rem
    padding 0.2rem 0.15rem
    display flex
    flex-wrap wrap
    justify-content space-between
    li
        line-height 0.38rem
        width 1.25rem !important
        border 0.01rem solid $odds-line
        border-radius 0.05rem
        margin-bottom 0.15rem
        box-shadow 0rem 0.02rem 0.05rem $odds-show
        position relative
        svg 
            position absolute
            top -0.02rem
            right -0.01rem
            width 0.15rem
            height 0.15rem
            border-radius 0 0.05rem 0.00rem 0
            color $count-active
        span    
            font-size 0.14rem 
.active-date
    border 0.01rem solid $count-active !important
    color $count-active !important
    font-weight bold
</style>
