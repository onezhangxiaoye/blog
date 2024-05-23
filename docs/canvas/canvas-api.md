# canvas 笔记
## canvas 介绍

> 摘抄自 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

**Canvas API** 提供了一个通过[JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) 和 [HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML)的[`<canvas>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

Canvas API 主要聚焦于 2D 图形。而同样使用`<canvas>`元素的 [WebGL API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API) 则用于绘制硬件加速的 2D 和 3D 图形。

## canvas 使用

### 获取 canvas 上下文

Canvas 的默认大小为 300 像素 ×150 像素（宽 × 高，像素的单位是 px）

``` html 
    <body>
        <canvas id="canvas" style="outline: 2px solid #ccc;"></canvas>
    </body>
    <script>
        const canvas = document.querySelector("#canvas")

        // 获取 2d 上下文
        const ctx = canvas.getContext('2d')
    </script>
```

### 路径绘制的api 和 直接绘制图形的api

- **路径绘制相关的api**：`beginPath` `moveTo` `lineTo` `closePath` `rect` `arc` `arcTo`  `bezierCurveTo` `roundRect`
- **直接绘制图形的api**：`strokeRect` `strokeText` `fillRect` `fillText`

> 需要注意的是 **路径绘制相关的api** 后需要使用 `stroke` 或者 `fill` 才会把图形绘制到画布上；**直接绘制图形的api** 可以直接在画布上绘制图形，不会影响当前的子路径列表

## 使用 canvas 绘图

### beginPath

清空子路径列表开始一个新路径，当你想创建一个新的路径时，调用此方法

### strokeStyle

描述画笔（绘制图形）颜色或者样式的属性。默认值是 `#000`

### lineWidth

设置线段宽度的属性

### moveTo

将一个新的子路径的起始点移动到 (x，y) 坐标的方法

### lineTo

使用直线连接子路径的终点到 x，y 坐标的方法`（并不会真正地绘制）`

### closePath

将笔点返回到当前子路径起始点的方法。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作

### stroke

使用非零环绕规则，根据当前的画线样式（子路径列表），绘制当前或已经存在的路径的方法，`若调用 stroke 时传递了参数，则不会使用当前的子路径列表绘制`

### lineCap

指定如何绘制每一条线段末端的属性。有 3 个可能的值，分别是：`butt (线段末端以方形结束)`, `round (线段末端以圆形结束)` and `square (线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域)`。默认值是 `butt`

<iframe style="width: 100%;height: 400px;" src="https://code.juejin.cn/pen/7185414857754148896"></iframe>


### beginPath 的作用

`beginPath` 清空子路径列表开始一个新路径，当使用了 `beginPath` 后，接下来绘制的所有的路径都会保存在 `子路径列表` 中，若后面没有再执行 `beginPath` ，那么再执行 `stroke` `fill` 将会绘制当前子路径列表中所有的图形。

> 在下面的例子中，第二次绘制前未使用 `beginPath`，实际绘制出来的两个图形都变成了红色，这是因为 `stroke` 会把当前 子路径列表 中的所有路径都绘制出来，两个红色图形，实际上是第二次执行 `stroke` 时把上面的路径再绘制了一次，只是这次绘制的颜色是红色，覆盖掉开始绘制的黑色图形

<iframe style="width: 100%;height: 400px;" src="https://code.juejin.cn/pen/7185458950501269563"></iframe>

### beginPath 和 closePath 的区别

`beginPath` 和 `closePath` 是完全是没有关系的，`closePath` 的作用仅仅只是`连接当前的路径的起点和终点,把当前路径的起点设置为后面路径绘制的起点`，比如说我们画一个三角形，当画了两条边后，我们可以直接使用 `closePath` 把三角形的起点和终点进行连线

```js
[jcode](https://code.juejin.cn/pen/7185470174076600357)
```

### 画长方形和圆

画长方形和圆和画线的操作基本上是一样的

> 在下面例子中，正方形的起点到圆形的起点有一根连线，在同一个子路径列表中使用 `rect` 和 `arc` 画图时，若不使用 `moveTo`，两个不同图形的起点和终点始终会被线连接

<iframe style="width: 100%;height: 400px;" src="https://code.juejin.cn/pen/7185472747349213240"></iframe>

### transform 变换

- `transform(a, b, c, d, e, f)` 使用矩阵多次叠加当前变换；  **a (m11)** 水平缩放；**b (m12)** 垂直倾斜；**c (m21)** 水平倾斜；**d (m22)** 垂直缩放；**e (dx)**  水平移动；**f (dy)** 垂直移动；
- `translate(x,y)` 将 canvas 按原始 x 点的水平方向、原始的 y 点垂直方向进行**平移变换**
- `scale(x, y)` 根据 x 水平方向和 y 垂直方向，为 canvas 单位添加缩放变换
- `rotate(angle)` 在变换矩阵中增加旋转的方法，角度变量表示一个顺时针旋转角度并且用弧度表示


`transform` 变换中的所有 api 设置的变换都是全局的，`transform` 所设置的变换相当于把当前输入的坐标经过变换后再绘制到画布上，如下：代码中设置的正方形的左上角坐标是 `(10,10)` 但是实际绘制的正方形的左上角坐标是 `(30，30)`，接下来我们再设置一个 `(20, 20)` 的平移，第二个正方形实际绘制的坐标是 `(50, 50)` ，**`多次设置的变化，会累积`**


```js
ctx.translate(20, 20)
ctx.beginPath()
ctx.rect(10, 10, 10, 10)
ctx.stroke()

ctx.translate(20, 20)
ctx.beginPath()
ctx.rect(10, 10, 10, 10)
ctx.stroke()
```

### 状态保存 save restore

- `save` 通过将当前状态放入栈中，保存 canvas 全部状态
- `restore` 通过在绘图状态栈中弹出顶端的状态，将 canvas 恢复到最近的保存状态的方法。如果没有保存状态，此方法不做任何改变

**保存到栈中的绘制状态由下面部分组成：**

- 当前的变换矩阵。
- 当前的剪切区域。
- 当前的虚线列表。
- 以下属性当前的值： `strokeStyle`, `fillStyle`, `globalAlpha`, `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`, `lineDashOffset`, `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `shadowColor`, `globalCompositeOperation`, `font`, `textAlign`, `textBaseline`, `direction`, `imageSmoothingEnabled`.

`save restore` 的作用就是重置状态，特别是重置  **变换状态**，在 canvas 中其他的属性的设置都会被后面设置的属性所覆盖，比如 `strokeStyle` ；但是 **变换状态** 是累积计算的，虽然我们可以使用下面这种方式还原 **变换状态**。但是当变换被设置了多次时，还原状态就很麻烦了，这时候我们可以在变换使用之前使用 `save` 保存一次当前的状态，然后等所有操作执行完成，再使用 `restore` 还原到 `save` 保存的状态，这时候后面绘制的内容就不会受变换的影响了

```js
// 还原平移状态
ctx.translate(20, 20)
ctx.translate(-20, -20)

// 还原多次变换状态
// 先使用 save 保存状态
ctx.save()
ctx.translate(20, 20)
ctx.rotate(45 * Math.PI / 180);
ctx.scale(9, 3);
// 还原状态
ctx.restore()

// 这时候后面绘制的内容就不会受变换的影响了
```


### 指针时钟

在时针的绘制中，刻度和指针都需要使用变换来调整他当前的位置，在变换时为了不影响下一次绘制，所以多次使用了 `save` 和 `restore` 来保存和恢复状态

<iframe style="width: 100%;height: 400px;" src="https://code.juejin.cn/pen/7186559745271005243"></iframe>

## canvas 像素操作

对于一个300*150的 canvas 画布，相当于每行有 300 个像素点，每列有 150 个像素点。像素操可能会用到下面这些 api

### ImageData

**`ImageData`** 接口描述 [`<canvas>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 元素的一个隐含像素数据的区域。使用 [`ImageData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData/ImageData "ImageData()") 构造函数创建或者使用和 canvas 在一起的 [`CanvasRenderingContext2D`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D) 对象的创建方法： [`createImageData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/createImageData "createImageData()") 和 [`getImageData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData "getImageData()")。也可以使用 [`putImageData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/putImageData "putImageData()") 设置 canvas 的一部分

> **语法**
>
> `const imageData = new ImageData(array, width, height)`
>
> `const imageData = new ImageData(width, height)`
>
> **width 和 height 都需要是大于 0 的整数**

- `array` 包含图像隐藏像素的 [`Uint8ClampedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) 数组。如果数组没有给定，指定大小的黑色矩形图像将会被创建
- `width` 无符号长整型（unsigned long）数值，描述图像的宽度
- `height` 无符号长整型（unsigned long）数值，描述图像的高度。 如果已给定数组，这个值是可选的：它将通过它的大小和给定的宽度进行推断
- `imageData.width` 图片宽度，单位是像素
- `imageData.height` 图片高度，单位是像素
- `imageData.data` [`Uint8ClampedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) 类型的一维数组，包含着 RGBA 格式的整型数据，范围在 0 至 255 之间（包括 255）；**这里的 alpha 和 css 中使用的 rgba 中的 alpha(0-1) 不一样，他也是 0-255**

data 属性返回一个 [`Uint8ClampedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)，它可以被使用作为查看初始像素数据。每个像素用 4 个 1bytes 值 (按照红，绿，蓝和透明值的顺序; 这就是"RGBA"格式) 来代表。每个颜色值用 0 至 255 来代表。每个部份被分配到一个在数组内连续的索引，左上角像素的红色部份在数组的索引 0 位置。像素从左到右被处理，然后往下，遍历整个数组

**举个例子**： 现在有一个长宽2像素、左上角为(0,0)、背景色为黑色的矩形。相当于这整个矩形需要用2*2=4个像素显示

```js
// 我们先获取矩形的像素数据
const imageData = ctx.getImageData(0,0,2,2)
// 这里 imageData.data 类似于这个数组
let arr = [
  //r,g,b,a
    0,0,0,255, 
    0,0,0,255,
    0,0,0,255, 
    0,0,0,255
]
```


### getImageData

返回一个[`ImageData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData)对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点为 (`sx: 将要被提取的图像数据矩形区域的左上角 x 坐标`, `sy: 将要被提取的图像数据矩形区域的左上角 y 坐标`)、`将要被提取的图像数据矩形区域的宽度 sw`、`将要被提取的图像数据矩形区域的高度 sh`

> **语法** `ctx.getImageData(sx, sy, sw, sh)`

#### putImageData

将数据从已有的 [`ImageData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData) 对象绘制到位图的方法。如果提供了一个绘制过的矩形，则只绘制该矩形的像素。**此方法不受画布转换矩阵的影响**

> **语法**
>
> `void ctx.putImageData(imagedata, dx, dy);`
>
> `void ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);`

- `imagedata` 包含像素值的数组对象
- `dx` 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）
- `dy` 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）
- `dirtyX` 在源图像数据中，矩形区域左上角的位置。默认是整个图像数据的左上角（x 坐标）
- `dirtyY` 在源图像数据中，矩形区域左上角的位置。默认是整个图像数据的左上角（y 坐标）
- `dirtyWidth` 在源图像数据中，矩形区域的宽度。默认是图像数据的宽度
- `dirtyHeight` 在源图像数据中，矩形区域的高度。默认是图像数据的高度

`putImageData` **后4个参数的作用类似裁剪图片**

#### 用于解释 putImageData 后 4 个参数的 demo

<iframe style="width: 100%;height: 400px;" src="https://code.juejin.cn/pen/7187662967725359156"></iframe>

### 把 文字/图片 转换为像素 文字/图片

1. 使用 `getImageData` 获取需要转换区域内的 ` imageData.data`
2. 间隔的遍历 `imageData.data` 获取像素点，把像素点使用需要的图形或者文字重新绘制的新的位置

<iframe style="width: 100%;height: 400px;" src="https://code.juejin.cn/pen/7187692270928756794"></iframe>
