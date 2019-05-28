<template>
  <div class="blog" v-if="blog">
    <h1>{{blog.blogTitle}}</h1>
    <p>发布时间：{{blog.blogTimestamp}}</p>
    <markdown-html :markdownText="blog.blogContent"></markdown-html>
  </div>
</template>

<script>
import {axiosPost} from '../utils/js/requestApi.js'
import MarkdownHtml from './MarkdownHtml'
export default {
  name: 'Blog',
  components:{
    MarkdownHtml
  },
  data () {
    return {
      blog: null
    }
  },
  mounted() {
      axiosPost('/BlogsController/selectBlogsByBlogId',{
        blogId:this.$route.params.blogId
      }).then(res => {
        if (res.status == 0) {
          this.blog = res.data;
        }
      })
  },
  methods: {
    routerTest(){
      
    },
  },
}
</script>

<style lang='stylus' scoped>
.blog
  >h1
    text-align center
    line-height 50px
    font-size 42px
  >p
    text-align right 
    font-size 18px
    border-bottom 1px solid #ccc
@media screen and (max-width 700px)
  .blog
    width auto
@media screen and (min-width 700px)
  .blog
    width 700px
    margin 0 auto
</style>
