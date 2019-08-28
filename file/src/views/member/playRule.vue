<template lang="jade">
    .news-rules(:class="from == 'countDown' ? 'rules-countDown' : ''")
        .rules-header(v-show="from != 'countDown'")
            vue-header
        .rules-content-box
            .rules-title 玩法说明
            div.rules-content(ref="getPlayRulesScroll")
                .mb15(v-html="curPlayRule", v-show="!isLoading") 
                vue-loading-gif(v-show="isLoading")
</template>
<script>
import { mapState } from "vuex";
import header from '@/views/member/header'  // 头部
import { stat } from 'fs';
import loadingGif from '@/views/member/loadingGif' // loading
export default {
    name: 'PlayRules', // 玩法说明
    metaInfo: {
      meta: [
        // { charset: 'utf-8' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
    },
    components: {
        "vue-header": header, // 头部组件
        'vue-loading-gif':loadingGif // loading
    },
    props: [],
    computed: {
        ...mapState({
            curPlayRule: state => state.home.curPlayRule, // 玩法说明规则
            curSubSelectMenuId: state => state.home.curSubSelectMenuId, // 当前选中信息二级彩种ID
            isLoading: state => state.home.isLoading // 是否显示loading
        })
    },
    data() {
        return{
            from: '', // 路径来自哪 
        }
    },
    watch: {
        curSubSelectMenuId: { // 监听当前选中信息二级彩种ID 
            handler:function (newVal, oldVal) {
                if(newVal != oldVal) {
                    if(this.$refs.getPlayRulesScroll) { // 滚动条重置为顶部
                        this.$refs.getPlayRulesScroll.scrollTop = 0 // 滚动条置为顶部
                    }
                }
            },
            immediate:false
        }
    },
    created() {

    },
    mounted() {
        this.from = this.$route.query.from // 路径来自哪 
    },
    methods: {
        // changePos(e) { /// 滑动事件
        //     let pathArr = e.path[1].scrollTop;
        //     this.$store.dispatch("getScrollValue",pathArr)
        // }
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
    .rules-content
        box-sizing border-box
        padding 0 0.17rem
        height calc(100vh - 1.25rem)
        overflow auto
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
</style>