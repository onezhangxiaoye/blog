# vue的$nextTick

- `$nextTick` 参照文章
- [Vue源码详解之nextTick：MutationObserver只是浮云，microtask才是核心！](https://segmentfault.com/a/1190000008589736)
- [ssh 深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系](https://mp.weixin.qq.com/s/l9pGe7-xY08DeaFMnk0xuA)

## $nextTick
- `$nextTick` 的处理，在 `Vue` 中实际定义的叫 `timerFunc`

## $nextTick 使用 setTimeout 存在的问题
> 下面这两个例子，通过绑定 `Scroll` 事件，获取其 `scroll-top` ，实时去改变 `dom style`，通过下拉右边滚动条发现，通过 `setTimeout` 实现的 `$nextTick`，的那个方块会存在严重的抖动，而 `Promise` 实现的则没有这个问题

[$nextTick-promise实现-CodePen](https://codepen.io/onezhangxiaoye/pen/poNYQVY)

[$nextTick-setTimeout实现-CodePen](https://codepen.io/onezhangxiaoye/pen/GRNewQM)

> - 涉及到了 `宏任务 macro-task` 和 `微任务 micro-task`，在 `EventLoop` 中的执行顺序问题。
> - 其实单从完成数据的更新来看，使用宏任务或者微任务是没有任何区别的，他们都能完成工作，但是在某些情况下，会出现数据更新的延迟：
> - 比如上面的例子在 `Scroll` 事件中当用户下拉时，当第一次触发UI事件，`vue` 执行 `$nextTick` 会向 `task` 队列推入一个 `setTimeout` ，**然后这个 `setTimeout` 任务必须要等到当前这个宏任务执行完成后才有机会执行，但是实际上在这个宏任务执行之前，浏览器已经执行了一次页面的重绘，重绘后页面内容整体上移，方块的位置也向上移动了，接下来才执行了 `setTimeout` 这个宏任务，这次宏任务所更新的方块位置依旧需要等到下次页面的重绘才会展示到页面上，所以方块渲染的位置和当前的预期的位置就出现了一定的误差，就出现了方块一直在抖动的问题。**
> - 若实现方式为 `Promise` ，当第一次UI事件触发时，`vue` 执行 `$nextTick` 会向微任务队列推入一个 `promise` ，而这个微任务会在当前宏任务执行期间内执行完成，宏任务执行完成后页面重绘后方块的位置就是当前实际预期的位置，方块就会很稳定


### 降级顺序
> `Promise` => `MutationObserver` => `setImmediate` => `setTimeout`

### Promise(微任务)

``` javascript
var p = Promise.resolve();
timerFunc = function () {
  p.then(flushCallbacks);
  // 省略部分
};
```

### MutationObserver (微任务)
> - 提供了监视对DOM树所做更改的能力 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)

``` javascript
var counter = 1;
var observer = new MutationObserver(flushCallbacks);
var textNode = document.createTextNode(String(counter));
observer.observe(textNode, {
  // 设为 true 以监视指定目标节点或子节点树中节点所包含的字符数据的变化
  characterData: true
});
timerFunc = function () {
  counter = (counter + 1) % 2;
  textNode.data = String(counter);
};
```
### setImmediate (宏任务)
> - `当前只有 IE 支持`， [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate)，该方法用来把一些需要长时间运行的操作放在一个回调函数里，在浏览器完成后面的其他语句后，就立刻执行这个回调函数。
> - `Vue 注释` **Fallback to setImmediate.Technically it leverages the (macro) task queue,but it is still a better choice than setTimeout.**


``` javascript
timerFunc = function () {
  setImmediate(flushCallbacks);
};
```

### MessageChannel
> - 以前 `vue` 版本存在，后面移除了

``` javascript
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
```


### setTimeout (宏任务)

``` javascript
timerFunc = function () {
  setTimeout(flushCallbacks, 0);
};
```

## vue3的 $nextTick
> - `vue3` 的 `$nextTick` 直接使用 `Promise` 不进行降级处理了

``` typescript

const resolvedPromise: Promise<any> = Promise.resolve()
export function nextTick(fn?: () => void): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(fn) : p
}
```
