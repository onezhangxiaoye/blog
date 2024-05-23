# svg 笔记

> `svg` 元素的 `transform` `translate` 值有最大值限制，大概是 `+-33554448`，超出会出现非预期的显示异常

- [在线 svg 绘图工具-svg-path-editor](https://yqnn.github.io/svg-path-editor/)
- [有意思！强大的 SVG 滤镜- ChokCoco](https://www.cnblogs.com/coco1s/p/14577507.html)

## svg.viewBox

[MDN-viewBox](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/viewBox)

[张鑫旭-理解SVG viewport,viewBox,preserveAspectRatio缩放](https://www.zhangxinxu.com/wordpress/2014/08/svg-viewport-viewbox-preserveaspectratio/)

`viewBox` 属性允许指定一个给定的一组图形伸展以适应特定的容器元素。<br/>

- 组合属性
  `viewBox` 属性的值是一个包含4个参数的列表 `min-x`:左上角 `x` 坐标值, `min-y`: 左上角 `y` 坐标值, `width`:
  视区宽度 , `height`: 视区高度， 以空格或者逗号分隔开， 在用户空间中指定一个矩形区域映射到给定的元素。不允许宽度和高度为负值,0则禁用元素的呈现。

``` html
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- 对于百分比等相对单位，无论viewBox是什么，正方形的视觉大小看起来都是不变的 -->
  <rect x="0" y="0" width="100%" height="100%"/>

  <!--
    对于一个大的 viewBox，圆圈看起来很小，
    因为它 r 属性使用的像素，
    4 相对于 viewBox 中设置的 100 是较小的
  -->
  <circle cx="50%" cy="50%" r="4" fill="white"/>
</svg>
```

## svg.preserveAspectRatio

`preserveAspectRatio` 表示是否对 `viewBox` 强制进行统一缩放。<br/>

- 组合属性 `xMin`,`xMid`,`xMax`,`YMin`,`YMid`,`YMax` **例如：**`xMinYMin` ：将 `SVG` 元素的 `viewbox` 属性的 `X`
  的最小值与视图的 `X` 的最小值对齐。将 `SVG` 元素的 `viewbox` 属性的 `Y` 的最小值与视图的 `Y` 的最小值对齐。
- `none` 缩放指定元素的图形内容，使元素的边界完全匹配视图矩形，强制拉伸
- `meet` 宽高比将会被保留，整个SVG的viewbox在视图范围内是可见的
- `slice` 宽高比将会被保留，整个视图窗口将覆盖viewbox

## stroke-linecap 路径末端形状

``` html
<svg style="width: 100%;height: 100px;" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">

  <!-- 默认值 “butt” -->
  <line x1="1" y1="1" x2="5" y2="1" stroke="black" stroke-linecap="butt" />
  <line x1="1" y1="3" x2="5" y2="3" stroke="black" stroke-linecap="round" />
  <line x1="1" y1="5" x2="5" y2="5" stroke="black" stroke-linecap="square" />

  <path d="M1,1 h4 M1,3 h4 M1,5 h4" stroke="pink" stroke-width="0.1" />
</svg>
```

<svg style="width: 100%;height: 100px;" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
  <line x1="1" y1="1" x2="5" y2="1" stroke="black" stroke-linecap="butt" />
  <line x1="1" y1="3" x2="5" y2="3" stroke="black" stroke-linecap="round" />
  <line x1="1" y1="5" x2="5" y2="5" stroke="black" stroke-linecap="square" />
  <path d="M1,1 h4 M1,3 h4 M1,5 h4" stroke="pink" stroke-width="0.1" />
</svg>

## linearGradient 线性渐变

``` html
<svg style="width: 200px;height: 200px;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="xbc-svg-linear-gradient" gradientTransform="rotate(90)">
            <stop offset="10%" stop-color="#FFF" />
            <stop offset="50%" stop-color="gold" />
            <stop offset="90%" stop-color="red" />
        </linearGradient>
    </defs>
    <rect x="10" y="10" width="90" height="90" fill="url(#xbc-svg-linear-gradient)"></rect>
</svg>
```

<svg style="width: 100%;height: 200px;" preserveAspectRatio="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="xbc-svg-linear-gradient" gradientTransform="rotate(90)">
            <stop offset="10%" stop-color="#FFF" />
            <stop offset="50%" stop-color="gold" />
            <stop offset="90%" stop-color="red" />
        </linearGradient>
    </defs>
    <rect x="0" y="0" width="100" height="100" fill="url(#xbc-svg-linear-gradient)"></rect>
</svg>

## SVG 滤镜

- `feBlend`: 把两个对象组合在一起，使它们受特定的混合模式控制。这类似于图像编辑软件中混合两个图层。该模式由属性 `mode` 定义;
- `feColorMatrix`: 该滤镜基于转换矩阵对颜色进行变换。每一像素的颜色值(一个表示为[红,绿,蓝,透明度] 的矢量)
  都经过矩阵乘法 (matrix multiplated) 计算出的新颜色
- `feComponentTransfer`:
- `feComposite`:
- `feConvolveMatrix`:
- `feDiffuseLighting`:
- `feDisplacementMap`:
- `feFlood`:
- `feGaussianBlur`:
- `feImage`:
- `feMerge`:
- `feMorphology`:
- `feOffset`:
- `feSpecularLighting`:
- `feTile`:
- `feTurbulence`:
- `feDistantLight`:
- `fePointLight`:
- `feSpotLight`:

## SVG animation

[张鑫旭 超级强大的SVG SMIL animation动画详解](https://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/)

这是一个最简单的旋转动画
``` html
<svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <polygon points="60,30 90,90 30,90">
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 60 70"
            to="360 60 70"
            dur="10s"
            repeatCount="indefinite"
        />
    </polygon>
</svg>
```

<svg style="width: 100%;height: 200px;" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,30 90,90 30,90" fill="#42b983">
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 60 70"
            to="360 60 70"
            dur="10s"
            repeatCount="indefinite"
        />
    </polygon>
</svg>