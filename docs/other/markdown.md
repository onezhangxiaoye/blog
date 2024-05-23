---
title: "Markdown技巧"
date: 2021-02-21T10:21:37+08:00
lastmod: 2021-02-21T10:21:37+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
# cover: /img/cover.jpg
categories:
  - markdown
tags:
  - markdown
  - markdown折叠语法
---
  
# Markdown技巧

使用markdown 写博客时得部分小技巧

<!--more-->

## 文本折叠

::: details 点击查看文本

文本折叠主要依靠 `html` 标签 `detail` 和 `summary` ， 在 markdown 文本中的 顶级 html 代码在解析后不会被转换，所以可以直接使用，但是要注意他的兼容性，[caniuse](https://caniuse.com/details)
:::

``` html
<details>
<summary>点击查看文本</summary>
  
文本折叠主要依靠 `html` 标签 `detail` 和 `summary` ， 在 markdown 文本中的 顶级 html 代码在解析后不会被转换，所以可以直接使用，但是要注意他的兼容性，[caniuse](https://caniuse.com/details)
</details>
```

> 在 `hugo` 中 `summary` 的下面一行需要留一个空行，否则里面的 markdown 文本不会被正常解析，会被直接输出为文本

::: details 点击查看文本-删除空行
  文本折叠主要依靠 `html` 标签 `detail` 和 `summary` ， 在 markdown 文本中的 顶级 html 代码在解析后不会被转换，所以可以直接使用，但是要注意他的兼容性，[caniuse](https://caniuse.com/details)
:::


``` html
<details>
<summary>点击查看文本</summary>
文本折叠主要依靠 `html` 标签 `detail` 和 `summary` ， 在 markdown 文本中的 顶级 html 代码在解析后不会被转换，所以可以直接使用，但是要注意他的兼容性，[caniuse](https://caniuse.com/details)
</details>
```

