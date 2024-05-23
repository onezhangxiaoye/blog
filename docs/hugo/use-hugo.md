---
title: "使用Hugo"
date: 2021-01-16T17:57:07+08:00
lastmod: 2021-02-01T18:21:35+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
# cover: /img/cover.jpg
categories:
    - Hugo
tags:
    - 教程
    - Hugo
draft: false
---

# 使用Hugo

Hugo的一些常用命令.

<!--more-->

## 1 创建新的内容文件

```
    # 需要在跟目录使用 否则会提示找不到配置文件
    hugo new posts/my-first-post.md
```

## 2 启动webserver

```
    # 根目录
    hugo server -D
    # 参考帮助文档
    hugo help
```


## 3 在Gitee上发布之后不显示文章

```
---
title: "Twice"
date: 2021-01-15T00:03:05+08:00
# 这里表示当前文章还属于草稿，在生产环境中不会显示
draft: true
---
```
参照[Hugo文档-Basic Usage](https://gohugo.io/getting-started/usage/#draft-future-and-expired-content)


## 4 块引用
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

## 5 代码高亮

想通过`highlightjs`调整到自己想要的代码主题样式，但是怎么调整视乎都有点不对劲，后面检查元素发现是hugo自动生成的部分内联的样式覆盖了`highlightjs`的样式，

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

## 6 `md`文件中嵌入原生`Html`代码并原样输出

```
[markup]
  # https://gohugo.io/getting-started/configuration-markup#goldmark
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true #开启后可在md 中直接嵌入 html 代码
```

## 7 文章A标签渲染
[Markdown Render Hooks](https://gohugo.io/getting-started/configuration-markup/#markdown-render-hooks)

[Link with title Markdown example](https://gohugo.io/getting-started/configuration-markup/#link-with-title-markdown-example)
