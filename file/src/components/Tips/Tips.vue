<template lang="jade">
    transition(name="fade")
        .tips(:class="type", v-show="show")
            //- svg-icon(:icon-class ="type")
            <i :class="type == 'success' ? 'el-icon-success' : type == 'error' ? 'el-icon-error' : type == 'info' ? 'el-icon-info' : type == 'warning' ? 'el-icon-warning' : ''"></i>
            span.text {{text}}
</template>

<script type="text/ecmascript-6">
export default {
    name: 'tips',
    props: {
      type: {
          type: String,
          default: 'info',
          validator: val => ['info', 'success', 'warning', 'error'].includes(val)
      },
      text: {
          type: String,
          default: ''
      },
      show: {
          type: Boolean,
          default: false
      }
    }
}
</script>
<style scoped lang="stylus">
@import "../../assets/stylus/blue";
.fade-enter-active,
.fade-leave-active 
    // transition: opacity 3s
.fade-enter,
.fade-leave-to
    opacity: 0
.tips
    position fixed
    top 50%
    text-align center
    left 50%
    transform translateX(-50%)
    min-width auto
    color $tips-text-color
    background #2a2f3e
    font-size 14px
    border-radius 4px
    z-index 1000
    box-shadow 0 0 10px rgba(0, 0, 0, .3)
    height 45px
    line-height 45px
    min-width 120px
    max-width 500px
    padding 0px 15px
    -webkit-overflow-scrolling touch
    i
        padding-right: 10px
    &.info
        color $tips-text-color
    &.success i
        color $tips-success-color
    &.warning
        color $tips-warning-color
    &.error
        color $tips-error-color

</style>
