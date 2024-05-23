# v-if和v-for优先级
[官方：v-if 与 v-for 的优先级对比](https://v3.cn.vuejs.org/guide/migration/v-if-v-for.html#frontmatter-title)

- `Vue 2.x 语法`: Vue 2.x 版本中在一个元素上同时使用 `v-if` 和 `v-for` 时，`v-for` 会优先作用。
- `Vue 3.x 语法`: Vue 3.x 版本中 `v-if` 总是优先于 `v-for` 生效。

::: tip
从编译后的代码来解读优先级问题
:::

## Vue 2.x template

``` vue
<div id="app">
    <h1 v-for="item in arr" v-if="item > 3">{{ item }}</h1>
</div>
```
编译后

``` js
function render(_c, _l, _v, _s, _e) {
    with (this) {
        return _c('div', {attrs: {"id": "app"}}, _l((arr), function (item) {
            return (item > 3) ? _c('h1', [_v(_s(item))]) : _e()
        }), 0)
    }
}
```

- `_l`: `renderList` 函数，用来渲染列表

从编译后的代码可以看出来，`v-if` 中的判断放到了回调函数中处理，即 `v-if` 始终会在 `v-for` 循环过程中进行判断，所以 `v-for` 优先级更高

## Vue 3.x template

[Vue 3 Template Explorer](https://vue-next-template-explorer.netlify.app/#eyJzcmMiOiI8aDEgdi1mb3I9XCJpdGVtIGluIGFyclwiIHYtaWY9XCJpdGVtID4gM1wiPnt7IGl0ZW0gfX08L2gxPiIsInNzciI6ZmFsc2UsIm9wdGlvbnMiOnsibW9kZSI6ImZ1bmN0aW9uIiwib3B0aW1pemVCaW5kaW5ncyI6ZmFsc2V9fQ==)

``` vue
<h1 v-for="item in arr" v-if="item > 3">{{ item }}</h1>
```
编译后

``` js
function render(_ctx, _cache, $props, $setup, $data, $options) {
  with (_ctx) {
    const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createElementBlock: _createElementBlock, toDisplayString: _toDisplayString, createCommentVNode: _createCommentVNode } = _Vue

    return (item > 3)
      ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList(arr, (item) => {
          return (_openBlock(), _createElementBlock("h1", null, _toDisplayString(item), 1 /* TEXT */))
        }), 256 /* UNKEYED_FRAGMENT */))
      : _createCommentVNode("v-if", true)
  }
}
```

Vue 3.x 编译后的代码，明显不同了。判断直接放在了最外层，`item` 不是使用的我们预期的在 `v-for` 中定义的 `item` 而是使用的 `_ctx` 下的属性了，`_ctx`就等于我们平时在 `vue` 中使用的 `this`，循环在判断之后进行，所以说 Vue 3.x 中 `v-if` 优先级更高，**而且 `v-if` 中无法访问到 `v-for=“(item, index) in list”` 中定义的 `item` 和 `index` 了**

## 举个栗子

``` vue
<template>
    <div>
        <h1 v-for="item in list" v-if="item > 5">{{ item }}</h1>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: [1,2,3,4,5,6]
            }
        },
    }
</script>
```

> 需要注意的是：针对上面的例子代码，若在 `vue2.x` 中运行，将只会显示 `<h1>6</h1>` ；**若在 `vue3.x` 中运行，将什么都不会显示**

或者你可以像下面这样写，就可以保证在 `vue2.x` 和 `vue3.x` 中执行结果的一致了
``` vue
<template>
    <div>
        <template v-for="item in list">
            <h1 v-if="item > 5">{{ item }}</h1>
        </template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: [1,2,3,4,5,5]
            }
        },
    }
</script>
```
Vue 3.x 编译后

``` js
function render(_ctx, _cache, $props, $setup, $data, $options) {
  with (_ctx) {
    const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createElementBlock: _createElementBlock, toDisplayString: _toDisplayString, createCommentVNode: _createCommentVNode } = _Vue

    return (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(list, (item) => {
      return (_openBlock(), _createElementBlock(_Fragment, null, [
        (item > 5)
          ? (_openBlock(), _createElementBlock("h1", { key: 0 }, _toDisplayString(item), 1 /* TEXT */))
          : _createCommentVNode("v-if", true)
      ], 64 /* STABLE_FRAGMENT */))
    }), 256 /* UNKEYED_FRAGMENT */))
  }
}
```

