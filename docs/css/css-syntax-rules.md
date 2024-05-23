# CSS语法规则

参照： [css新世界-微信读书](https://weread.qq.com/web/reader/13c32c90726fa07d13c0072kc51323901dc51ce410c121b)

参照： [CSS值类型文档大全](https://www.zhangxinxu.com/wordpress/2019/11/css-value-type/)

| 符号  | 名称 | 描述 |
| --- | --- | --- |
|  | 字面符号 |  |
| , | 并列分隔符 | 用来分隔数个并列值，或分隔函数的参数值 |
| / | 缩写分隔符 | 用来分隔一个值的多个部分，在CSS缩写中用于分离类型相同但属于不同CSS属性的值，以及用在部分CSS函数中 |
|  | 组合符号 |  |
| 空格 | 并列 | 符号为普通空格字符，表示各部分必须出现，同时需要按顺序出现 |
| && | “于”组合符 | 各部分必须出现，但可以不按顺序出现 |
| \|\| | “或”组合符 | 各部分至少出现一个，可以不按顺序出现 |
| \| | “互斥”组合符 | 各部分恰好出现其中一个 |
| [] | 方括号 | 将各部分进行分组以绕过上面几个符号的优先规则，因此方括号的优先级最高 |
|  | 数量符号 |  |
|  | 无数量符号 | 恰好出现一次 |
| * | 星号 | 可以出现任意次数 |
| + | 加号 | 可以出现一次或者多次 |
| ? | 问号 | 可以出现零次或者一次，也就是该元素可有可无 |
| \{m,n\} | 花括号 | 最少出现m次，最多出现n次 |
| # | 井号 | 可以出现一次或者多次，但出现时必须以逗号分隔 |
| ! | 叹号 | 表示当前分组必须产生一个值，该符号多出现在组合符号方括号的后面 |


## 渐变例子： linear-gradient()

```

linear-gradient(
  [ <angle> | to <side-or-corner> ,]? <color-stop-list> )
  \---------------------------------/ \----------------------------/
    Definition of the gradient line        List of color stops

where <side-or-corner> = [ left | right ] || [ top | bottom ]
  and <color-stop-list> = [ <linear-color-stop> [, <color-hint>? ]? ]#, <linear-color-stop>
  and <linear-color-stop> = <color> [ <color-stop-length> ]?
  and <color-stop-length> = [ <percentage> | <length> ]{1,2}
  and <color-hint> = [ <percentage> | <length> ]
  
``` 

### 符合规则的多种语法
``` css
.css-box {
    height: 30vh;
    /* 当不设置 <side-or-corner> 时，默认是 to bottom */
    background: linear-gradient(to left, #3F51B5 20%, red);
    background: linear-gradient(to top, #3F51B5 20%, red);
    background: linear-gradient(to bottom right, #3F51B5 20%, red);
    /* 为角度时，为逆时针旋转 */
    background: linear-gradient(90deg, #3F51B5 20%, red);
    background: linear-gradient(90deg, #3F51B5, red);
    background: linear-gradient(90deg, #3F51B5, #8E8883, #083E80, #FF5722, red);
    background: linear-gradient(90deg, #3F51B5, #8E8883 10%, #083E80, #FF5722 5%, red);
    background: linear-gradient(45deg, red 0 50%, blue 50% 100%);
  
}
```



## 重复渐变例子： repeating-linear-gradient()

```

repeating-linear-gradient(  [ <angle> | to <side-or-corner> ,]? <color-stop> [, <color-stop>]+ )
                            \---------------------------------/ \----------------------------/
                              渐变轴的定义                                色标列表

where <side-or-corner> = [left | right] || [top | bottom]
   and <color-stop>     = <color> [ <percentage> | <length> ]?

```

### 符合规则的多种语法
``` css
.css-box {
    height: 30vh;
    background: repeating-linear-gradient(to right, transparent 0 20px, blue 20px 22px, transparent 22px 42px, red 42px 44px),
                repeating-linear-gradient(to bottom, transparent 0 20px, blue 20px 22px, transparent 22px 42px, red 42px 44px);
}
```
