<template>
  <div class="hello">
    <div class="hello-head">
      <h1>这是一个简易的markdown在线编译器,支持代码高亮显示</h1>
      <input type="file" @input="fileInput">
      <img :src="filesrc" alt="">
    </div>
    <div class="marked-body">
      <div>
        <textarea name="markdown2" v-model="markdownText"></textarea>
      </div>
      <div>
        <div class="marked" v-html="msg" id="marked"></div>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js'
import marked from 'marked'
import {markdown} from 'markdown'
export default {
  name: 'HelloWorld',
  data () {
    return {
      markdownText: '#标题标题标题标题',
      timeOut:null,
      filesrc:''
    }
  },
  mounted() {
      this.markdown()
  },
  computed: {
      msg(){
          let markedHtml = marked( this.markdownText ,{ sanitize: true });
          // let markedHtml = markdown.toHTML( this.markdownText);
          this.timeOut = setTimeout(() => {
            let blocks = document.getElementById('marked').querySelectorAll('pre code');
            blocks.forEach((block)=>{
              hljs.highlightBlock(block)
            })
          }, 100);
          return markedHtml;
      }
  },
  methods: {
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
      fileInput(e){
        console.log(e);
        var file = e.target.files[0];
        if(window.FileReader) {
          var fr = new FileReader();
          fr.onloadend = (even) => {
            this.filesrc = even.target.result;
          }
          fr.readAsDataURL(file);
        }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.hello{
  height: 100vh;
}
.hello .hello-head{
  height: 10%;
}
.hello-head img{
  width: 60px;
}
.marked-body{
  height: 90%;
  overflow: hidden;
}
.marked-body > div{
  width: 50%;
  float: left;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
textarea,.marked{
  resize:none;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
.marked{
  padding: 10px;
  overflow: auto;
}
.marked blockquote{
  border-left: 2px solid #009A61;
  padding-left: 10px;
}
.marked ul{
  padding-left: 10px;
}
.marked pre{
  margin: 10px 0;
}
</style>
