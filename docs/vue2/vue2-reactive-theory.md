---
title: "深入Vue2响应式原理"
date: 2021-02-24T12:29:23+08:00
lastmod: 2021-02-24T12:29:23+08:00
author: ZhangXiaoYe
avatar: /images/avatar.png
authorlink: http://cai12317.gitee.io/blog
# cover: /img/cover.jpg
categories:
    - Vue2.0
tags:
    - Vue
    - Vue2.0
    - 响应式原理
---

# 深入vue2响应式原理

Vue2.0 响应式的数据是基于 `Object.defineProperty` 的，在哪些情况下会出现无法触发其 `getter/setter`，我们从 `defineProperty` 来解析一下

<!--more-->

[Vue 深入响应式原理官方文档](https://cn.vuejs.org/v2/guide/reactivity.html)

[Object.defineProperty()----MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

## Object.defineProperty()

### 定义

`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

### 语法

> Object.defineProperty(obj, prop, descriptor)

### descriptor 相关属性


| 属性       | 描述 |         默认值 |
| :--------- | :--: | :--: |
| configurable     |  值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除  |     false |
| enumerable   |  值为 true 时，该属性才会出现在对象的枚举属性中  |   false |
| get |  当访问该属性时，会调用此函数。该函数的返回值会被用作属性的值  | undefined |
| set |  当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象  | undefined |


## Vue 源码中使用的 Object.defineProperty

> `Vue` 将遍历此对象所有的 `property`，并使用 `Object.defineProperty` 把这些 `property` 全部转为 `getter/setter` 。在 `property` 被访问和修改时通知变更。

<details>
<summary>Vue defineReactive 源码</summary>

``` javascript
  function defineReactive$$1 (obj,key,val,customSetter,shallow) {
    var dep = new Dep();
    
    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if (customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

```
</details>


### 我的理解

从上面可以看出来，`defineProperty` 主要是用来定义属性，而 `Vue` 在初始化时，在 `initState` => `initData` 中把 `data` 中返回的对象的 `property`  转换为 `getter/setter` ，但若在初始化之后再添加新的 `property` ，此时 `Vue` 是无法检测到的。

## object 的属性添加

``` javascript
let data = function(){
  return {
    obj: {
      key1: 11,
    },
    arr: [{name: 22}],
  };
}

// 无法检测到的情况

// 为对象添加新的属性
this.obj.key2 = 22;

this.obj = Object.assign(obj, {key2: 22});

let obj. = this.obj;
obj.key2 = 22;
this.obj = obj;


// 为数组直接通过下标添加元素
this.arr[0] = {name: 22};

this.arr.length = 0;
```

## vue 检测数组的push,pop...等

> vue 提前重写了数组的 `push,pop,shift,unshift,splice,sort,reverse` 方法，添加完成数据后，对非响应式的数据进行了转换，并且通知更新

<details>
<summary>Vue 重写数组方法 源码</summary>


``` javascript
  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });
```

</details>

## 如何避免数据跟新视图不跟新问题

> 有时候在使用操作数据时，后面在使用数据时，数据更改了但是视图却未更新，这时很可能是未更新的部分的 `property` 未被转换，很基本的场景就是如下图， `key3` 未在 `data` 中初始的添加，而是在后面添加的，当我们打印组件的实例时，发现 `key3` 没有被转换为 `getter\setter` ，这时就不会触发视图更新


```JavaScript
{
  data() {
    return {
      obj: {
        key1: 11,
        key2: 22,
      }
    }
  },
  created(){
    this.obj.key3 = 33;
  }
}
```

![](https://imgkr2.cn-bj.ufileos.com/14231322-40f8-49af-82d5-7c9bee654a6c.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=FkUyJyyomD4TThsqtW%252Bux8TxjEY%253D&Expires=1614177645)


> 针对对象添加新的属性，我们可以使用官方推荐的 `$set` ，他放在 `vue` 的原型上，若添加的属性，不在第一级，如上面的例子，`obj` 这个 `property` 已经转换为 `getter\setter`，还可以 `this.obj = {...this.obj, key3: 33}`，还可以如下操作，其实就是把原始的对象拷贝一份，这里使用 `深拷贝` 或者 `浅拷贝` 就看具体情况就好了

```JavaScript
  created(){
    this.obj = Objece.assign({key3: 33}, this.obj)
  }
```

> 注意：最后这个方法新的属性要放在第一个参数，`Objece.assign` 的返回值依旧是第一个参数

