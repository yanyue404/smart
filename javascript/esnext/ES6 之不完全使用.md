## 目录

- let & const
- 箭头函数
- 解构赋值
- Promise
- Async & Await
- Class
- Decorator
- Proxy
- 字符串扩展

## 1. let & const

ES6 新增了声明变量支持块级作用域的 let 与 const 命令。

它们的使用存在以下几个特性：

- 不存在类似 var 的变量提升，并且在变量未申明前不可使用（即暂时性死区）。
- 不能在相同作用域内，重复申明已有的变量。
- let 声明的变量可以任意修改，const 声明为值类型数据时不可变，声明值为引用类型的时候只允许修改内存中存储的值，不允许直接修改指针。

```js
const foo = {}

// 为 foo 添加一个属性，可以成功
foo.prop = 123
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {} // TypeError: "foo" is read-only
```

> const 申明变量实际上保证的是变量指向的那个内存地址所保存的数据不能修改。由于值类型存储值，引用类型存储指针关系，因此在值类型的申明中维护的是值不可变，如同常量；而在引用类型的声明中维护的是指针关系，所以只要不修改指针关系，对于通过指针关系造成的值变更被视为是允许的。

## 2. 箭头函数

ES6 允许使用“箭头”（=>）定义函数。

箭头函数的使用注意点：

- 函数体内的 this 对象，就是定义时所在的作用域，而不是使用时所在的作用域。
- 不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误。
- 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（1）this 指向谁

```js
function foo() {
  setTimeout(() => {
    console.log('id:', this.id)
  }, 100)
}

var id = 21

foo.call({ id: 42 }) // id: 42
```

上面代码中，setTimeout 的参数是一个箭头函数，这个箭头函数的定义生效是在 foo 函数生成时，而它的真正执行要等到 100 毫秒后。如果是普通函数，执行时 this 应该指向全局对象 window，这时应该输出 21。但是，箭头函数导致 this 总是指向函数定义生效时所在的对象（本例是{id: 42}），所以输出的是 42。

另一个更直观的例子，箭头函数转成 ES5 的代码如下：

```js
// ES6
let foo = {
  value: 1,
  getValue: () => console.log(this.value)
}

foo.getValue() // undefined

// ES5
let _this = this
let foo = {
  value: 1,
  getValue: function() {
    console.log(_this.value)
  }
}

foo.getValue() // undefined
```

上面代码中，转换后的 ES5 版本清楚地说明了，箭头函数里面根本没有自己的 this，而是引用外层的 this。正是因为它没有 this，所以也就不能用作构造函数。

（2）没有 arguments

下面是一个 rest 参数代替 arguments 变量的例子。

```js
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort()
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort()
```

## 3. 解构赋值

（1）交换变量的值。

```js
let x = 1
let y = 2

;[x, y] = [y, x]
```

（2）解构赋值提取对象中的数据。

```js
let jsonData = {
  id: 42,
  status: 'OK',
  data: [867, 5309]
}

let { id, status, data: number } = jsonData

console.log(id, status, number)
// 42, "OK", [867, 5309]
```

```js
Promise.all([Promise.resolve(1), Promise.resolve(2)]).then(([x, y]) => {
  console.log(x, y)
})
```

（3）剔除部分属性，将剩下的属性构建一个新的对象

```js
let [a, b, ...arr] = [1, 2, 3, 4, 5]

const { a, b, ...others } = { a: 1, b: 2, c: 3, d: 4, e: 5 }

// others {  c: 3, d: 4, e: 5 }
```

（4）解构函数返回值

```js
// bad
function processInput(input) {
  return [left, right, top, bottom]
}

// good
function processInput(input) {
  return { left, right, top, bottom }
}

const { left, right } = processInput(input)
```

## 4. Promise

一个简单的 Promise 执行例子：

说明：Promise 的构造函数是同步执行的，promise.then 中的函数是（作为微任务）异步执行的。

```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise init start')
  resolve()
  console.log('Promise init end')
})

promise
  .then(function() {
    console.log('resolved.')
  })
  .catch(function(error) {
    // 处理 promise运行时发生的错误
    console.log('发生错误！', error)
  })

console.log('Hi!')

// Promise init start
// Promise init end
// Hi!
// resolved
```

> 思考： `Promise init end` 为什么先于 `Hi!` 执行？

**原型方法新增**

- Promise.prototype.finally

finally() 方法不管 promise 最后的状态，在执行完 then 或 catch 指定的回调函数以后，都会执行 finally 方法指定的回调函数

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

