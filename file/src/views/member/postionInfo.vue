// 盘口信息弹窗
<template lang="jade">
    .postion
        vue-header
        .postion-content-box
            ul.title
                li(v-for="item,index in title", :key = index) {{ item }}
            ul.postion-content.mb15(ref="postionContentHeigth", @touchend.prevent="changePos", :class="preventScroll")
                li(v-for = "item,index in postionInfo", :key = index, v-show="!isLoading")
                    div
                        span {{ item.betOnValue }}
                        span {{ item.singleMin }}
                        span {{ item.singleMax }}
                        span {{ item.gameNoMax }}
                vue-loading-gif(v-show="isLoading")
</template>
<script>
import { mapState } from "vuex";
import header from '@/views/member/header'  // 头部
import loadingGif from '@/views/member/loadingGif' // loading
export default {
    name: 'PostionInfo', // 盘口信息
    components: {
        "vue-header": header, // 头部组件
        'vue-loading-gif':loadingGif // loading
    },
    computed: {
        ...mapState({
            postionInfo: state => state.home.postionInfo, // 盘口信息集合
            scrollValue: state => state.home.scrollValue, // 滚动条滚动值
            initializeScroll: state => state.home.initializeScroll, // 是否初始化滚动条滚动值
            isLoading: state => state.home.isLoading, // 是否显示loading
            showAllMenu: state => state.home.showAllMenu, // 是否显示彩种选择 true:显示，false:不显示
        })
    },
    data() {
        return{
            title: [
                "类型名称",
                "单注最低",
                "单注最高",
                "当项最高",
            ],
            preventScroll:'', // 阻止遮罩层显示时底部盒子滚动
        }
    },
    created() {

    },
    mounted() {
    },
    watch: {
        scrollValue:{ // 监听滚动条滚动值
            handler:function (newVal,oldVal) { 
                if(this.scrollValue == 0 && this.initializeScroll == true) { 
                    this.$refs.postionContentHeigth.scrollTop = 0
                }
            },
            immediate:false
        }, 
        showAllMenu: { // 监听彩种选择弹窗显示  显示时阻止遮罩层底部的盒子滚动
            handler: function (newVal,oldVal) {
                if(newVal == true) {
                    this.preventScroll = 'preventScroll'
                }else {
                    this.preventScroll = ''
                }
            }
        },
    },
    filters: {

    },
    methods: {
        changePos(e) { /// 滑动事件
            let pathArr = e.path[3].scrollTop;
            this.$store.dispatch("getScrollValue", pathArr)
        }
    },
    destroyed() { // 组件销毁时清除定时器

    }
}
</script>

<style lang="stylus" scoped>
@import "../../assets/stylus/blue"
.postion-content-box
    padding 0 0rem
    .title
        background $handicap-titlebox-bg
        display flex
        padding 0 0.14rem
        padding-top 0.12rem
        position fixed
        top 0.44rem
        left 0
        width 100%
        -webkit-overflow-scrolling touch
        li
            line-height 0.4rem
            flex 1
            text-align center
            background $handicap-tit-bg
            border-bottom 0.01rem solid $handicap-tit-border
            color $order-tit-font
            font-size 0.15rem
            &::after
                content ""
                display inline-block
                width 0.01rem
                height 0.1rem
                background $order-tit-cut-off  
                float right 
                position relative
                top 0.15rem
            &:nth-child(4)
                &::after
                    content ""
                    display inline
                    width 0
    .postion-content
        margin-top 0.97rem
        height calc(100vh - 1rem)
        overflow auto
        li
            padding 0 0.14rem
            div
                border-bottom 0.01rem solid $handicap-tit-border
                display flex
                span 
                    flex 1
                    text-align center
                    line-height 0.4rem
                    color $order-tit-font
                    font-size 0.14rem
.mb15
    padding-bottom 2.5rem!important
// 遮罩层显示时阻止遮罩层底部的内容滚动
.preventScroll
    overflow hidden !important 
</style>