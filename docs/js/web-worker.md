# web worker

[阮一峰 Web Worker 使用教程](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)
[MDN 使用 Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers#web_workers_api)

`Web Worker` 为 `Web` 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。此外，他们可以使用 `XMLHttpRequest` 执行 `I/O `(尽管 `responseXML` 和 `channel` 属性总是为空)。一旦创建，一个 `worker` 可以将消息发送到创建它的 JavaScript 代码，通过将消息发布到该代码指定的事件处理程序（反之亦然）。

## web worker 的限制

- 同源限制
    - **分配给 `worker` 线程运行的脚本文件，必须与主线程的脚本文件同源**。
- `DOM` 限制
    - `worker` 线程所在的全局对象 (`self`)，与主线程不一样，无法读取主线程所在网页的 `DOM` 对象，也无法使用 `document`、`window`、`parent` 这些对象。但是，`worker` 线程可以 `navigator` 对象和 `location` 对象。
- 文件限制
    - `worker` 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。

## 主线程使用方法

- [worker.postMessage(aMessage, transferList)](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker/postMessage) 向 `worker` 线程发送数据，
    - `aMessage` **它可以是各种数据类型，包括二进制数据**
    - `transferList` 一个可选的 `Transferable` 对象的数组，用于传递所有权。如果一个对象的所有权被转移，在发送它的上下文中将变为不可用（中止），并且只有在它被发送到的 worker 中可用。 可转移对象是如 `ArrayBuffer`，`MessagePort` 或 `ImageBitmap` 的实例对象。`transferList` 数组中不可传入 `null` 。
- `worker.terminate()` 用于关闭 `worker` 线程
- `worker.addEventListener('message', callback)` 用于监听 `worker` 线程发送过来的消息

```  
var worker = new Worker('worker.js')

worker.postMessage('hello web worker')

worker.addEventListener('message', function (e) {
    // 事件对象的 data 属性可以获取 Worker 发来的数据
    console.log('主线程收到的消息: ', e.data);
})
```

## worker 线程使用方法

在 `worker` 线程中的全局对象是 `self` 最外层的 `this === self`

- `self.addEventListener('message', callback)` 用于监听主线程发送过来的消息
- `self.postMessage` 向主线程发送数据，**它可以是各种数据类型，包括二进制数据**
- `self.close()` 在子线程中关闭自身

``` js
self.addEventListener('message', function name(e) {
    // const v = getCount()
    self.postMessage({
        name: '张三',
        age: 123,
    })
})
```

## worker 线程加载脚本

加载多个脚本 `importScripts('script1.js', 'script2.js');`


## canvas 离屏渲染

- [HTMLCanvasElement.transferControlToOffscreen()](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen) 将控制转移到一个在主线程或者 `web worker` 的 `OffscreenCanvas` 对象上。
- [OffscreenCanvas](https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas) 提供了一个可以脱离屏幕渲染的 `canvas` 对象。它在窗口环境和 `web worker` 环境均有效
- `OffscreenCanvas.getContext()` 为 `offscreen canvas` 对象返回一个渲染画布。
- `OffscreenCanvas.toBlob()` 创建一个代表 `canvas` 中的图像的 `Blob` 对象。
- `OffscreenCanvas.transferToImageBitmap()` 从 `OffscreenCanvas` 最近渲染的图像创建一个 `ImageBitmap` 对象。

``` js
// 主线程中获取 canvas dom
var worker = new Worker('worker.js')

const canvas = document.getElementById("canvas")

const offscreen  = canvas.transferControlToOffscreen()

worker.postMessage({ canvas: offscreen }, [offscreen])

worker.addEventListener('message', function (e) {
    console.log('主线程收到的消息: ', e.data);
    console.log(performance.now());
})
```


``` js
// worker.js 中绘制
self.addEventListener('message', function name(e) {
    let canvas = e.data.canvas
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 6
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(20, 20)
    ctx.lineTo(20, 100)

    ctx.stroke()
})
```

## 使用 worker 执行耗时操作，保证主线程的运行不卡顿

``` js
// worker.js 执行 10亿次的累加，等待计算完成再返回给主线程

function accumulation() {
    let a = 0
    for (let i = 0; i < 1000000000; i++) {
        a += Math.random()
    }
    return a
}

self.addEventListener('message', function name(e) {
    const res = accumulation()
    self.postMessage(res)
})
```
