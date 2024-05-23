---
title: "使用hugo Theme Dream主题"
date: 2021-01-16T17:06:32+08:00
lastmod: 2021-01-21T09:10:07+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
# cover: /img/cover.jpg
categories:
  - Hugo
tags:
  - 教程
  - Hugo
---
  
# 使用hugo Theme Dream主题

Hugo的安装那些基本使用很多博客都已经写过了，也算是比较容易入门的,由于没有太多的时间去查阅官方文档，所以就直接在[HugoThemes](https://themes.gohugo.io/),找了一个自己比较喜欢的[hugo-theme-dream](https://github.com/g1eny0ung/hugo-theme-dream)主题，然后开始了踩坑之旅。

## 1 Hugo在win10下的安装

前面那部分参照了[Hugo中文](https://www.gohugo.org/),自己安装的是二进制文件，在配置环境变量时一直不生效，后面重启了一下就好了，😓😓😓

## 2 初始代码的提交
自己的博客是使用的[码云](https://gitee.com)的仓库，为了在国内能够快一点。在提交代码时候，`/themes/hugo-theme-dream` 里面的文件一直无法提交，虽然本地`Hugo`能启动起来，可是在`码云`构建完了项目打开满屏错误代码，后面删除了`/themes/hugo-theme-dream/.github`和`/themes/hugo-theme-dream/.git`，才把主题代码提交上去

## 3 后续改动中遇到的一些问题
在参照`exampleSite` 进行项目的内容添加过程中，由于自己的博客地址是`http://cai12317.gitee.io/blog`,这里就出现了很多图片无法正常显示，在浏览器中检查源码后发现图片的地址`http://localhost:1313/images/banner.webp`有问题，这里少了一截地址，应该是`http://localhost:1313/blog/images/banner.webp`才能正确显示。这里主要是先在主题目录找到图片对于的`.html`文件（可以使用class去全局搜索），在这里的模板语法获取的图片路径直接就是使用的原路径（整了半天不知道怎么改不知道怎么改😂），想着如果在配置里面加一个`/blog`，以后我换了`baseURL`，那不是还要去改一次。然后去检查了能够显示的图片的源码怎么写的。
```html
<!-- 无法显示的写法 -->
<link href="{{ .Site.Params.favicon }}" rel="shortcut icon" type="image/x-icon" />
<!-- 能够显示的写法 -->
{{ if isset .Site.Params "favicon" }}
  <link href="{{ .Site.Params.favicon | relURL }}" rel="shortcut icon" type="image/x-icon" />
{{ end }}
```
虽然看不懂，但是参照这样写就对了，`relURL`在Hugo的模板语法中有很多的函数。

可以详细阅读[Hugo-Function](https://gohugo.io/functions/)

或者参照这个，视乎不全[Hugo中文帮助文档](https://hugo.aiaide.com/)

其他的如果图片地址还有问题，应该都可以参照这种解决方式。

## 4 归档标签无法正常显示
类似下面把博客文章相关的文件统一都放到`posts` `posts` `posts`,下面就好了，我少写了一个`s`搞了搞了好久
![](https://imgkr2.cn-bj.ufileos.com/cfe3ce71-e948-491c-8866-98f30de5ec46.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=9HVOgUBx35Us8FN0drkj%252Fkc88Is%253D&Expires=1610874199)

## 5 在Gitee上发布之后不显示文章

```
---
title: "Twice"
date: 2021-01-15T00:03:05+08:00
# 这里表示当前文章还属于草稿，在生产环境中不会显示
draft: true
---
```
参照[Hugo文档-Basic Usage](https://gohugo.io/getting-started/usage/#draft-future-and-expired-content)

## 6 块引用
`blockquote` 块引用，默认没有样式，可以直接去自定义 css 添加一个预期的样式就可以了，样式参照的掘金的样式

``` css
.markdown-body blockquote {
    color: #666;
    padding: 1px 23px;
    margin: 22px 0;
    border-left: 4px solid #cbcbcb;
    background-color: #f8f8f8;
    border-radius: 3px;
}
.markdown-body blockquote p {
    margin: 10px 0;
}

```

### 7 代码高亮

想通过`highlightjs`调整到自己想要的代码主题样式，但是怎么调整视乎都有点不对劲，后面检查元素发现是内联的样式覆盖了`highlightjs`的样式，

```
  # highlightjs样式的设置
  highlightjs = true
  # highlightjsCDN = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/highlight.min.js"
  highlightjsExtraLanguages = ["ocaml"]
  highlightjsTheme = "atom-one-dark"
  highlightjsThemeDark = "atom-one-dark"
```
这里通过[Hugo-Highlight](https://gohugo.io/getting-started/configuration-markup#highlight)，`codeFences = false` 关闭他本身的代码样式生成

```
[markup]
  [markup.highlight]
    anchorLineNos = false
    codeFences = false # 是否使用 内置 代码样式
    guessSyntax = false # 猜测语法，如果你没有设置要显示的语言则会自动匹配
    hl_Lines = "" # 高亮的行号
    lineAnchors = ""
    lineNoStart = 1 # 行号从编号几开始
    lineNos = true # 是否显示行号
    lineNumbersInTable = true #使用表来格式化行号和代码,而不是 标签
    noClasses = false # 是否使用 class 标签
    style = "dracula"
    tabWidth = 4
```



