# v8垃圾回收机制
[参照1](https://zhuanlan.zhihu.com/p/259579683)

[参照2](https://www.jianshu.com/p/b8ed21e8a4fb)

## v8介绍

V8 名称叫 Chrome V8，是由谷歌开源的一个高性能 JavaScript 引擎。该引擎采用 C++ 编写，Google Chrome 浏览器用的就是这个引擎。V8 可以单独运行，也可以嵌入 C++ 应用当中。和其他的 JavaScript 引擎一样，V8 会编译、执行 JavaScript 代码，并一样会管理内存、垃圾回收等。就是因为 V8 的高性能以及跨平台等特性，所以它也是 Node.js 的 JavaScript 引擎

## v8垃圾回收的限制

- 由于 v8 的单线程机制，在垃圾回收时会暂停 JavaScript 线程，所以过大的内存会导致垃圾回收时间过长 会让用户感觉到明显的卡顿

## 全停顿 - Stop The World

垃圾回收算法执行之前，需要将其他任务全部暂停，等待垃圾回收执行完成后，再接着执行；全停顿是为了解决应用逻辑与垃圾回收器看到的情况不一致的问题

## 对象的可达性

从初始的根对象（window/gloall）开始，向下递归的搜索子对象，能被搜索到的对象将会被添加上标记，不能被搜索到的对象将会被回收

## 新生代垃圾回收器 - Scavenge

`Scavange` 算法将新生代堆分为两部分，分别叫 `from-space` 和 `to-space`。进行垃圾回收时，将 `from-space` 中活动的对象复制到 `to-space` 中，并进行整理，然后释放 `from-space` 中的内存，完成之后将 `from-space` 和 `to-space` 进行互换

## 新生对象晋升

1. 检查对象是否经理过一次 `Scavenge` 回收
2. `to-space` 使用超过 `25%`

##  老生代垃圾回收 - Mark-Sweep & Mark-Compact

- `Mark-Sweep` 标记清除：1、扫描老生代，标记活动对象；2、回收未标记的对象
- `Mark-Compact` 标记整理：1、扫描老生代，标记活动对象，将活动对象移动到一边；回收另外一边的对象

由于 Mark-Compact 需要移动对象，所以执行速度上，比 Mark-Sweep 要慢。所以，V8 主要使用 Mark-Sweep 算法，然后在当空间内存分配不足时，采用 Mark-Compact 算法

## 增量标记 - Incremental Marking

为了减少全停顿的影响，v8 把整个标记阶段拆分为多次进行，中途穿插 js 代码的执行，从而减少对 js线程 的影响

## 延迟清理 - lazy sweeping

增量标记后，在内存足够的情况下允许垃圾回收延迟进行
