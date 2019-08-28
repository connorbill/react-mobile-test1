<template lang="jade">
    .quick-header
        ul.quick-menuList
            li(v-for="list,index in menu", :key="index", :class="quickActiveCode === list.code ? 'active': ''", @touchend.prevent="getCurList(list.code)") {{ list.name }}
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: "Index",
    computed:{
        ...mapState({
            quickActiveCode: state => state.home.quickActiveCode, // 选中菜单code
            scrollValue: state => state.home.scrollValue, // 滚动条滚动值
        })
    },
    data() {
        return {
            menu: [ // 菜单
                    {
                        'id': '1',
                        'name': '路子',
                        'code': 'trend'
                    },
                    {
                        'id': '2',
                        'name': '开奖',
                        'code': 'draw'
                    },
                    {
                        'id': '3',
                        'name': '单注',
                        'code': 'curBet'
                    },
                    {
                        'id': '4',
                        'name': '总注',
                        'code': 'allBet',
                    },
                    {
                        'id': '5',
                        'name': '说明',
                        'code': 'explain',
                    }
                ]
        }
    },
    mounted(){
        let pcode = this.$route.query.pcode // 一级彩种code
        this.$store.dispatch('getInfoCurParMenu', pcode) // 信息类一级彩种code
        this.$store.dispatch('getTempMenu', 'hotGames')
    },
    methods: {
        getCurList(c) { // c: 当前快捷菜单code
            this.$store.dispatch('getQuickActiveCode', c) // 选中菜单code
        }
    }
};
</script>

<style scoped lang="stylus">
@import "../../../assets/stylus/blue";
.quick-header
    position absolute
    top 0
    left 0
    width 100%
    height 0.45rem
    line-height 0.45rem
    border-radius 0.08rem 0.08rem 0 0
    z-index 9
.active
    color $quick-font-cur!important
    border-bottom 0.02rem solid $quick-font-cur
    display block
    font-weight bold
.quick-menuList
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    background $quick-tit-bg
    border-radius 0.08rem 0.08rem 0 0
    li
        color $quick-font
        font-size 0.16rem
        width 20%
        text-align center
</style>
