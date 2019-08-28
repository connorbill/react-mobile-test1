<template lang="jade">
    .trend(ref="trendHeigth")
        div.trend-content(v-for="item, index in theTrentList", :key="index", v-show="!isLoading")
            p {{ item.category }}
            ul  
                li(v-for="i,v in item.prizeValueList", :key="v" )
                    span(v-for="s,j in i", :key="j") 
                        em.ball-small(v-if="s.length == 1", :class="jadgeColor(s, index, v, j)") {{ s }}
                        svg-icon.ball-small(v-else, :class="jadgeColor(s, index, v, j)", :icon-class="s | addSvg")
                    span(v-if="i.length < 2")
                    span(v-if="i.length < 3")
                    span(v-if="i.length < 4")
                    span(v-if="i.length < 5")
                    span(v-if="i.length < 6")
        vue-loading-gif(v-show="isLoading")
        .noData(v-if="theTrentList && theTrentList.length == 0") 
            .content-box
                svg-icon.none(icon-class="noneData")
                span 该玩法暂无路子
</template>
<script>
import { mapState } from 'vuex'
import loadingGif from '@/views/member/loadingGif' // loading
export default {
    name: "Trend", // 路子
    components: {
        'vue-loading-gif':loadingGif // loading
    },
    computed:{
        ...mapState({
            theTrentList: state => state.home.theTrentList, // 二级玩法ID, // 请求到的路子
            quickActiveCode: state => state.home.quickActiveCode, // 投注弹窗选中的tab切换code
            isLoading: state => state.home.isLoading // 是否显示loading
        })
    },
    data() {
        return {
           trendBallCall:'', // 路子球色
        }
    },
    watch:{
        quickActiveCode:{
            handler:function (newVal,oldVal) {
                if(newVal == "trend") {
                    this.$refs.trendHeigth.scrollTop = 0
                }
            }
        }
    },
    filters: {
        addSvg(svg) {  // svg名称
            if(svg.length == 2) {
                if(svg == '大单') { return 'dd' }
                if(svg == '半顺') { return 'bs' }
                if(svg == '小单') { return 'xd' }
                if(svg == '对子') { return 'dz' }
                if(svg == '杂六') { return 'zl' }
                if(svg == '大双') { return 'ds' }
                if(svg == '顺子') { return 'sz' }
                if(svg == '小双') { return 'xs' }
                if(svg == '豹子') { return 'bz' }
            }
        }
    },  
    mounted(){
    },
    methods: {
        jadgeColor(s, i, v, j) { // s: 下注项如:大，单，小，双; i: 路子下标， v:行数, j:列数
            let list = this.theTrentList[i].prizeValueList, // 当前路子集合
                maxRow = list.length - 1, // 最大行数
                maxColumn = list[maxRow].length - 1, // 最大列数
                red = ['大', '单', '虎', '大单','东','中','半顺','红'], //  红球
                bule = ['小','双', '龙','小单','南','发','对子','蓝'], // 蓝球
                green = ['和','杂六','绿'], // 绿球
                purple = ['大双','西','白','顺子'], // 紫球
                pink = ['小双','北'], // 粉球
                orange = ['豹子'] // 黄球
            if((v == maxRow) && j == maxColumn ) {  // 最大行数，最大列为最新，灰球
                return 'GRAY'  // 灰球
            }
            if(red.includes(s)) {  // 红球
                return 'RED'  
            }
            if(bule.includes(s)) { // 蓝球
                return 'BLUE'  
            }
            if(green.includes(s)) { // 绿球
                return 'GREEN'  
            }
            if(purple.includes(s)) { // 紫球
                return 'PURPLE'  
            }
            if(pink.includes(s)) { // 粉球
                return 'PINK'  
            }
            if(orange.includes(s)) { // 黄球
                return 'ORANGE'  
            }
               
        },
    }
};
</script>

<style scoped lang="stylus">
@import "../../../assets/stylus/blue";
.trendSvg
    width 0.22rem
    height 0.22rem
    margin-top 0.03rem
.trend
    height calc(100vh - 1.9rem)
    overflow auto
    padding 0.15rem 0
.trend-content
    margin-bottom 0.16rem
    p
        width 3.49rem
        height 0.24rem
        line-height 0.26rem
        text-align center 
        color $trent-title-font
        background-color $trent-title-bg
        margin auto
    ul
        display flex
        flex-direction row
        flex-wrap nowrap
        justify-content space-between
        width 3.49rem
        box-sizing border-box
        margin auto
        li    
            display flex
            flex-direction column
            border-left 0.01rem solid $odds-line
            flex 1
            &:nth-last-of-type(1)
                border-right 0.01rem solid $odds-line
            span 
                display flex
                height 0.28rem
                border-bottom 0.01rem solid $odds-line
                text-align center 
                color $menu-font-color
                &:nth-child(1)
                    border-top 0.01rem solid $odds-line
                .svg-icon
                    margin auto
                em
                    margin auto
</style>
