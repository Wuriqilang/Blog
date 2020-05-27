---
title: '【前端拾遗】JS核心知识点——关于闭包的一切(下)'
date: 2020-05-25 15:22:23
tags: [值得一读,前端拾遗]
published: true
hideInList: false
feature: /post-images/bibaoxia.jpg
isTop: false
---
> 之所以要分上下两个部分,是因为我实在是担心你没有耐心一口气读完全文. 但闭包之于JS,就如同麻酱之于火锅. 那是灵魂
<!-- more -->

## 1.闭包的概念

> 闭包就是函数能够记住它的词法作用域,及时它在其他地方执行时.

负责任的说:如果你细细度了本文上篇的内容,这句话就能让你豁然开朗.我们举个例子

```js
function foo() {
	var a = 2;
	function bar() {
		console.log( a ); // 2
	}
	bar(); //注意这句!!!
}

foo();
```
从定义上来讲,因为bar()在foo()中调用了,且bar访问了foo()中的变量,我们认为**bar()闭住了foo()的作用域**,它形成了一个闭包.
**但是!**
这不是我们要讨论的闭包.上面的代码虽然形成了闭包,但是bar()并没有供外部调用.

我们来看一段真正的闭包:
```js
function foo() {
	var a = 2;
	function bar() {
		console.log( a );
	}
	return bar;
}
var baz = foo();
baz(); // 2 -- 哇噢，看到闭包了

```
我们来解释一下: 
1. 函数bar()对于foo()的函数作用域拥有访问权. 
2. 我们将bar()这个函数像值一样传递(return)  即 return bar;
3. 执行bar = foo()时我们就获得了返回值 bar();
4. 当我们调用baz的时候,我们本质上就调用了 bar();
   
这下聪明的你隐约间有了一种说不清道不明的感. 之所以说不清楚,因为你不知道这么做有什么用. 

先说结论: 
> 闭包可以避免垃圾回收机制

根据JS垃圾回收机制,一般来说foo()执行后,其内部作用域都将消失,被垃圾回收机制释放掉. 但是当闭包出现后,垃圾回收机制就被阻止了! 
在闭包出现后,foo()内部作用域仍然存在,因为函数bar()在使用它. 通过闭包,我们依旧可以继续访问在程序编写时定义的词法作用域.

所以说,我们回头再看看闭包的定义. 

> 闭包就是函数能够记住它的词法作用域,及时它在其他地方执行时.

形成闭包只需要  在函数A内部嵌套一个函数B,只要函数B能够访问函数A的内容且被执行,就形成了闭包.

## 2.闭包的不同形式

除了通过值传递,闭包在其他位置调用也可以形成闭包.

```js

function foo() {
	var a = 2;

	function baz() {
		console.log( a ); // 2
	}

	bar( baz );
}

function bar(fn) {
	fn(); // 看妈妈，我看到闭包了！
}

foo(); //2
```

内部函数bar()被传递给了bar,而bar是定义在全局作用域中的函数. 这样就形成了一个闭包,且在外部bar()作用域中被调用了.

这样的函数传递也可以是间接的.

```js
var fn;

function foo() {
	var a = 2;

	function baz() {
		console.log( a );
	}

	fn = baz; // 将`baz`赋值给一个全局变量
}

function bar() {
	fn(); // 看妈妈，我看到闭包了！
}

foo();

bar(); // 2
```

无论我们使用什么方法,只要将内部函数传送到其词法作用域外,函数都将维护一个最开始被声明时候的作用域的引用. 无论我们什么时候执行它,闭包都会运行.且运行的变量是**最开始声明时候的作用域**

## 3.无处不在的闭包

其实闭包,已经被应用在你的项目中且无处不在了. 

```js
function wait(message) {

	setTimeout( function timer(){
		console.log( message );
	}, 1000 );

}

wait( "Hello, closure!" );
```
虽然通常我们不这样写,但这段代码能够很好的说明闭包的运行规则,

1. 首先setTimeout是一个JS自有的全局函数.
2. 我们将timer()传递给setTimeout(..), timer()包含着对于wait词法作用域的引用
3. 当我们执行wait()时,虽然1000ms后才执行timer(),但是它仍然记忆着message的内容

**这就是闭包** 就是这么简单

我们再举一个循环的例子,循环被认为是解释闭包原理最好的例子.
```js
for (var i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}
```
答案是: 6 (循环五次)   我们本来的期望是1,2,3,4,5 但实际情况却事与愿违. 
就定时器而言,定时器都是在循环执行结束后才执行的,此时timer()所执行的值是当前全局作用域中的 i
如何解决这样的问题? 
或许我们可以通过立即执行函数在每次一生成setTimeout时给其一个单独的i
```js
for (var i=1; i<=5; i++) {
	(function(){
		setTimeout( function timer(){
			console.log( i );
		}, i*1000 );
	})();
}
```

但这样不行,因为虽然我们在立即函数执行过程中新建了许多空的作用域,**但这些作用域中并没有内容,它仍然会到全局作用域中查找变量 i . **

我们可以在被闭包的作用域加入内容

```js
for (var i=1; i<=5; i++) {
	(function(){
		var j = i;
		setTimeout( function timer(){
			console.log( j );
		}, j*1000 );
	})();
}
```
或者是这种形式
```js
for (var i=1; i<=5; i++) {
	(function(j){
		setTimeout( function timer(){
			console.log( j );
		}, j*1000 );
	})( i );
}
```
但当我们采用块级作用域,代码会变得更加NB

```js
for (let i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}
```
在用于 for 循环头部的 let 声明被定义了一种**特殊行为**。这种行为说，这个变量将不是只为循环声明一次，而是为每次迭代声明一次。并且，它将在每次后续的迭代中被上一次迭代末尾的值初始化。
简而言之,采用块级作用域为每一次循环附上单独的值.


## 4.闭包的用途(转自[阮一峰 学习Javascript闭包（Closure）](https://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html))

闭包可以用在许多地方。它的最大用处有两个，一个是前面提到的可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。

怎么来理解这句话呢？请看下面的代码。

```js
　　function f1(){

　　　　var n=999;

　　　　nAdd=function(){n+=1}

　　　　function f2(){
　　　　　　alert(n);
　　　　}

　　　　return f2;

　　}

　　var result=f1();

　　result(); // 999

　　nAdd();

　　result(); // 1000
```
在这段代码中，result实际上就是闭包f2函数。它一共运行了两次，第一次的值是999，第二次的值是1000。这证明了，函数f1中的局部变量n一直保存在内存中，并没有在f1调用后被自动清除。

为什么会这样呢？原因就在于f1是f2的父函数，而f2被赋给了一个全局变量，这导致f2始终在内存中，而f2的存在依赖于f1，因此f1也始终在内存中，不会在调用结束后，被垃圾回收机制（garbage collection）回收。


这段代码中另一个值得注意的地方，就是"nAdd=function(){n+=1}"这一行，首先在nAdd前面没有使用var关键字，因此nAdd是一个全局变量，而不是局部变量。其次，nAdd的值是一个匿名函数（anonymous function），而这个匿名函数本身也是一个闭包，所以nAdd相当于是一个setter，可以在函数外部对函数内部的局部变量进行操作。

## 5.使用闭包的注意点

1）由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。

2）闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。










