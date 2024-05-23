# CSS-Grid-网格布局

参照：[阮一峰 CSS Grid 网格布局教程](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

## 这是一个简单的例子
<div class="css-grid-box">
    <div style="background-color: rgb(239,52,41);" class="css-grid-box-item css-grid-box-item-1">1</div>
    <div style="background-color: rgb(246,143,37);" class="css-grid-box-item">2</div>
    <div style="background-color: rgb(75,168,70);" class="css-grid-box-item">3</div>
    <div style="background-color: rgb(4,118,194);" class="css-grid-box-item">4</div>
    <div style="background-color: rgb(192,119,175);" class="css-grid-box-item">5</div>
    <div style="background-color: rgb(248,210,157);" class="css-grid-box-item">6</div>
    <div style="background-color: rgb(180,168,127);" class="css-grid-box-item">7</div>
    <div style="background-color: rgb(208,228,168);" class="css-grid-box-item">8</div>
    <div style="background-color: rgb(77,199,236);" class="css-grid-box-item">9</div>
</div>


``` html
<div class="css-grid-box">
    <div style="background-color: rgb(239,52,41);" class="css-grid-box-item css-grid-box-item-1">1</div>
    <div style="background-color: rgb(246,143,37);" class="css-grid-box-item">2</div>
    <div style="background-color: rgb(75,168,70);" class="css-grid-box-item">3</div>
    <div style="background-color: rgb(4,118,194);" class="css-grid-box-item">4</div>
    <div style="background-color: rgb(192,119,175);" class="css-grid-box-item">5</div>
    <div style="background-color: rgb(248,210,157);" class="css-grid-box-item">6</div>
    <div style="background-color: rgb(180,168,127);" class="css-grid-box-item">7</div>
    <div style="background-color: rgb(208,228,168);" class="css-grid-box-item">8</div>
    <div style="background-color: rgb(77,199,236);" class="css-grid-box-item">9</div>
</div>

<style>
  .css-grid-box {
      width: 300px;
      height: 300px;
      outline: 2px dashed;

      display: grid;
      grid-template-columns: repeat(3, 100px);
  }
  .css-grid-box-item {
      font-size: 50px;
      text-align: center;
  }
</style>
```

## 可操作实例
<GridTest />

## 容器属性
### grid-template-columns 和 grid-template-rows
`grid-template-columns` 属性定义每一列的列宽，`grid-template-rows` 属性定义每一行的行高 <br>

##### grid-template-columns 和 grid-template-rows 多种写法
`grid-template-columns: 100px 100px 100px;`: 表示三列，每列宽度 100px

##### repeat()
`grid-template-columns: repeat(3, 100px);`: 重复后面的数据 `3` 次，类似 `grid-template-columns: 100px 100px 100px;`<br>
`grid-template-columns: repeat(2, 50px 20px);`: 类似 `grid-template-columns: 50px, 20px 50px, 20px;`
##### auto
`grid-template-columns: 100px 100px auto;`: `auto` 表示宽度自动占满剩余宽度

##### fr
`grid-template-columns: 100px 1fr 2fr;`: `1fr 2fr` 将会按照 `1:2` 的比例使用剩余宽度

##### auto-fill
`grid-template-columns: repeat(auto-fill, 100px);`: 列数不确定，自动填充满再换行。假如当前容器宽度为 `600px` ，`每个子容器宽度100px` ，则一行最后可填充 `6` 个子容器，然后再换行

##### 百分比
`grid-template-columns: 70% 30%;`: 第一列占容器宽度的 `70%` ，第二列 `30%`

##### 网格线的名称
`grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];`


### grid-row-gap 和 grid-column-gap 和 grid-gap
`grid-gap` 属性是 `grid-column-gap` 和 `grid-row-gap` 的合并简写形式，语法：`grid-gap: <grid-row-gap> <grid-column-gap>;`

::: tip
根据最新标准，上面三个属性名的 `grid-` 前缀已经删除，`grid-column-gap` 和 `grid-row-gap` 写成 `column-gap` 和 `row-gap` ，`grid-gap` 写成gap。
:::

``` css
.container {
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  /** 或者 **/
  grid-gap: 20px 20px;
}
```

### grid-auto-flow
> 划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是`"先行后列"`，即先填满第一行，再开始放入第二行，即顶部例子的顺序。

- `row(默认值)`：先行后列
- `colums`：先列后行
- `row dense`：在行排列过程中，若前面没有填满且后面可以填进去，会优先把那个位置填上
- `column dense`：同上

### justify-items 和 align-items 和 place-items

> `justify-items` 属性设置单元格内容的水平位置（左中右），`align-items` 属性设置单元格内容的垂直位置（上中下）。`place-items` 属性是 `align-items` 属性和 `justify-items` 属性的合并简写形式，语法：`place-items: <align-items> <justify-items>;`。

- `stretch（默认值）`：拉伸，占满单元格的整个宽度。
- `start`：对齐单元格的起始边缘。
- `end`：对齐单元格的结束边缘。
- `center`：单元格内部居中。

### justify-content 和，align-content 和 place-content
> `justify-content` 属性是整个内容区域在容器里面的水平位置（左中右），`align-content` 属性是整个内容区域的垂直位置（上中下）。`place-content` 属性是 `align-content` 属性和 `justify-content` 属性的合并简写形式，语法：`place-content: <align-content> <justify-content>`。

### grid-auto-columns 和 grid-auto-rows
有时候，一些项目的指定位置，在现有网格的外部。比如网格只有 `3` 列，但是某一个项目指定在第 `5` 行。这时，浏览器会自动生成多余的网格，以便放置项目。<br>
`grid-auto-columns` 属性和 `grid-auto-rows` 属性用来设置，浏览器自动创建的多余网格的列宽和行高。它们的写法与 `grid-template-columns` 和 `grid-template-rows` 完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

### grid-template 和 grid
> **`grid-template`** 属性是 `grid-template-columns` 、 `grid-template-rows` 和 `grid-template-areas` 这三个属性的合并简写形式。 <br>
**`grid`** 属性是 `grid-template-rows` 、 `grid-template-columns` 、 `grid-template-areas` 、 `grid-auto-rows` 、 `grid-auto-columns` 、 `grid-auto-flow` 这六个属性的合并简写形式。

## 项目属性

### grid-column-start 和 grid-column-end 和 grid-row-start 和 grid-row-end 和 grid-column 和 grid-row
> `grid-column` 属性是 `grid-column-start` 和 `grid-column-end` 的合并简写形式，`grid-row` 属性是 `grid-row-start` 属性和 `grid-row-end` 的合并简写形式。

- `grid-column-start`：左边框所在的垂直网格线
- `grid-column-end`：右边框所在的垂直网格线
- `grid-row-start` ：上边框所在的水平网格线
- `grid-row-end` ：下边框所在的水平网格线

``` css
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
/* 等同于 */
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于。 斜杠以及后面的部分如果省略，默认跨越一个网格 */
.item-1 {
  grid-column: 1 / span 2;
  grid-row: 1;
}
```

### justify-self 和 align-self 和 place-self
> 这三个属性只作用于单个项目，`justify-self` 属性设置单元格内容的水平位置（左中右），`align-self` 属性设置单元格内容的垂直位置（上中下。`place-self` 属性是 `align-self` 属性和 `justify-self` 属性的合并简写形式。


<script setup>
import GridTest from '../public/components/GridTest.vue'
</script>


<style>
.css-grid-box {
    width: 300px;
    height: 300px;
    outline: 2px dashed;

    display: grid;
    grid-template-columns: repeat(3, 100px);
}
.css-grid-box-item {
    font-size: 50px;
    text-align: center;
}
</style>




