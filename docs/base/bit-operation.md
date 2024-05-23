# 位运算的使用
## 一元运算符
### ~ 按位非运算符

[按位非运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT)（~）将操作数的位反转。如同其他位运算符一样，它将操作数转化为 32 位的有符号整型

> **`~num === num*-1 -1`**

## 位移运算符
### << 按位左移运算符

[左移操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Left_shift) (<<) 将第一个操作数向左移动指定位数，左边超出的位数将会被清除，右边将会补零

> **`x << y === x*2**y`**

### >> 按位右移运算符

[右移操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Right_shift) (>>) 是将一个操作数按指定移动的位数向右移动，右边移出位被丢弃，左边移出的空位补符号位（最左边那位）

> **`x >>> 1 === Math.floor(x / 2)`**

### >>> 按位无符号右移运算符

[无符号右移运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift)（>>>）（零填充右移）将左操作数计算为无符号数，并将该数字的二进制表示形式移位为右操作数指定的位数，取模 32。向右移动的多余位将被丢弃，零位从左移入。其符号位变为 0，因此结果始终为非负数。与其他按位运算符不同，零填充右移返回一个无符号 32 位整数

> **`若 x >= 0 ; x >>> 1 === Math.floor(x / 2)`**

上面这里这个用法在 `vue3` 源码中有使用到 [链接](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/scheduler.ts#L71)

## 二进制位运算符
### 运算的真值

| a | b | a & b | a \| b | a ^ b |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |


### & 按位与（AND）

> 若 **`(a & 1) === 0`** 则 `a` 为 **偶数** ，否则为 **奇数**

### | 按位或（OR）

按位或（OR）

### ^ 按位异或（XOR）

```
// 交换 a , b 的值
let a = 3
let b = 5
a ^= b
b ^= a
a ^= b

// a = 5 ; b = 3
```

## 基于位运算的权限设计

- 基础权限设计
    - 读：A = 0000001 = (1 << 0) = 1
    - 写：B = 0000010 = (1 << 1) = 2
    - 删：C = 0000100 = (1 << 2) = 4
    - 增：D = 0001000 = (1 << 3) = 8
    - 移：E = 0010000 = (1 << 4) = 16

- 单角色权限，利用 `二进制位运算符` 的 `|` 来为角色添加多个权限
    - Role1 = A | B = 0000011
    - Role2 = A | B | C = 0000111
    - Role3 = D | E = 0011000

- 用户权限，利用 `二进制位运算符` 的 `|` 来为用户合并角色权限
    - user1 = Role1 & Role3 = 0011011

- 角色权限移除，利用 `二进制位运算符` 的 `^` 来移除角色权限
    - Role2 = Role2 & C = 0000011 (从 Role2 中移除权限 C)


- 用户权限检查，利用 `二进制位运算符` 的 `&` 来判断用户是否存在某个权限
    - !!(user1 & C) = false (判断用户 user1 是否有 删 权限)
    - !!(user1 & A) = true (判断用户 user1 是否有 读 权限)


``` javascript
const Read = 1 << 0
const Write = 1 << 1
const Delete = 1 << 2
const Add = 1 << 3
const Move = 1 << 4

// 为角色配置权限
let Role1 = Read | Write
let Role2 = Add | Move
// 为用户配置角色
let User1 = Role1 | Role2

console.log(`User1 是否有 Delete 权限`, !!(User1 & Delete))
console.log(`User1 是否有 Read 权限`, !!(User1 & Read))
console.log(`User1 是否有 Write 权限`, !!(User1 & Write))

console.log('移除 Role1 的 Write 权限')
// 移除 Role1 的 Write 权限
Role1 = Role1 ^ Write
// 重新计算 User1 的权限
User1 = Role1 | Role2

console.log(`User1 是否有 Write 权限`, !!(User1 & Write))

/** 输出:
 * User1 是否有 Delete 权限 false
 * User1 是否有 Read 权限 true
 * User1 是否有 Write 权限 true
 * 移除 Role1 的 Write 权限
 * User1 是否有 Write 权限 false
 */
```
