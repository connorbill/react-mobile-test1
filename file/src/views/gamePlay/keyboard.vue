<template lang="jade">
    div.keyboard
        ul.key-list
            li(v-for="val in number", @touchend.prevent="getCurAmount(val)") 
                span(v-if="val != 'del'") {{ val }}
                svg-icon(v-else, :icon-class="val")

</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'Keyboard', // 键盘
    components: {

    },
    computed: {
        ...mapState({
            // showKeyboard: state => state.home.showKeyboard, // 是否显示键盘 false:不显示， true:显示  
        }),
        newAmount:{ // 临时单注金额
            get() {
                return this.$store.state.home.newAmount
            },
            set(item) {
                if(item.length > 6) { // 最高单注99999万
                    return
                }
                return this.$store.dispatch("getNewAmount",item)
            }
        }
    },
    data() {
        return {
            number: [1,2,3,4,5,6,7,8,9,'del',0,'确定'], // 键盘内容
            // newAmount: '' // 临时存单注金额
        }
    },
    filters: {
    },
    created() {

    },
    mounted() {

    },
    watch: {
        
    },
    methods: {
        getCurAmount(val) { // 获取当前金额 val:当前数值
            switch (val) {
                case 'del':
                    this.newAmount = (this.newAmount.toString()).substring(0, this.newAmount.length - 1)
                    this.$store.dispatch('getBetAmount', this.newAmount) // 单注金额
                    break;
                case '确定':
                    this.$store.dispatch('getBetShowBg', false) // 下注页背景层是否显示 true:显示，false:不显示
                    this.$store.dispatch('getShowKeyboard', false) // 是否显示键盘 false:不显示， true:显示
                    break;
                default:
                    this.newAmount = this.newAmount + val
                    this.$store.dispatch('getBetAmount', this.newAmount) // 单注金额
                    break;
            }
        }
    },
    beforeDestroy() { // 根组件被beforeDestroy
        
    },
    destroyed() { // 组件销毁时清除定时器
        
    }
}
</script>

<!-- 添加“scoped”属性以仅将CSS限制为此组件 -->
<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.keyboard
    position fixed
    bottom 0rem
    left 0
    width 100%
    border-radius 0.08rem 0.08rem 0rem 0rem
    z-index 100
    -webkit-overflow-scrolling touch
.key-list
    display flex
    flex-wrap wrap
    justify-content space-around
    flex-direction row
    background $bet-tot-bg1
    background $keyboard-bg
    li
        line-height 0.5rem
        height 0.5rem
        color $bet-but-font
        text-align center
        border-top 0.01rem solid $keyboard-line
        border-left 0.01rem solid $keyboard-line
        flex 1 1 33.33%
        svg
            width 0.3rem
            height 0.3rem
            line-height 0.5rem
            margin-top 0.1rem
            color $bet-but-font
        span
            font-size 0.17rem
            font-family Arial, Helvetica, sans-serif
            font-weight bold
</style>