---
title: '【前端拾遗】不写一遍总是记不住——数据双向绑定'
date: 2020-06-05 16:22:23
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
数据双向绑定，作为三大前端框架的重要特性，总是被人们津津乐道（尤其是面试官），defineProperty啦，proxy啦，digest循环检查啦（AngularJS）……
数据绑定的相关文章看了很多，但总是感觉差点意思，别人问起VUE数据绑定的原理虽然我表面口若悬河，其实内心虚的不行，还是自己亲自实现一个数据绑定吧。


<!-- more -->


## Object.defineProperty  方式

Object.defineProperty 是Vue 2.X的实现方式，其原理就是在Vue实例中定义data时：
①Vue遍历data中所有数据，
②通过ES5的Object.defineProperty 重写data中的每一项数据的set属性
③一旦监听器发现数据发生改变，（如果是view层的数据改变时通过事件监听的，vm层是数据赋值的方法）就会触发set函数
④set函数中包含了重新渲染view页面的方法，一旦触发set就可以重新渲染页面。

流程就是这样一个流程，但是在代码层面需要为此实现一些必要的功能：

- 实现一个监听器Observer，用来劫持并且监听所有属性。
- 实现一个订阅者Wathcer，收到Observer传来的变化通知，执行相应函数来更新View页面
- 实现一个解析器Compile，可以扫描View中每个节点上的相关指令（如v-model）从而初始化watcher和模板数据


![](https://www.xr1228.com//post-images/1591348688902.PNG)

### 1.实现一个Observer

Observer是一个数据监听器，其实现的核心方法就是Object.defineProperty() 如果要对所有属性都进行监听的话，可以通过递归方法遍历所有属性。

```js
function observe(data){
    if(!data|| typeof data !== 'object'){   //防止空值或报错
        return;
    }
    Object.keys
}


function defineReactive(data,key,val)






















