---
title: "JS Array"
date: 2021-01-19T23:06:47+08:00
lastmod: 2021-01-19T23:06:47+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
cover: /images/js/array.png
categories:
  - JS
tags:
  - JS
  - Array
---
  
# js-array 相关内容

由于在`vue`的`computer`里面对其依赖的数组使用 `sort` ,导致无限循环触发了`computer`，而照成了浏览器崩溃。

<!--more-->
> 主动改变原数组
> `copyWithin`|`fill`|`pop`|`push`|`reverse`|`shift`|`sort`|`unshift`

## 主动改变原数组

### copyWithin6️⃣🤔[🔗](https://www.runoob.com/jsref/jsref-copywithin.html)
- `描述` 从数组的指定位置拷贝元素到数组的另一个指定位置中
- `语法` array.copyWithin(target, start?, end?)
- `返回值` 修改后的数组


### fill6️⃣🤔[🔗](https://es6.ruanyifeng.com/#docs/array#%E6%95%B0%E7%BB%84%E5%AE%9E%E4%BE%8B%E7%9A%84-fill)

- `描述` 将一个固定值替换数组的元素
- `语法` array.fill(value, start?, end?)
- `返回值` 修改后的数组

### pop🤔[🔗](https://www.runoob.com/jsref/jsref-pop.html)

- `描述` 删除数组的最后一个元素并返回删除的元素
- `语法` array.pop()
- `返回值` 返回删除的元素

### push🤔[🔗](https://www.runoob.com/jsref/jsref-push.html)

- `描述` 向数组的末尾添加一个或多个元素，并返回新的长度
- `语法` array.push(item1, item2, ..., itemX)
- `返回值` 数组新长度

### reverse🤔[🔗](https://www.runoob.com/jsref/jsref-reverse.html)

- `描述` 颠倒数组中元素的顺序
- `语法` array.reverse()
- `返回值` 颠倒顺序后的数组

### shift🤔[🔗](https://www.runoob.com/jsref/jsref-shift.html)

- `描述` 把数组的第一个元素从其中删除，并返回第一个元素的值
- `语法` array.shift()
- `返回值` 移除的元素

### sort🤔[🔗](https://www.runoob.com/jsref/jsref-sort.html)

- `描述` 对数组的元素进行排序
- `语法` array.sort(function(item1, item2))
- `返回值` 排序后的数组


### unshift🤔[🔗](https://www.runoob.com/jsref/jsref-unshift.html)

- `描述` 向数组的开头添加一个或更多元素，并返回新的长度
- `语法` array.unshift(item1,item2, ..., itemX)
- `返回值` 数组新长度


## 不主动改变原数组
### concat✅[🔗](https://www.runoob.com/jsref/jsref-concat-array.html)

- `描述` 连接两个或更多的数组，并返回结果。
- `语法` array1.concat(array2,array3,...,arrayX)
- `参数` 必需。该参数可以是具体的值，也可以是数组对象。可以是任意多个
- `返回值` 返回一个新的数组


### entries|keys|values6️⃣✅[🔗](https://es6.ruanyifeng.com/#docs/array#%E6%95%B0%E7%BB%84%E5%AE%9E%E4%BE%8B%E7%9A%84-entries%EF%BC%8Ckeys-%E5%92%8C-values)

- `描述`返回一个数组的迭代对象，该对象包含数组的键值对 (key/value)。迭代对象中数组的索引值作为 key， 数组元素作为 value
- `语法` array.entries()
- `参数` 无
- `返回值` 返回一个数组的迭代对象


``` javascript
for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
console.log(['a', 'b'].entries().toString());
// "[object Array Iterator]"
```

### every✅[🔗](https://www.runoob.com/jsref/jsref-every.html)

- `描述` 检测数组所有元素是否都符合指定条件（通过函数提供）
- `语法` array.every(function(currentValue,index,arr), thisValue?)
- `返回值` 布尔值


### filter✅[🔗](https://www.runoob.com/jsref/jsref-filter.html)

- `描述` 创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素
- `语法` array.filter(function(currentValue,index,arr), thisValue?)
- `返回值` 返回一个新的数组

