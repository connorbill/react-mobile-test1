<template lang="jade">
    .news-rules(:class="from == 'countDown' ? 'rules-countDown' : ''")
        .rules-header(v-show="from != 'countDown'")
            vue-header
        .rules-content-box
            .rules-title 规则说明
            div.rules-content(ref="getGameRulesScroll", :class="preventScroll")
                .mb15(v-html="curGameRules", v-show="!isLoading") 
                vue-loading-gif(v-show="isLoading")
</template>
<script>
import { mapState } from "vuex";
import header from '@/views/member/header'  // 头部
import { stat } from 'fs';
import loadingGif from '@/views/member/loadingGif' // loading
export default {
    name: 'GameRules', // 游戏规则
    components: {
        "vue-header": header, // 头部组件
        'vue-loading-gif':loadingGif // loading
    },
    props: [],
    computed: {
        ...mapState({
            curGameRules: state => state.home.curGameRules, // 游戏规则
            curSubSelectMenuId: state => state.home.curSubSelectMenuId, // 当前选中信息二级彩种ID
            isLoading: state => state.home.isLoading, // 是否显示loading
            showAllMenu: state => state.home.showAllMenu, // 是否显示彩种选择 true:显示，false:不显示
        })
    },
    data() {
        return{
            from: '', // 路径来自哪 
            preventScroll:'', // 阻止遮罩层显示时底部盒子滚动
        }
    },
    watch: {
        curSubSelectMenuId: { // 监听当前选中信息二级彩种ID 
            handler:function (newVal, oldVal) {
                if(newVal != oldVal) {
                    if(this.$refs.getGameRulesScroll) { // 滚动条重置为顶部
                        this.$refs.getGameRulesScroll.scrollTop = 0 // 滚动条置为顶部
                    }
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
    created() {

    },
    mounted() {
        this.from = this.$route.query.from // 路径来自哪 
    },
    methods: {

    },
    destroyed() { // 组件销毁时清除定时器

    }
}
</script>

<style lang="stylus" scoped>
@import "../../assets/stylus/blue"
.rules-content-box
    margin-top 0.44rem
    .rules-title
        line-height 0.63rem
        text-align center
        font-size 0.17rem
        color $order-tit-font
    .rules-content
        box-sizing border-box
        padding 0 0.17rem
        height calc(100vh - 1.25rem)
        overflow auto
        line-height 0.25rem
        color $order-tit-font
        font-size 0.14rem !important
        li
            line-height 0.2rem
            word-wrap break-word
.rules-countDown
    .rules-content-box
        margin-top 0rem
        .rules-content
            height calc(100vh - 2.5rem)
            overflow auto
.mb15
    margin-bottom 1.5rem!important
    padding-bottom 1rem
// 遮罩层显示时阻止遮罩层底部的内容滚动
.preventScroll
    overflow hidden !important 
</style>