# 正则表达式速查

- 参考：[掘金-正则表达式不要背](https://juejin.cn/post/6844903845227659271#heading-16)
- 参考：[掘金-JS正则表达式完整教程](https://juejin.cn/post/6844903487155732494)
- 工具： [https://regexper.com/](https://regexper.com/)

## 速查表

| 正则表达式      |  解释   |  |
|:-----------| :--- | :--- |
| \t\v\n\r\f | 匹配水平制表符、垂直制表符、换行符、回车符、换页符 |     |
| .          | 除换行符之外的字符 |     |
| \d         | 单个数字, [0-9] | '菜ad1ad3'.replace(/\d/g, '')  <br> 输出：菜adad |
| \D         | 匹配非数字，等价于 [^0-9] |  '菜ad1ad3'.replace(/\D/g, '') <br> 输出：13 |
| \w         | 匹配单词字符，等价于 [a-zA-Z0-9_] | '菜ad1a_d3'.replace(/\w/g, '') <br> 输出：菜 |
| \W         | 匹配非单词字符，等价于 [^a-zA-Z0-9_] | '菜ad1a_d3'.replace(/\W/g, '') <br> 输出：ad1a_d3 |
| \s         | 匹配空白符，等价于 [ \t\v\n\r\f] |  |
| \S         | 匹配非空白符，等价于 [^ \t\v\n\r\f] |     |     |
| --------   |  --------   |  --------   |
| [abc]      |  匹配 "a"、"b"、"c" 其中任何一个字符 |  '菜ad1a_d3'.replace(/[ad]/g, '') <br> 输出：菜1_3 |
| [^abc]     |  匹配除了 "a"、"b"、"c" 之外的任何一个字符 | '菜ad1a_d3'.replace(/[^ad]/g, '') <br> 输出：adad |
| [a-c1-3]   | 匹配 "a"、"b"、"c"、"1"、"2"、"3" 其中任何一个字符 |  '菜ad1a_d3'.replace(/[a-c1-3]/g, '') <br> 输出：菜d_d |
| ?          | 等价于{0,1} 贪婪模式 | '123456'.replace(/\d?/, '') <br> 输出： 23456 |
| *          | 等价于{0,} 贪婪模式 | '123456'.replace(/\d*/, '') <br> 输出： 输出空字符串 |
| +          | 等价于{1,} 贪婪模式 | '123456'.replace(/\d+/, '') <br> 输出： 输出空字符串 |
| \{n,m\}    | 连续出现 n 到 m 次，贪婪模式 | '123456'.replace(/\d{2,5}/, '') <br> 输出： 6 |
| \{n,\}     | 至少连续出现 n 次，贪婪模式  | '123456'.replace(/\d{2,}/, '') <br> 输出： 输出空字符串 |
| \{n\}      | 连续出现 n 次，贪婪模式 | '123456'.replace(/\d{2}/, '') <br> 输出： 3456 |
| \{n,m\}?   | 连续出现 n 到 m 次，惰性模式 | '123456'.replace(/\d{2,5}?/, '') <br> 输出： 3456 |
| ??         | 等价于{0,1}? 惰性模式 | '123456'.replace(/\d??/, '') <br> 输出： 123456 |
| +?         | 等价于{1,}? 惰性模式 | '123456'.replace(/\d+?/, '') <br> 输出： 23456 |
| *?         | 等价于{0,}? 惰性模式 | '123456'.replace(/\d*?/, '') <br> 输出： 123456 |
| --------   |  --------   |  --------   |
| \b         | 单词边界 | 'java script'.replace(/\b/g, '-') <br> 输出： -java- -script- |
| \B         | 非单词边界 | 'java script'.replace(/\B/g, '-') <br> 输出： j-a-v-a s-c-r-i-p-t |
| ^          | 字符串开头 | 'java script'.replace(/^/g, '-') <br> 输出： -java script |
| $          | 字符串结尾 | 'java script'.replace(/$/g, '-') <br> 输出： java script- |
| m 标志       | 多行匹配，把 ^ 和 $ 变成行开头和行结尾 |     |
| i 标志       | 匹配过程中，忽略英文字母大小写 | 'aaaAAA'.replace(/a/ig, '') <br> 输出： 输出空字符串 |
| g 标志       | 全局匹配，找到所有满足匹配的子串 | 'aaaAAA'.replace(/a/g, '') <br> 输出： AAA |
| --------   |  --------   |   --------  |
| \0,\1,\2   | 分组引用 | 统计重复次数大于2的字母数量 <br> 'aaaabbbcddde'.match(/([a-z])\1+/g).length <br> 输出：3 |
| (\?\:)     |  非捕获组   |     |
| (?=abc)    | 匹配 "abc" 前面的位置   |  '12342672'.replace(/(?=2)/g, '-') <br> 输出： 1-234-267-2 |
| (?!abc)    | 匹配非 "abc" 前面的位置   | '12342672'.replace(/(?!2)/g, '-') <br> 输出： -12-3-42-6-72- |
| (?<=abc)   | 匹配 "abc" 后面的位置    |  '12342672'.replace(/(?<=2)/g, '-') <br> 输出： 12-342-672- |
| (?<!abc)   | 匹配非 "abc" 后面的位置    | '12342672'.replace(/(?<!2)/g, '-') <br> 输出： -1-23-4-26-7-2 |
| --------   |  --------   |  --------   |
| [^regex]   | 非  | 'abcde'.replace(/[^ab]/g, '') <br> 输出： ab |
| \          |   |   或  | 'abcde'.replace(/ab\|cd/g, '') <br> 输出： e |

## 贪婪于惰性模式

> 贪婪模式会尽可能多的匹配，惰性模式会尽可能少的匹配

``` javascript
// 贪婪模式
console.log(
    '123 1234 12345 123456'.match(/\d{2,5}/g)
)
// 输出 [ '123', '1234', '12345', '12345' ]


// 惰性模式
console.log(
    '123 1234 12345 123456'.match(/\d{2,5}?/g)
)
// 输出 ['12', '12', '34', '12', '34', '12', '34', '56']
```

## 数字的千位分隔符
``` javascript
console.log(
    '1234567890'.replace(/(?!^)(?=((\d{3})+$))/g, ',')
)

// 输出 1,234,567,890
```

## 字符串中数字都加1
``` javascript
'12c345a678nn0'.replace(/(\d)/g, match => {
    return +match +1
})
// 输出 23c456a789nn1
```

## 匹配16进制颜色
``` javascript
console.log(
    '#ffffff #Fc01DF #FfF #fffa'.match(/#([a-z0-9]){6}|([a-z0-9]){3}/gi)
)

// 输出 [ '#ffffff', '#Fc01DF', 'FfF', 'fff' ]
```

## 匹配16进制颜色 如: #ffF #000000
``` javascript
console.log(
    '#ffffff #Fc01DF #FfF #fff'.match(/#([0-9a-z])(\1{5}|\1{2})/gi)
)

// 输出 [ '#ffffff', '#FfF', '#fff' ]
```

## 匹配日期+时间
``` javascript
console.log(
    /1|2\d{3}-((0[1-9])|(1[1-2]))-((0[1-9])|([1-2]\d)|(3[0-1])) ((0[1-9])|(1\d)|(2[0-4])):((60)|(0[1-9])|([1-5]\d)):((60)|(0[1-9])|([1-5]\d))/
        .test('2021-02-31 01:60:02')
)

// 输出 true
```

## 验证密码 (长度 6-12 位，由数字、小写字符和大写字母组成，但必须至少包括 2 种字符)
``` javascript
let reg = /(((?=.*\d)(?=.*[a-z]))|(?=.*\d)(?=.*[A-Z])|(?=.*[A-Z])(?=.*[a-z]))^[\dA-Za-z]{6,12}$/

console.log(reg.test('AA13SFaas121'))  // true
console.log(reg.test('123'))  // false
console.log(reg.test('123asfd'))  // true
console.log(reg.test('123asfASFDAd121233'))  // false
console.log(reg.test('asdASFASDAS'))  // true
console.log(reg.test('123ASFA'))  // true
console.log(reg.test('1Aasd'))  // false
```
