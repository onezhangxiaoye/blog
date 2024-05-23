# Sass 常用语法笔记

## 安装 Dart-Sass

- `npm install sass sass-loader --save-dev`

## 变量

`SassScript` 最普遍的用法就是变量，变量以美元符号 `$$` 开头，赋值方法与 CSS 属性的写法一样

## 插值语句

通过 `#{}` 插值语句可以在选择器或属性名中使用变量

```scss
$name: foo;
$attr: border;
p.#{$name} {
  #{$attr}-color: blue;
}
```

编译为

```css
p.foo {
  border-color: blue;
}
```

## @if

```scss
  p {
    @if 1 + 1 == 2 { border: 1px solid; }
    @if 5 < 3 { border: 2px dotted; }
    @if null  { border: 3px double; }
  }
```

编译为

```css
p {
  border: 1px solid;
}
```

## @for

这个指令包含两种格式:

*   `@for $var from <start> through <end>`: 条件范围包含 `<start>` 与 `<end>` 的值
*   `@for $var from <start> to <end>`: 条件范围只包含 `<start>` 的值不包含 `<end>` 的值

```scss
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
```

编译为

```css
.item-1 {
  width: 2em;
}
.item-2 {
  width: 4em;
}
.item-3 {
  width: 6em;
}
```

## @each

`@each` 指令的格式是 `$var in <list>`, `$var` 可以是任何变量名，比如 `$length` 或者 `$name`，而 `<list>` 是一连串的值，也就是值列表

```scss
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
```

编译为

```css
.puma-icon {
  background-image: url('/images/puma.png');
}
.sea-slug-icon {
  background-image: url('/images/sea-slug.png');
}
.egret-icon {
  background-image: url('/images/egret.png');
}
.salamander-icon {
  background-image: url('/images/salamander.png');
}
```

## @while

```scss
$i: 6;
@while $i > 0 {
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}
```

编译为

```css
.item-6 {
  width: 12em;
}

.item-4 {
  width: 8em;
}

.item-2 {
  width: 4em;
}
```

## @mixin 混入

```scss
@mixin sexy-border($color, $width) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p {
  @include sexy-border(blue, 1in);
}
```

编译为

```css
p {
  border-color: blue;
  border-width: 1in;
  border-style: dashed;
}
```

## 函数指令

```scss
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar {
  width: grid-width(5);
}
```

编译为

```css
#sidebar {
  width: 240px;
}
```