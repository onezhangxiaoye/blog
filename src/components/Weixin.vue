<!--  -->
<template>
  <div>
      <button @click="weixin">跳转</button>
      <div>{{msg}}</div>
  </div>
</template>

<script>
var wx = require('weixin-js-sdk');
export default {
  data () {
    return {
        msg:''
    };
  },

  components: {},

  computed: {},

  activated () {},

  methods: {
      weixin(){
        wx.miniProgram.navigateTo({
                path: '',
                appId: 'wxe348ff6c6872448f',
                url:'/pages/index/home/home',
                success: (e) => {
                    this.msg = '成功' + JSON.stringify(e)
                },
                error: (err) => {
                    this.msg = '失败' + JSON.stringify(e)
                }
        })
      }
  }
}

</script>
<style scoped>
</style>