### find6️⃣✅[🔗](https://es6.ruanyifeng.com/#docs/array#%E6%95%B0%E7%BB%84%E5%AE%9E%E4%BE%8B%E7%9A%84-find-%E5%92%8C-findIndex)

- `描述` 返回通过测试（函数内判断）的数组的第一个元素的值
- `语法` array.find(function(currentValue, index, arr),thisValue?)
- `返回值` 返回符合测试条件的第一个数组元素值，如果没有符合条件的则返回 `undefined`

### findIndex6️⃣✅[🔗](https://es6.ruanyifeng.com/#docs/array#%E6%95%B0%E7%BB%84%E5%AE%9E%E4%BE%8B%E7%9A%84-find-%E5%92%8C-findIndex)

- `描述` 返回传入一个测试条件（函数）符合条件的数组第一个元素位置
- `语法` array.findIndex(function(currentValue, index, arr),thisValue?)
- `返回值` 返回符合测试条件的第一个数组元素索引，如果没有符合条件的则返回 -1

### forEach✅[🔗](https://www.runoob.com/jsref/jsref-foreach.html)

- `描述` 调用数组的每个元素，并将元素传递给回调函数
- `语法` array.forEach(function(currentValue, index, arr), thisValue?)
- `返回值` undefined

### includes6️⃣✅[🔗](https://es6.ruanyifeng.com/#docs/array#%E6%95%B0%E7%BB%84%E5%AE%9E%E4%BE%8B%E7%9A%84-includes)

- `描述` 判断一个数组是否包含一个指定的值，如果是返回 true，否则false
- `语法` arr.includes(searchElement, fromIndex?)
- `返回值` 布尔值

### indexOf✅[🔗](https://www.runoob.com/jsref/jsref-indexof-array.html)

- `描述` 返回数组中某个指定的元素位置
- `语法` array.indexOf(item, start?)
- `返回值` 元素在数组中的位置，如果没有搜索到则返回 -1

### join✅[🔗](https://www.runoob.com/jsref/jsref-join.html)

- `描述` 把数组中的所有元素转换一个字符串
- `语法` array.join(separator?)
- `返回值` 返回一个separator间隔的字符串

### lastIndexOf✅[🔗](https://www.runoob.com/jsref/jsref-lastindexof-array.html)

- `描述` 返回一个指定的元素在数组中最后出现的位置，从该数组的后面向前查找
- `语法` array.lastIndexOf(item, start?)
- `参数` 必需。该参数可以是具体的值，也可以是数组对象。可以是任意多个
- `返回值` 元素在数组中的位置，如果没有搜索到则返回 -1

### map✅[🔗](https://www.runoob.com/jsref/jsref-map.html)

- `描述` 返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
- `语法` array.map(function(currentValue,index,arr), thisValue?)
- `返回值` 返回一个新的数组

### reduce✅[🔗](https://www.runoob.com/jsref/jsref-concat-array.html)
### reduceRight✅[🔗](https://www.runoob.com/jsref/jsref-concat-array.html)

- `描述` 方法接收一个函数作为累加器，数组中的每个值（从左到右|从右到左）开始缩减，最终计算为一个值
- `语法` array.(reduce|reduceRight)(function(total, currentValue, currentIndex, arr), initialValue?)
- `参数` 必需。该参数可以是具体的值，也可以是数组对象。可以是任意多个
- `返回值` 返回计算结果

### map✅[🔗](https://www.runoob.com/jsref/jsref-map.html)

- `描述` 返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
- `语法` array.map(function(currentValue,index,arr), thisValue?)
- `返回值` 返回一个新的数组


### slice✅[🔗](https://www.runoob.com/jsref/jsref-slice-array.html)

- `描述` 从已有的数组中返回选定的元素
- `语法` array.slice(start?, end?)
- `返回值` 返回一个新的数组，包含从 start 到 end


### some✅[🔗](https://www.runoob.com/jsref/jsref-some.html)

- `描述` 检测数组中的元素是否满足指定条件（函数提供）
- `语法` array.some(function(currentValue,index,arr),thisValue?)
- `返回值` 布尔值
