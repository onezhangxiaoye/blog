<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import {isPC} from './utils/js/commonUtils'
import {createCanvas} from './utils/bgcanvas/circleLine.js'
export default {
  name: 'App',
  mounted(){
    //创建背景
    const type = navigator.userAgent;
    if (isPC()) {
        createCanvas();
    }
  }
}
</script>

<style lang="stylus">
#app
  background-color rgba(238, 238, 238, .5)
</style>
