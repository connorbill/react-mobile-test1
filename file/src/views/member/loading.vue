<template lang="jade">
    .load-time
        .loadEffect
            span(v-for="i in 8")
</template>

<script>
export default {
    
}
</script>
<style lang="stylus" scoped>
.load-time
    display flex
    flex-direction column
    justify-content center
    .loadEffect{
        width: 0.2rem;
        height: 0.2rem;
        position: relative;
    }
    .loadEffect span{
        display: inline-block;
        width: 0.04rem;
        height: 0.02rem;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        -webkit-animation: load 1s ease infinite;
        animation:load 1s ease infinite;
        -moz-animation:load 1s ease infinite; 
        -o-animation:load 1s ease infinite; 
        -ms-animation:load 1s ease infinite; 
    }
    @-webkit-keyframes load{
        0%{ opacity:1; }
        100%{ opacity:0.2; }
    } 
    
    @keyframes load{ 
        0%{ opacity:1; }
        100%{ opacity:0.2; }
    }
    @-moz-keyframes load{ 
        0%{ opacity:1; }
        100%{ opacity:0.2; }  
    } 
    @-o-keyframes load{ 
        0%{ opacity:1; }
        100%{ opacity:0.2; }  
    } 
    @-ms-keyframes load{ 
        0%{ opacity:1; }
        100%{ opacity:0.2; }
    } 
    .loadEffect span:nth-child(1){
        left: 0;
        top: 50%;
        margin-top:-0.01rem;
        -webkit-animation-delay:0.13s;
    }
    .loadEffect span:nth-child(2){
        left: 0.02rem;
        top: 0.04rem;
        -webkit-transform: rotate(45deg);
        -webkit-animation-delay:0.26s;
    }
    .loadEffect span:nth-child(3){
        left: 50%;
        top: 0.02rem;
        margin-left: -0.02rem;
        -webkit-transform: rotate(90deg);
        -webkit-animation-delay:0.39s;
    }
    .loadEffect span:nth-child(4){
        top: 0.04rem;
        right:0.02rem;
        -webkit-transform: rotate(135deg);
        -webkit-animation-delay:0.52s;
    }
    .loadEffect span:nth-child(5){
        right: 0;
        top: 50%;
        margin-top:-0.01rem;
        -webkit-transform: rotate(180deg);
        -webkit-animation-delay:0.65s;
    }
    .loadEffect span:nth-child(6){
        right: 0.02rem;
        bottom:0.04rem;
        -webkit-transform: rotate(225deg);
        -webkit-animation-delay:0.78s;
    }
    .loadEffect span:nth-child(7){
        bottom: 0.02rem;
        left: 50%;
        margin-left: -0.02rem;
        -webkit-transform: rotate(270deg);
        -webkit-animation-delay:0.91s;
    }
    .loadEffect span:nth-child(8){
        bottom: 0.04rem;
        left: 0.02rem;
        -webkit-transform: rotate(315deg);
        -webkit-animation-delay:1.04s;
    }

</style>


