# 原型链

每个函数都有一个原型对象 `prototype`，这个原型对象有一个属性 `constructor` 指回这个构造函数，这个原型对象还有一个属性 `__proto__` 指向这个原型对象的原型

每个对象的内部都有一个属性 `__proto__` 指向用于实例化他自己的 `构造函数` 的原型对象 `prototype`

::: tip
原型对象 `prototype` 只有 `函数` 才有；`__proto__` 只有 `对象` 才会有
:::

## 从对象的数据访问角度

``` javascript
var obj = {
  name: '12'
}
obj.age = ?

({}).__proto__ === Object.prototype // true
Object.prototype.__proto__ === null // true
```

当我们通过 `对象字面量` 方式创建一个 `obj` 时，我们可以把他看做是使用 `new Obejct()` 创建的对象。当我们访问对象的属性时，首先会去当前对象内部查找 `age` ，若未找到，就去当前对象的 `__proto__` 中查找（他就是 `Obejct` 的 `prototype` ），若未找到，由于这里 `Object.prototype` 的原型是 `null` ，当查找到这里时 `obj.age` 就返回了 `undefined`

## 从对象的实例化

``` javascript
function MyNew(func, ...args) {
	const obj = {}
	obj.__proto__ = func.prototype;
	const funcObj = func.apply(obj, args);

	if(funcObj && Object.prototype.toString(funcObj) === '[object Object]') {
		return funcObj;
	}
	return obj;
}

function Func(name) {
	this.name = name
}

console.dir(MyNew(Func, '张三'))
```

当我们实例化一个对象，从`构造函数、原型、实例`的关系可以知道，实例的 `__proto__` 会指向 `构造函数` 的 `prototype` ，假如这个 `prototype` 的原型又是一起其他的实例，当此构造函数完成实例化后，他就会继承两个原型的属性，当我们在访问属性时，若不存在就会顺着这些原型依次向上查找，这就形成了 `原型链`
