# Less  4.1.2 常用语法笔记

## 变量

变量以美元符号 `@` 开头，赋值方法与 CSS 属性的写法一样

## 插值语句

通过 `@{}` 插值语句可以在选择器或属性名中使用变量

```less
@name: foo;
@attr: border;
p.@{name} {
  @{attr}: blue;
}
```

编译为

```css
p.foo {
  border: blue;
}
```

## if

```less
@some: foo;

div {
    margin: if((2 > 1), 0, 3px);
    color:  if((iscolor(@some)), @some, black);
}
```

编译为

```css
div {
    margin: 0;
    color:  black;
}
```

## each

```less
@list: range(2, 4);

each(@list, {
  div:nth-child(@{value}) {
    width: @value*1px;
  }
})

@selectors: blue, green, red;

each(@selectors, {
  .span-@{value}:nth-child(@{index}) {
    color: @value;
  }
})
```

编译为

```css
div:nth-child(2) {
  width: 2px;
}
div:nth-child(3) {
  width: 3px;
}
div:nth-child(4) {
  width: 4px;
}
.span-blue:nth-child(1) {
  color: blue;
}
.span-green:nth-child(2) {
  color: green;
}
.span-red:nth-child(3) {
  color: red;
}

```

## Mixins 混入

定义的每个样式在 `less` 中都可以当作混入使用

```less
.a,
#b {
  color: red;
}
.mixin-class {
  .a();
}
.mixin-id {
  #b();
}
.mixin-all {
  .mixin-class();
}

```

编译为

```css
.a,
#b {
  color: red;
}
.mixin-class {
  color: red;
}
.mixin-id {
  color: red;
}
.mixin-all {
  color: red;
}

```

## 有参数的混入

```less
.color-func(@color) {
  color: @color;
}

div {
  .color-func(red);
}
```

编译为

```css
div {
  color: red;
}
```

## 把 `mixins` 当作函数使用 v3.5.0+

和 scss 比较起来，写法有点太复杂了

```less
.double-size(@num) {
  @result: @num*2;
}

div {
  width: .double-size(12px)[@result];
  margin-top: .double-size(1em)[@result];
}
```

编译为

```css
div {
  width: 24px;
  margin-top: 2em;
}
```

