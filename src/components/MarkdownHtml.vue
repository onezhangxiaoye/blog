<template>
  <div class="marked" v-html="markDownHTML" id="marked"></div>
</template>

<script>
// import marked from 'marked'
// import hljs from 'highlight.js'
export default {
  name: 'MarkdownHtml',
  props:{
      markdownText:String
  },
  data () {
    return {
      msg: 'Welcome to Your RouterTest'
    }
  },
  mounted() {
      this.markdown();
  },
  methods: {
    /**
     * 配置markdown
     */
      markdown() {
          marked.setOptions({
              renderer: new marked.Renderer(),
              gfm: true,
              tables: true,
              breaks: true,
              pedantic: false,
              sanitize: false,
              smartLists: true,
              smartypants: false
          });
      },
  },
  computed: {
      markDownHTML(){
          let markedHtml = marked( this.markdownText ,{ sanitize: true });
          setTimeout(() => {
            let blocks = document.getElementById('marked').querySelectorAll('pre code');
            blocks.forEach((block)=>{
              hljs.highlightBlock(block)
            })
          }, 100);
          return markedHtml;
      }
  },
}
</script>

<style lang='stylus'>
    .marked
        resize:none
        width: 100%
        height: 100%
        border none
        padding 0 10px
        box-sizing border-box
        blockquote
            border-left: 2px solid #009A61
            padding: 20px 0 20px 10px
            margin: 10px 0
        ul
            padding-left: 10px
        pre
            margin: 10px 0
            font-size: 14px
        img 
            width 100%
        p
            line-height 22px
    code
      background-color #e7e7e7
      color #ff3860
      font-weight 400
      padding .25em .5em .25em
      border-radius 8px
</style>
