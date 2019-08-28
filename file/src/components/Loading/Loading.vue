<template lang="jade">
    .loading-status(v-show="loading")
        .load-content
            .c1
            .c2
            .c3
            .c4
        span loading
</template>
<script>
export default {
    name:'loading',
    data() {
        return {
            loading: true
        }
    }
}
</script>