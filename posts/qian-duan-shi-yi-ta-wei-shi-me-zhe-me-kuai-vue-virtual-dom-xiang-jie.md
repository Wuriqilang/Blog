---
title: '【前端拾遗】它为什么这么快？—— Vue Virtual DOM详解'
date: 2020-07-01 15:15:18
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
面试京东和阿里的时候，面试官都问到了虚拟Dom与页面渲染的相关问题，鄙人支支吾吾，颠三倒四的回答了一个大概，引以为耻。
确实，对于一名前端工程师来说，想要针对性的对项目做优化就一定绕不开页面渲染机制。本文将从Vue Virtual DOM实现的角度出发，讨论前端最重要的知识点：页面渲染。

<!-- more -->

写在最前面：本文中提出的一些关于浏览器内核观点可以参考另外一片文章 [浏览器内核的三国风云](https://www.xr1228.com/post/liulanqisanguo/)
值得说明的是，本文撰写过程中我愈发发现每一个涉及的知识点都可以单独写一篇文章，也愈发发现自己的无知，但作为一名以解决问题为目标的工程师，很多细碎的知识点我们的原则是尽量“不求甚解”。

## 一、一个页面是如何渲染出来的？

我们知道浏览器主要由七个模块组成的，七个模块相互配合，实现网络资源的请求、解析、重拍、渲染、交互。

![](https://www.xr1228.com//post-images/1593653719143.png)

- User Interface（用户界面）：包括地址栏、后退/前进按钮、收藏栏等，即用户看到的除了页面之外的浏览器界面。
- Browser engine（浏览器引擎）：
    - 在用户界面与渲染引擎之间传送指令。保证浏览器各个部分之间互相通信
    - 访问客户端本地缓存（或长期保存）的数据，对这些数据进行读写。
- DataPersistence（数据存储）：浏览器中保存的cookie、localStorage等数据。
- Rendering engine（浏览器内核）：实际上这个单词的准确翻译是：**渲染引擎**。之所以翻译为浏览器内核，是因为本文的观点认为浏览器内核包含了渲染引擎与JS引擎。浏览器内核主要功能是解析DOM文档和CSS规则，并将内容排版到浏览器中。
- Networking（网络）：用来完成网络调用或者资源下载的模块
- JavaScript Interpreter（JS解释器）：即JS引擎，用来解释执行JS脚本，如V8（Chromium Blink），JavaScriptCore（webkit）
- UI Backend（UI模块）：用来绘制基本浏览器控件，如输入框、按钮、选择按钮等，根据不同浏览器绘制效果也有差异，但功能相同。


### 1.1 渲染引擎工作流程

> 因为目前采用webkit内核（chrome blink与webkit的渲染过程类似）的浏览器占据了90%以上的市场份额，所以本文仅讨论该内核。（其他的知识我不要知道不要知道。。。）

1.  **解析HTML生成DOM树**：渲染引擎将HTML标签解析成由多个DOM元素对象节点组成的具有父子关系的DOM树结构。
2.  **解析CSS生成CSSOM规则树**
3.  **生成渲染树**： 将DOM树与CSSOM规则树合并，根据DOM树结构的每一个节点顺序提前计算使用的CSS规则并重新计算DOM树结构的样式数据，生成一个带有样式描述的DOM渲染树对象。
4.  **渲染树布局**：遍历渲染树，根据渲染树节点在页面中的大小和位置，将渲染树节点固定到页面的位置上,这个阶段只有元素的布局属性(position,float,margin)生效.
5. **绘制渲染树**：将渲染树节点的背景、颜色、文本等样式信息应用的节点上，这个阶段主要是元素的内部显示样式（color，background等属性）生效。

> 渲染引擎对与DOM渲染树的解析和输出是**逐行进行**的.这样渲染树前面的内容可以先展示，这样保证了较好的用户体验。

![](https://www.xr1228.com//post-images/1593655664644.jpg)

在这里我们需要注意的是在渲染树**布局**和**绘制**阶段：

- 页面重排（reflow）：页面在生成后如果页面元素位置或尺寸发生改变，**一旦页面reflow则必定会repaint**
- 页面重绘（repaint）：屏幕的一部分重画，不影响整体布局，比如css的背景色变化，但是元素的尺寸和位置不变。显示样式发生改变但是布局即元素位置不发生改变

reflow产生的代价要远大于repaint，所以我们要尽量避免reflow，减少repaint


### 1.2 渲染阻塞
- **JS执行阻塞**：当浏览器遇到一个 script 标记时，DOM 构建将暂停，直至脚本完成执行，然后继续构建DOM。每次去执行JavaScript脚本都会严重地阻塞DOM树的构建，如果JavaScript脚本还操作了CSSOM，而正好这个CSSOM还没有下载和构建，浏览器甚至会延迟脚本执行和构建DOM，直至完成其CSSOM的下载和构建。所以，script 标签的位置很重要。实际使用时，可以遵循下面两个原则：
    - CSS 优先：引入顺序上，CSS 资源先于 JavaScript 资源。
    - JS置后：我们通常把JS代码放到页面底部，且JavaScript 应尽量少影响 DOM 的构建。

- **CSS解析阻塞**：当解析html的时候，会把新来的元素插入dom树里面，同时去查找css，然后把对应的样式规则应用到元素上，查找样式表是按照从右到左的顺序去匹配的。例如： div p {font-size: 16px}，会先寻找所有p标签并判断它的父标签是否为div之后才会决定要不要采用这个样式进行渲染）。所以，我们平时写CSS时，尽量用id和class，千万不要过渡层叠。

## 二、一切都很美好，为什么要用Virtual-DOM ？

### 2.1 操作DOM元素的代价

首先我们应该有一个概念，在前端项目中，一个DOM是很“昂贵”的。你可以在浏览器命令行中执行以下代码，打印一个最简单div元素中所有属性

```js
var div = document.createElement('div');
var str = '';
for(var key in div){
    str += key + '  '
}
```
![](https://www.xr1228.com//post-images/1593659368665.PNG)

这仅仅是一个最简单的dom元素. 当我们通过JavaScript操作页面中dom节点时,浏览器会从构建DOM树开**始从头到尾执行一遍**渲染流程. (有些情况下也会集中处理,这里不做讨论).
假如我们要更新10个DOM节点, 浏览器接收到第一个更新请求时会马上执行, 连续执行10次,而事实上最后一次执行的结果才是我们需要的. 前九次运算都是在浪费性能. 最终导致页面卡顿,内存占用过高,用户体验差.

![](https://www.xr1228.com//post-images/1593659945748.jpg)

### 2.2 虚拟DOM的好处

虚拟DOM就是为了解决浏览器性能问题而被设计出来的. 

假如一次操作中有10个更新DOM的动作,虚拟DOM不会立即执行,而是将这10次更新的diff内容保存到本地的JS对象中,最终将这个JS对象一次性 attch到DOM树上,再进行后续操作,避免大量无效计算. 这样页面的更新可以全部反应在JS对象(虚拟DOM上),操作内存中的JS对象速度当然要更快,等更新完后再将JS对象映射成真实的DOM,交给浏览器去绘制.

> 除了性能优化外,虚拟DOM实现让服务端渲染,跨端渲染成为了可能.


## 三、Virtual DM的实现

###  3.1 Vue 的 Virtual DOM

Virtual DOM就是用一个原生的JS对象去描述DOM节点,所以它比创建一个DOM的代价要小很多. 在Vue中,Virtual DOM是用 VNode(一个Class)去描述的,它定义在 src/core/vdom/vnod.js 中.

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

当然了,即使我在努力的告诉你它开销很小,但实际VNode还是有些复杂的,这是因为Vue在借鉴一个开源库[snabbdom](https://github.com/snabbdom/snabbdom) 的基础上针对Vue的特性做了一些实现.

其实 VNode 是对真实 DOM 的一种抽象描述，它的核心定义无非就几个关键属性，标签名、数据、子节点、键值等，其它属性都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。由于 VNode 只是用来映射到真实 DOM 的渲染，不需要包含操作 DOM 的方法，因此它是非常轻量和简单的。
Virtual DOM 除了它的数据结构的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。

接下来,我们会用一个相对比较长的篇幅来描述Virtual DOM的算法实现,话不多说,开车!

![](https://www.xr1228.com//post-images/1593668470261.jpeg)



### 3.2  Virtual DOM的实现

![](https://www.xr1228.com//post-images/1593668619504.png)

通过上图我们可以直观的看到从Vue初始化到最终渲染的过程，本节的思路主要来源于 [深入剖析：Vue核心之虚拟DOM 掘金-你是我的超级英雄](https://juejin.im/post/5d36cc575188257aea108a74)  这篇文章从Virtual DOM的实现到Vue VNode源码都做了详细的分析。

#### 3.2.1 用JS对象模拟DOM树

假设我们需要表示这样一个真实的DOM节点：

```html
<div id="virtual-dom">
<p>Virtual DOM</p>
<ul id="list">
  <li class="item">Item 1</li>
  <li class="item">Item 2</li>
  <li class="item">Item 3</li>
</ul>
<div>Hello World</div>
</div> 
```

我们希望通过JavaScript中的对象来表示这样的DOM节点,并使用对象的属性来记录节点的类型,属性,子节点等信息.   首先我们编写一个 element 模块

> 本文为了方便你直接在浏览器中操作而无需开启一个nodejs环境,本例使用了浏览器原生支持的 ES-Module 引入方式(我相信这也是未来前端构建项目的最佳方式), 当然你也可以通过webpack,browserify等方法来编译js文件,使浏览器可以通过require或import调用模块.

```js
/**
 * Element Virtual-dom 对象定义
 * @param {String} tagName - dom元素名称
 * @param {Object} props - dom属性
 * @param {Array<ELEMENT|String>} -子节点
 */
function Element(tagName,props,children){
    this.tagName = tagName;
    this.props = props;
    this.children = children;
    //dom元素的key值,用作唯一标识符
    if(props.key){
        this.key = props.key
    }
    var count = 0 ;
    children.forEach((child,i) => {
        if(child instanceof Element){
            count += child.count;
        }else{
            children[i] = '' + child;
        }
        count ++;
    });
    //子元素的个数
    this.count = count;
}
function createElement(tagName,props,children){
    return new Element(tagName,props,children);
}
export default createElement;
```
接下来,根据element对象的设定,我们可以将上述的DOM结构表示出来,并打印在控制台中.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual DOM实现</title>
</head>
<body>
    <div id="virtual-dom">
        <p>Practical DOM</p>
        <ul id="list">
            <li class="item">Item 1</li>
            <li class="item">Item 2</li>
            <li class="item">Item 3</li>
        </ul>
        <div>Hello World</div>
    </div>
    <script type="module">
        import el from './Element.js'
        var virtualDom = el('div', { id: 'virtual-dom' }, [
            el('p', {}, ['Virtual DOM']),
            el('ul', { id: 'list' }, [
                el('li', { class: 'item' }, ['Item 1']),
                el('li', { class: 'item' }, ['Item 2']),
                el('li', { class: 'item' }, ['Item 3'])
            ]),
            el('div', {}, ['Hello World'])
        ])
        console.log("Virtual Dom:");
        console.log(virtualDom);
        console.log("Practical Dom:");
        console.log(document.getElementById("virtual-dom"));
    </script>
</body>
</html>
```

在本例中我还写了一个 真实DOM,你可以从控制台中直观的比较两者的差异

![](https://www.xr1228.com//post-images/1593680905126.PNG)

#### 3.2.2 将模拟DOM树渲染到页面中

上面的例子我们将DOM改造为一个 自定义的element对象,那么如何将这个对象渲染成真实的DOM结构呢?
让我们对 element对象进行改造.




- 参考文献：
[chrome浏览器页面渲染工作原理浅析-知乎大金](chrome浏览器页面渲染工作原理浅析)
[浏览器内核-渲染引擎、js引擎](https://blog.csdn.net/BonJean/article/details/78453547)
[浏览器之渲染引擎-掘金26000步](https://juejin.im/post/5c903e23e51d45656442c5e2)
