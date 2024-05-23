# 前端知识点

## JavaScript 相关

[[toc]]

### 原始数据类型 + 引用数据类型

`js` 的数据类型分为 `原始数据类型` 和 `引用数据类型`，原始数据类型存在栈中，引用数据类型存在堆中。

- 原始数据类型包含：`undefined` `number` `string` `boolean` `null` 以及 es6 新增的 `symbol` `bigint`
- 引用数据类型主要是：`Object` `Array` `Function` 等这些对象

> 1. 在原始数据类型中：`null` 需要注意一下，只有 `typeof null === 'object'` 是这样的结果
> 2. 在引用数据类型中：除了 `typeof Function === 'function'` 之外其他的都是 `object`

通常我们使用 `typeof` 检查原始数据类型，用 `instanceof` 检查对象，用 `Array.isArray` 检查数组，检查原生 js 对象还可以使用 `Object.prototype.toString.call([]) === '[object Array]'`

### 0.1+0.2 !== 0.3
[链接](https://juejin.cn/post/7061588533214969892#heading-31)
`JavaScript` 使用 `Number` 类型表示数字（整数和浮点数），遵循 [IEEE 754 标准](https://zh.wikipedia.org/wiki/IEEE_754) 通过 `64位` 来表示一个数字，在计算时会先把 0.1 和 0.2 转换为 2进制 然后再进行加法运算，转换后的 2进制 数据都是无限循环的，但是实际上只能保存 52位长度的有效二进制数，截断的那一部分就造成了精度的损失


### Symbol

`Symbol` 是 es6 新增的一个原始数据类型，主要用来创建唯一的标识符，实际应用如 `instanceof` 操作时：

``` js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass() // true
```

### `Object.is` 和 `===` 的区别

判断值相等的不同方法

``` js
  Object.is(NaN, NaN) // true
  Object.is(+0, -0) // false
  -0 === +0 // true
  NaN === NaN //false
```

### JS 中，类型转换只有三种：转换成数字、布尔值、字符串
### `==` 和 `===` 的区别

`==` 会进行 `强制类型转换`，比如 `null == undefined`，`1 == ‘1’` 都为 `true`，而 `===` 只有两个操作数在不转换的前提下相等才返回 `true`

**类型转换规则如下：**<br/>
- 如果任一操作数是布尔值，则将其转换为数值再比较是否相等。false 转换为0，true 转换为1。
- 如果一个操作数是字符串，另一个操作数是数值，则尝试将字符串转换为数值，再比较是否相等。
- 如果一个操作数是对象，另一个操作数不是，则调用对象的 valueOf()方法取得其原始值，再根据前面的规则进行比较。 在进行比较时，这两个操作符会遵循如下规则。
- null 和undefined 相等。
- null 和undefined 不能转换为其他类型的值再进行比较。
- 如果有任一操作数是NaN，则相等操作符返回false，不相等操作符返回true。记住：即使两个操作数都是NaN，相等操作符也返回false，因为按照规则，NaN 不等于NaN。
- 如果两个操作数都是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象，则相等操作符返回true。否则，两者不相等。

### 如何让 `if(a == 1 && a == 2)` 条件成立
利用强制类型转换在对象的类型转换会调用对象的 `valueOf` 这一特性
``` js
let num = 1
let a = {
	valueOf: function () {
		return num++
	}
}
console.log(1 == a && 2 == a) // true
```

### 作用域（全局window、函数Function、块级let/const）、作用域链、执行上下文

- **执行上下文：** 指的是当前执行环境中的`变量`、`函数声明`、`参数`、`作用域链`、`this`等信息。分为`全局执行上下文`和`函数执行上下文`，区别在于全局执行上下文只会存在一个、网页关闭时销毁，函数执行上下文会在每次函数执行时创建、函数执行完后销毁。代码的执行的执行上下文创建时以 `栈(先入后出)` 的方式进行的，当前执行的始终是栈顶端的代码
- **作用域：** 简单来说就是变量，对象，函数在代码执行过程中可被访问的权限，在浏览器环境中分为，`全局作用域 window`、`函数作用域`、`块级作用域 let/const`
- **作用域链：** 作用域中访问某个变量时，会首先在当前作用域中查找，若没有，再去它的下级作用域查找，直至找到全局作用，若没有则会报错 `Uncaught ReferenceError: a is not defined`；执行上下文中的代码在执行的时候，会创建变量对象的 `作用域链`
- [**暂时性死区**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let#%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA) 从一个代码块的开始直到代码执行到声明变量的行之前，let 或 const 声明的变量都处于“暂时性死区”，在这期间访问变量将抛出  `ReferenceError`

### 闭包

**闭包** 是指那些引用了另一个函数作用域中变量的函数，通常在 **嵌套函数** 中实现；当执行上下文中的代码执行时，内部函数的作用域链会保存当前上下文的作用域链，此作用域链需要等到闭包函数执行完后才会被销毁

### 内存泄漏

**内存泄漏** 说的是那些声明的变量在将来不会被使用但是又无法被垃圾回收机制回收的那部分内存
> 最常见的如声明了一个全局变量，若这个变量只会使用一次，这意味着在未来他都不会被垃圾回收机制所回收

### 垃圾回收

- `标记清除`：当变量进入上下文，这个变量就会被加上存在于上下文的标记，离开上下文就会被加上离开的标记，然后等待垃圾回收机制的回收
- `引用清除`：当变量赋值给一个引用指时它的引用数+1，反之则-1；当遇到循环引用时有可能其引用数永远都不会变为0，这时就很容易造成内存泄漏

### 原型/原型链

**原型** 每个函数都有一个属性 `prototype` ， `prototype` 有个属性 `constructor` 指向函数本身，通过函数实例化的对象有个属性 `__proto__` 指向函数的 `prototype`，所以有如下关系

``` js
function Func() {}
Func === Func.prototype.constructor // true
a = new Func()
a.__proto__  === Func.prototype // true
```
所以说 `Func.prototype` 就是 `a` 的原型 <br>
**原型链** 当我们访问对象上的属性时，会首先在当前对象上查找，若没找到，就再去其原型上找，直至找到 `Object` 的原型，最后 `Object.prototype.__proto__ === null` 这样的查找路径就是原型链；或者说，每个对象都有一个属性 `__proto__` 指向它构造函数的 `prototype`，而这个构造函数的 `prototype` 的 `__proto__` 又指向了创建 `prototype对象` 的构造函数，这样的一条引用路径就形成了原型链


### 继承
- 原型链继承
- 盗用构造函数
- 组合继承
- 寄生继承

### `arguments` 转化成数组

`arguments` 是类数据结构，但不是数组，可以用如下方法转换为数组，但是 `es6` 后更加推荐使用剩余参数表示

``` js
Array.from(arguments) // es6
[...arguments] // es6
Array.prototype.slice.call(arguments, 0) // es5
```


### 中断 `forEach`

### JS判断数组中是否包含某个值

### 数组扁平化

`es6` 中提供了原生的数组扁平化函数 `flat` ，`flat` 传入一个 `number`（`扁平化深度`，`Infinity` 完全展开）

``` js
/**
 * @param array {[]}
 * @param depth {number}
 */
function flat(array, depth) {
    const res = []
    const nextDepth = depth === Infinity ? Infinity : depth - 1

    for (const item of array) {
        if(depth > 0 && Array.isArray(item)) {
            res.push(...flat(item, nextDepth))
        } else {
            res.push(item)
        }
    }

    return res
}
```


### 高阶函数

使用函数生成新的函数，比如 防抖、节流
- `防抖`：第一次调用函数后，函数会在定义的延迟后执行，若在时间内重新调用，延迟时间会刷新
- `节流`：函数在定义时间内即使多次触发也只会执行一次

### this

- 标准函数中，this 的指向取决于函数的调用方式，标准函数的 this 可以用 bind 固定
- 箭头函数中，this 的指向取决于它的外部环境


### 深、浅拷贝

### `EventLoop`
1. `宏任务(MacroTask)`：渲染事件、交互事件、js脚本执行、网络请求、文件读写完成事件等等
2. `微任务(MicroTask)`：MutationObserver、Promise.then(或.reject) 以及以 Promise 为基础开发的其他技术(比如fetch API), 还包括 V8 的垃圾回收过程

### `ES6` 新增了哪些内容
1. `let`,const,
2. 解构赋值
3. 模板字符串,字符串 `includes()`、`startsWith()`、`endsWith()`
4. `Number.isFinite()`、`Number.isNaN()`、`Number.isInteger()`、`Number.trunc()`、`和Number.sign()`
5. 函数参数的默认值、rest 参数、箭头函数
6. **数组**：`Array.from()`、`Array.of()`、`find()`、`findIndex()`、`fill()`、`entries()`、`keys()`、`values()`、`includes()`、`flat()`、`flatMap()`
7. **对象**： 属性的简洁表示法 `const foo = 'bar';const baz = {foo};`、属性名表达式 `obj['a' + 'bc'] = 123;`、`for...in`、`Object.keys(obj)`、`super 关键字`、`Object.is()`、`Object.assign()`、`Object.keys()`、`Object.values()`、`Object.entries()`
8. `Symbol`
9. `Set`、`WeakSet`、`Map`、`WeakMap`

>  WeakSet WeakMap 键和值都是弱引用，内部的对象不进行引用计数
> 当他两内的对象 引用计数 为0时，在未来的时间随时会被垃圾回收机制回收
> 在 Vue3 中的 tartgetMap 使用了 WeakMap ，在进行渲染时，通过数据的 get ，渲染依赖收集器收集到了目标对象，但是未来当此对象被用户替换且不在其他地方使用此对象，若 tartgetMap 依旧引用此对象将会照成内存泄漏，但是使用 WeakMap 就不会有这个顾虑

10. `Proxy`
11. `Reflect`
12. `Promise`
13. `for...of`
14. `Generator`
15. `async/await` **ES2017**
16. `Class`
17. `Module 语法`

## CSS 相关

### CSS 选择器的权重和优先级

1. `important!` 权总达到最大
2. 内联样式，如: `style="..."`，权值为 `1000`
3. ID选择器，如：`#id`，权值为 `0100`
4. 类，伪类、属性选择器，如 `.class`，权值为 `0010`
5. 类型选择器、伪元素选择器，如 `div`，权值为 `0001`
6. 通配符、子选择器、相邻选择器等。如 `* > +`，权值为 `0000`
7. 继承的样式没有权值

### BFC

`BFC` 就是 **块级格式化上下文（Block Formatting Context）**，他可以通过以下方式创建
- 根元素（`<html>`）
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- overflow 计算值不为 visible 的块元素

为 BFC 的盒子有以下特性：
- 计算 BFC 的高度时，需要计算浮动元素的高度
- BFC 区域不会与浮动的容器发生重叠
- BFC 是独立的容器，容器内部元素不会影响外部元素

### 盒子模型

CSS 中有两种盒子模型，`标准盒子模型` 和 `IE 盒子模型`，标准盒子尺寸计算 `content`; IE 盒子 `content + padding + border` ，两种盒子可以通过 `box-sizing` 改变 `content-box` 和 `border-box`

### 清除浮动

### :first-child() :first-of-type

### 处理水平垂直居中

`CSS3` 最简单的就是使用 `Flex` 进行居中，它对父元素和子元素是否有固定宽高都没有要求，或者使用 `绝对定位+transform` ，水平居中当子元素 `display: block;` 且设置了固定宽度，也可以使用 `margin: 0 auto;` 进行居中


## Vue 相关
- `Vue` 响应式原理
- `v-if` `v-show` 区别
- `Vue diff` 算法
- 组件通信
- `render` 函数
- 生命周期
- `mixins`
- `$nextTick`
- 事件修饰符
- 生命周期
- `v-for key` 相关
- `vue` 路由钩子(全局/组件内)
- [`FLIP`](https://mp.weixin.qq.com/s?__biz=MzI3NTM5NDgzOA==&mid=2247484143&idx=1&sn=049c69d8f79141fdf6404256c01e836f&chksm=eb043a96dc73b380aeb6e694a5a535c93d5be09deffb5dfec988a28725b29a53af24ba625c5a&mpshare=1&scene=24&srcid=0604CtlB4IugAXQuF4awPTtz&sharer_sharetime=1591245594313&sharer_shareid=8595fa68749b63bbe46362081ab0a4ad#rd)

### vue3 相对于 vue2 的变化 [官网](https://v3-migration.vuejs.org/zh/)

- v3 响应式基于 `proxy`；v2 基于 `Object.defineProperty`
- v3 新增的组合式 `API`
- `Teleport` 组件，自定义渲染位置，对弹窗类的组件特别友好
- `fragments` 片段，多根节点
- `v-model` 用于组件时的 `prop` 和默认事件名称调整 `value -> modelValue` ；`input -> update:modelValue`，`.sync` 事件修饰符已被移除；可使用多个 `v-model` ；自定义 `v-model` 修饰符
- `key` 使用的改变
- `v-if`  `v-for` 在同一标签使用优先级的改变；v2 `v-for` 优先级大于 `v-if` ； 由于 v3 的 `v-if` 优先级大于 `v-for`，所以 `v-if` 无法访问 `v-for` 作用域内的变量别名
- `v-bind` 合并行为，v2 独立 `attr` 总会覆盖 `v-bind` 中的对象；v3 取决于定义的顺序
- `v-on.native` 移除，v2 使用 `.native`  绑定原生事件；v3 组件内需要使用 `emit` 定义会被触发的事件，未定义的都将会被设置到元素上，除非设置了 `inheritAttrs`
- 函数式组件 v2 使用 `functional`；v3 直接使用函数进行定义
- 异步组件
- 新增 `emits` 选项
- 渲染函数 `API` ；v2 `render: h => h()` ；v3 全局导入的 `h` ；v3 `VNode props` 扁平化；`resolveComponent`
- 插槽统一 ：v3 `this.$slots` 将插槽作为函数公开，移除 v2 中的 `this.$scopeSlots`
- v3 移除` $listeners` ，事件监听器现在是 `$attrs` 的一部分
- v3 `$attrs` 包含所有传递给组件的 `attribute` ，包括 `class` `style`
- 自定义标签的互操作性
- 按键修饰符：v3 不再支持数字(键码) 作为 `v-on` 的修饰符；不在支持 `config.keyCodes`
- `事件 API`：v3 中 `$on` `$off` `$once` 实例方法已被移除，组件实例不在实现事件触发接口
- v3 移除过滤器
- v3 移除内联模板
- v3 移除组件实例属性 `$children`
- v3 移除 `propsData`
- `Attribute` 强制行为调整
- 自定义指令 钩子变化
- `Data 选项`：v3 中只接受返回 `object` 的 `function` ；`mixin` 合并策略现在是浅层的合并
- v3 挂载的应用不会替换目标元素
- v3 `props` 默认工厂函数不再能访问 `this`
- v3 组件 `Transition` 的 `class` 名更改
- v3 当使用 `<transition>` 作为根结点的组件从外部被切换时将不再触发过渡效果
- `<transition-group>` 不再默认渲染根元素，但仍然可以用 `tag attribute` 创建根元素
- `VNode` 生命周期事件 v2：`@hook:update` ；v3: `@vue:update`
- 侦听数组：v3 监听数组，只有在数组被替换时才会触发回调，可以添加 `deep` 处理这种情况


## 浏览器相关及其他
### 浏览器缓存

当页面加载过一次后，为了降低服务器压力、加快下一次网页的加载速度，浏览器会主动缓存部分资源，主要是静态资源，如：js、css、图片等；<br>
浏览器缓存主要分为 `强缓存` 和 `协商缓存`，强缓存又分为 :

- `disk catch` 缓存在磁盘中，浏览器关闭，依旧会存在
- `memory catch` 缓存在内存中，窗口或者浏览器关闭即会被销毁

当浏览器刷新（刷新按钮或者F5）后加载资源时，会去查看本地是否又缓存，若有即检查缓存是否过期，**通过catch-control的max-age秒和date(缓存有效期的起始计算时间)计算缓存到期时间和本地时间进行比较**，若未过期直接返回 `200` 资源从本地加载，若过期则前往服务器进行协商缓存验证。请求中携带的 `Modify-Since` **（上一次响应头中的 If-Modify-Since 文件最后的修改时间）** 和 `If-no-match` `（ 上一次响应头中的 Etag 通过文件内容生成的 hash ）` ，首先验证 `If-no-match` 和服务器资源计算出来的 `hash` 进行比较，若一致在比较 `If-last-modify` ，若都没变化则返回 `304` ，并把当前的 `Etag` `last-modify` 放在响应头一并返回；若有修改则返回新的资源，并把当前的 `Etag` `last-modify` 放在响应头一并返回，响应值 `200`。

> `nginx` 服务器的 `Etag` 计算会结合 `last-modify` 和 `content` 一起计算，所以即使文件内容没有修改，但是最后修改时间变了 `Etag` 还是会改变；一般场景基本上使用 `last-modify` 依旧足够了，但是存在在较短时间内多次该该文件，由于服务器时间精度问题，可能有文件修改了但是 `last-modify` 没有变化的情况，所以有了 `Etag`，但是它需要在每次请求去计算，这也相当于增加了服务器的负担

### cookies

[http 灵魂之问](https://juejin.cn/post/6844904100035821575#heading-44)<br>
[MDN-cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)

`Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly;SameSite=Strict;Path=/docs;Domain=mozilla.org;`

- `Expires`： 过期时间
- `Secure`： 标记为 `Secure` 的 `Cookie` 只应通过被 `HTTPS` 协议加密过的请求发送给服务端
- `HttpOnly` `JavaScript` `Document.cookie API` 无法访问带有 `HttpOnly` 属性的 `cookie`；此类 `Cookie` 仅作用于服务器。例如，持久化服务器端会话的 `Cookie` 不需要对 JavaScript 可用，而应具有 HttpOnly 属性。此预防措施有助于缓解`跨站点脚本（XSS）攻击`
- `Domain`：
- `Path`：
- `SameSite`： `SameSite` `Cookie` 允许服务器要求某个 `cookie` 在跨站请求时不会被发送，（其中 Site 由可注册域定义），从而可以阻止`跨站请求伪造攻击（CSRF）`
    - **None**。浏览器会在同站请求、跨站请求下继续发送 `cookies`，不区分大小写。
    - **Strict**。浏览器将只在访问相同站点时发送 `cookie`。（在原有 `Cookies` 的限制条件上的加强，如上文 “`Cookie 的作用域`” 所述）
    - **Lax**。与 `Strict` 类似，但用户从外部站点导航至URL时（例如通过链接）除外。 在新版本浏览器中，为默认选项，`Same-site cookies` 将会为一些跨站子请求保留，如图片加载或者 `frames` 的调用，但只有当用户从外部站点导航到URL时才会发送。如 link 链接


### 从输入`URL`到页面呈现发生了什么 (网络相关/解析算法/渲染过程)

[浏览器灵魂之问](https://juejin.cn/post/6844904021308735502#heading-24)

#### 网络请求

1. 构建请求
2. 查找强缓存
3. `DNS（域名系统）`解析，把域名解析为 `IP`
4. 建立 `TCP` 连接，同一域名最多`6`个连接
5. 三次握手建立连接 --> 进行数据传输 --> 4次挥手断开连接
6. `TCP`连接建立完成，发送 `HTTP` 请求
7. 服务器接收、处理请求，返回响应数据
8. 如果请求头或者响应头中是否包含 `Connection: Keep-Alive`，表示持久连接，`TCP` 连接会保持，之后的请求会复用这个连接

#### 解析

1. 解析 `HTML` 文本构建 `DOM` 树
2. 解析 `CSS` 文本转化为结构化对象 `StyleSheets`，标准化 `CSS` 样式数值，计算每个节点的具体样式
3. 生成布局树：遍历生成的 `DOM` 树，添加到布局树中；计算布局树节点定位（ `head 标签`和 `display: node 的元素`不在布局树中）

#### 渲染

1. 建立图层树(`Layer Tree)`
2. 生成绘制列表
3. 生成图块并栅格化
4. 显示器显示内容


### 回流和重绘

- `重排（回流）：`当改变了盒子尺寸，位置，移动、删除、添加DOM，页面初始化，窗口尺寸变化都会造成重排，但是在不同情况下的影响程度是不一样的
- `重绘：`当修改了DOM的颜色，调整阴影等，他们对页面结构不会造成应该，所以只会使浏览器重绘

> 重排一定会引起重绘


1. 缓存 `offsetTop`、`scrollTop`、`getBoundingClientRect` 等这些会引起浏览器强制重排的数据
2. 使用 `position absolute fixed` 使 `dom` 脱离文档流
3. 使用 `will-change` 开启 `GPU 硬件加速`，但是不建议使用过多，它更加占用内存
4. 动画效果中 `transform` 比 `定位、margin` 更加高效，浏览器会为 `dom` 创建单独的 `GPU` 图层

### XSS攻击、CSRF攻击

**CSRF：** `跨站请求伪造（CSRF）` 是一种冒充受信任用户，向服务器发送非预期请求的攻击方式。例如，这些非预期请求可能是通过在跳转链接后的 URL 中加入恶意参数来完成

**XSS:** `跨站脚本攻击（Cross-site scripting，XSS）`是一种安全漏洞，攻击者可以利用这种漏洞在网站上注入恶意的客户端代码。当被攻击者登陆网站时就会自动运行这些恶意代码，从而，攻击者可以突破网站的访问权限，冒充受害者。

### HTTPS & HTTP
[HTTP 知识体系](https://juejin.cn/post/6844904100035821575#heading-101) <br>
[详细解析 HTTP 与 HTTPS 的区别](https://juejin.cn/post/6844903471565504526)

- **HTTP：** 是互联网上应用最为广泛的一种网络协议，是一个客户端和服务器端请求和应答的标准`（TCP）`，用于从`WWW`服务器传输超文本到本地浏览器的传输协议，它可以使浏览器更加高效，使网络传输减少。
- **HTTPS：** 是以安全为目标的`HTTP`通道，简单讲是`HTTP`的安全版，即`HTTP`下加入`SSL`层，`HTTPS`的安全基础是`SSL`，因此加密的详细内容就需要`SSL`。

### 图片懒加载
### `TCP` 和 `UDP`
[链接](https://juejin.cn/post/6844904070889603085#heading-0)

- **TCP:** 面向连接的、可靠的、基于字节流的传输层协议
- **UDP:** 面向无连接的基于数据报的传输层协议

### TCP 三次握手 / 四次挥手
[链接](https://juejin.cn/post/6844904070889603085#heading-1)

#### 三次握手

- 最开始的时候，服务端和客户端都是 `Close` 状态
- 然后服务端启动服务，开始监听某个端口,变成了 `Listen` 状态
- 首先，客户端主动发起连接，发送 `SYN(同步) seq(序列号,由本地随机产生)=x`，自己变成 `SYN-SEND` 状态
- 服务端接收后，返回 `SYN ACK(对应客户端发送的SYN), ack(确认号)=x(收到的序列号)+1，seq=y`，自己变成 `SYN-RCVD` 状态
- 客户端接收，再发送 `ACK seq=x+1 cak=y+1` 给服务端，自己的状态变为 `ESTABLISHED` ，服务端接收到后状态也变成 `ESTABLISHED`
- 然后就开始了数据传输

> **为什么是三次握手** <br>
> Tcp 是可靠的传输协议，为了保证数据的正常传输，服务端和客户端都需要确认对方的数据发送和接收能力，若改为两次握手，服务端无法确定自己的接收能力是否被客户端收到，若改为 4次或者5次 ，但是 3次握手已经足够确认双方的能力，多余的握手已经没有意义了

#### 四次挥手

- 刚开始双方的状态都是 `ESTABLISHED`
- 客户端准备断开连接，向服务端发送 `FIN` 报文，发送后客户端状态变为 `FIN-WAIT-1` ，注意这时候客户端变成了 `half-close(半关闭状态)` 即无法向服务端发送报文，只能接收
- 服务端接收后向服务端确认，状态变为 `CLOSE-WAIT `
- 客户端收到服务端的确认，状态变为了 `FIN-WAIT2`
- 随后服务端向客户端发送 `FIN` ，自己状态变为 `LAST-ACK`
- 客户端收到服务端发来的 `FIN` 后，自己变成了 `TIME-WAIT` 状态，然后发送 `ACK` 给服务端
- 最后，客户端会等待 `2个MSL(Maximum Segment Lifetime，报文最大生存时间)`，这段时间内若客户端没有收到服务端的重发请求，则表示 `ACK` 成功，挥手结束，否则客户端重发 `ACK`


### 前端跨域问题

`浏览器同源策略：` 同源策略可以阻止一部分的 `XSS` `CSRF` 攻击，同一个页面下，`不同域名、协议、端口号` 都属于不同源

- 解决跨域问题主要看实际的场景，因为基本上跨域问题都无法单独在前端解决，都需要代理或者后端的支持；最常见的我们在开发中访问后端服务，若不使用 `node` 进行代理，就会在浏览器报跨域异常，现在的前后端分离的项目，在上线后，前后端使用了不同的服务器或者端口，也会出现跨域问题，这种情况我们会使用 `nginx` 进行代理。
- 其他的解决跨域问题，可以利用 `link` `script` `img` 标签的链接可以跨域的特性， 比如 `JSONP` ；还有需要浏览器和后端支持的 `cors`;
- **JSONP** 主要思路是，利用 `script` 标签可以访问跨域资源，后端返回一段脚本信息，把数据放到脚本中，前端加载完脚本后，执行完成会把数据赋值到全局变量，这样就达到跨域获取数据了

## webpack

- loader 和 plugin 的区别
- webpack 的简单构建流程



## 算法基础

## 数据结构

## 设计模式

- 创建型
1. 单例模式
2. 原型模式
3. 工厂模式
4. 抽象工厂模式
5. 建造者模式


- 结构型
6. 适配器模式
7. 装饰器模式
8. 代理模式
9. 外观模式
10. 桥接模式
11. 组合模式
12. 享元模式


- 行为型
13. 观察者模式（发布—订阅模式）
14. 迭代器模式
15. 策略模式
16. 模板方法模式
17. 职责链模式
18. 命令模式
19. 备忘录模式
20. 状态模式
21. 访问者模式
22. 中介者模式
23. 解释器模式
