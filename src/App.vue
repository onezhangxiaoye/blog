<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {createCanvas} from './utils/bgcanvas/circleLine.js'
export default {
  name: 'App',
  mounted(){
    //创建背景
    createCanvas();
  },
}
</script>

<style lang="stylus">
@import "./styles/font.css";
#app
  font-family: xingshu;
  background-color rgba(238, 238, 238, .5)
</style>
