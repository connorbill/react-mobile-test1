<template lang="jade">
    .datadialog
        .title 日期选择
            span 近10日
        ul.date-list
            li(v-for="item,index in dateArrStore",:key="index", :class="activeDate === index ? 'active' : ''", @touchend.prevent="getCurDate(index)")
                span {{item.year}} 年
                span {{ item.month }}月{{item.day}}日 {{ index == 0 ? '(今日)' : '' }}
                span {{item.week}}
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: "dataDialog",
    computed:{
        ...mapState({
           dateArrStore: state => state.home.dateArrStore, // 最近10天
           activeDate: state => state.home.activeDate, // 选中日期
           curSubMenuId: state => state.home.curSubMenuId, // 当前子级菜单Id
        })
    },
    data() {
        return {
            dateArr: [] // 最近10天
        }
    },
    created() {

    },
    mounted() {
        this.getTime()
    },
    methods: {
        getCurDate(i) { // 获取当前时间 i: 下标
            this.$store.dispatch("getCurrentPage",0) // 每次切换开间区间是当前页码初始化
            this.$store.dispatch('getActiveDate', i) // 当前选中
            this.getHistory() // 获取历史记录
            this.$store.dispatch('getShowDataDialog', false)  // 时间选择框 true:显示， false:不显示
            this.$store.dispatch('getShowBg', false) // 背景层是否显示 true:显示， false:不显示
            this.$store.dispatch("getNoMore",false) // 初始化是否已加载全部 
        },
        getHistory(id) { // 获取历史记录 id:当前子菜单ID
            this.$store.dispatch('getIsLoading',true) // 显示loading
            let d = this.dateArrStore[this.activeDate], // 当前时间
                curDate = d.year + '-' + d.month + '-' + d.day,
                starDate = curDate + ' ' + '00:00:00',
                endDate = curDate + ' ' + '23:59:59'
            if(!id) { // 如果未传ID 则为默认ID
                id = this.curSubMenuId
            }
            let params = {
                lotteryId: id, // 二级彩种id
                page: this.$store.state.home.currentPage, // 页码
                size: 20, // 每页条数
                govPrizeTimeBegin: starDate, // 开始时间
                govPrizeTimeEnd: endDate // 结束时间
            }
            this.$store.dispatch('getHistory', params)
        },
        changweek(val) { // 格式化日期周显示
            switch (val) {
                case "0":
                    return '周日'
                    break;
                case "1":
                    return '周一'
                    break;
                case "2":
                    return '周二'
                    break;
                case "3":
                    return '周三'
                    break;
                case "4":
                    return '周四'
                    break;
                case "5":
                    return '周五'
                    break;
                case "6":
                    return '周六'
                    break;
            }
        },
        getTime() { // 最近10天
            this.dateArr = []; // 重置最近10天数据
            let myDate = new Date(); //获取当天日期
                myDate.setDate(myDate.getDate() - 9); // 将日期设为10天前的时间戳
            let dateArray = [], // 临时存放最近10天数组
                dateTemp,       // 临时年月日字符串
                flag = 1;  // 修改从0开始
            for (var i = 0; i < 10; i++) { // 获取最近十天的日期
                let a = myDate.getFullYear() + '-'; // 最近十天的年份
                let b = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) + "-" : (myDate.getMonth() + 1) + "-"; // 最近十天的月份
                let c = myDate.getDate() < 10 ? '0' + myDate.getDate()+"-" + myDate.getDay() : myDate.getDate() + "-" + myDate.getDay(); // 最近十天的日期
                dateTemp = a + b + c; // 时间格式字符串组合
                dateArray.push(dateTemp); 
                myDate.setDate(myDate.getDate() + flag);
            }
            let a = {
                        year: '', // 年
                        month: '', // 月
                        day: '', // 日
                        week: '' // 周
                    };
            let b = [];
            for(var j = 0; j < dateArray.length; j++) {
                b.push(dateArray[j].split('-'));
            }
            for(var t = 0; t < b.length; t++){ // 拆分到一个对象里面，再push到一个数组里
                a = {
                    year: b[t][0], // 年
                    month: b[t][1], // 月
                    day: b[t][2], // 日
                    week: this.changweek(b[t][3]) // 周
                };
                this.dateArr.push(a);
            }
            // this.dateArr.sort(function(a, b) {  // 时间倒序排列
            //     return b.month > a.month ? 1 : -1;
            // });
            // Array.reverse() --数组倒序函数reverse() (实现数组倒序功能)
            this.$store.dispatch('getDateArrStore', this.dateArr.reverse())
            this.$store.dispatch('getActiveDate', 0) // 当前选中
        }
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
    height 4.36rem
    top 50%
    left 50%
    margin-left -1.53rem
    margin-top -2.22rem
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
    margin-top 0.05rem
    li
        display flex
        justify-content space-between
        flex-wrap wrap
        flex-direction row
        line-height 0.38rem
        font-size .14rem
        padding 0 0.1rem
        border-bottom 0.01rem solid $odds-line
        border-radius 0 0 0.08rem 0.08rem
        &:last-child
            border-bottom none
        span
            font-size .14rem
            text-align center
            &:nth-child(1)
                width 0.8rem
            &:nth-child(2)
                flex 1
            &:nth-child(3)
                width 0.8rem
</style>