**实例方法新增**

> 以下都是用来处理多个 promise 实例，使用数组包起来作为参数传递

- Promise.all() 所有 promise 都成功才返回结果，若有一个出错则直接阻断执行并返回错误信息。
- Promise.race() 所有 promise 竞争，取最先成功的 promise 实例结果返回。
- Promise.allset() 不管 单个 Promise 请求成功还是失败，都会返回结果。（每个对象都有 status 属性描述请求结果状态）
- Promise.any() 【提案中】不会因为某个 Promise 变成 rejected 状态而结束。

## 6.Class

ES6 的 class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

ES5 Function

```js
function Person(name, friend) {
  this.name = name
  this.friend = friend
}

Person.prototype.say = function() {
  return '我的名字叫 ' + this.name + '，' + this.friend + ' 是我的好朋友'
}

const obj = new Person('Rainbow', 'heizi')
console.log(obj.say()) //我的名字叫 Rainbow，heizi 是我的好朋友
```

ES6 Class

```js
class Person {
  constructor(name, friend) {
    //constructor是一个构造方法，用来接收参数
    this.name = name //this代表的是实例对象
    this.friend = friend
  }
  say() {
    //这是一个类的方法
    return '我的名字叫 ' + this.name + '，' + this.friend + ' 是我的好朋友'
  }
}

const obj = new Person('Rainbow', 'heizi')

console.log(obj.say()) // 我的名字叫 Rainbow，heizi 是我的好朋友
console.log(typeof Person) // function 类实质上就是一个函数
console.log(Person === Person.prototype.constructor) //true
// 类自身指向的就是构造函数。所以可以认为ES6中的类其实就是构造函数的另外一种写法 ！
```

**注意点**

- 注意 1： 类不存在变量申明，需提前申明并配合 new 操作符创建实例对象后使用

```js
//ES5 可以先使用再定义,存在变量提升
new A()
function A() {}

//ES6 不能先使用再定义,不存在变量提升 会报错
new B() // B is not defined
class B {}
```

- 注意 2：this 指向，类的方法内部如果含有 this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能会因找不到 this 而报错。

```js
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`)
  }

  print(text) {
    console.log(text)
  }
}

const logger = new Logger()
const { printName } = logger
printName() // TypeError: Cannot read property 'print' of undefined
```

一个比较简单的解决方法是，在构造方法中绑定 this，这样就不会找不到 print 方法了。

```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this)
  }

  // ...
}
```

- 注意 3：Class 通过 extends 关键字实现继承时，子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。

```js
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y) // 调用父类的constructor(x, y)
    this.color = color
  }

  toString() {
    return this.color + ' ' + super.toString() // 调用父类的toString()
  }
}
```

上面代码中，constructor 方法和 toString 方法之中，都出现了 super 关键字，它在这里表示父类的构造函数，用来新建父类的 this 对象。

子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 super 方法，子类就得不到 this 对象。

另一个需要注意的地方是，在子类的构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有 super 方法才能调用父类实例。

```js
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color // ReferenceError
    super(x, y)
    this.color = color // 正确
  }
}
```

上面代码中，子类的 constructor 方法没有调用 super 之前，就使用 this 关键字，结果报错，而放在 super 方法之后就是正确的。

React Class 例子：

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.state = { x: 0, y: 0 }
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>移动鼠标!</h1>
        <p>
          当前的鼠标位置是 ({this.state.x}, {this.state.y})
        </p>
      </div>
    )
  }
}
```

## 7. 字符串扩展

`ES6`之前判断字符串是否包含子串，用`indexOf`方法，`ES6`新增了子串的识别方法。

- `includes()`  返回布尔值，判断是否找到参数字符串。
- `startsWith()`  返回布尔值，判断参数字符串是否在原字符串的头部。
- `endsWith()`  返回布尔值，判断参数字符串是否在原字符串的尾部。
- `repeat()`  返回新的字符串，表示将字符串重复指定次数返回。
- `padStart()`  返回新的字符串，表示用参数字符串从头部补全原字符串。
- `padEnd()`  返回新的字符串，表示用参数字符串从尾部（右侧）补全原字符串。

## 参考

- [mqyqingfeng - ES6 完全使用手册 ](https://github.com/mqyqingfeng/Blog/issues/111)
- [现代 JavaScript 教程](https://zh.javascript.info/)
- [阮一峰 - ES6 入门教程](https://es6.ruanyifeng.com/)
- [前端知识体系(1)-js 篇](https://juejin.im/post/6844904160719011848)
