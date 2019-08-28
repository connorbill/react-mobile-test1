<template lang="jade">
    .loading
        span
            img(src="@/assets/images/loading/loading.gif")
        span 加载中
</template>
<style scoped lang="stylus">
.loading
    display flex
    flex-direction column
    justify-content center
    text-align center
    height 100%
    width 100%
    img
        width 0.35rem
        height 0.35rem
</style>
