---
title: '【前端拾遗】它为什么这么快？—— Vue Virtual DOM详解'
date: 2020-07-01 15:15:18
tags: [vue,前端拾遗,值得一读]
published: true
hideInList: false
feature: /post-images/virtualDom.jpg
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
让我们对 element对象进行改造.  其实就是对Element对象的原型增加一个render函数. 改造后的Element.js 如下

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
/**
 * render 将virdual-dom对象渲染为真实DOM元素
 */
 Element.prototype.render = function(){
     var el = document.createElement(this.tagName);
     var props = this.props;
     //设置节点DOM属性
     for(var propName in props){
         var propValue = props[propName];
         el.setAttribute(propName,propValue);
     }

     var children = this.children||[];
     children.forEach(child=>{
         var childEl = (child instanceof Element)
         ?child.render() //如果子节点也是虚拟DOM,递归构建DOM节点
         :document.createTextNode(child);  //如果是字符串,只构建文本节点
         el.appendChild(childEl);
     })
     return el;
 }
function createElement(tagName,props,children){
    return new Element(tagName,props,children);
}
export default createElement;
```

接下来,我们只需在 html中调用一下这个函数生成一个真实DOM树,添加到页面中即可
在html中加入下面两行代码
```js
        //渲染虚拟DOM
        var ulRoot = virtualDom.render();
        document.body.appendChild(ulRoot);
```

bingo! 页面body中加入了一个DOM结构,效果如图所示:

![](https://www.xr1228.com//post-images/1593765774653.png)

#### 3.2.3 计算两棵Virtual DOM树的算法实现 diff

接下来,当我们修改Virtual DOM之后,需要比较修改前后的DOM树的差异,然后返回一个patch对象,即补丁对象,再通过特定的解析patch对象,完成页面的渲染.  

大概流程是这样的: 

![](https://www.xr1228.com//post-images/1593768412866.PNG)

到这里,聪明的你一定会问 : 为啥要对比呢? 我把新的Virtual Dom渲染出来不就行了吗? 向上一节一样 调用document.CreateElement不就OK了吗? 何必多次一举?

这是因为document.CreateElement这个操作开销也很大,它本质就是新建一个DOM结构,对于性能是一个巨大的浪费. 为了减少性能损耗, 我们需要通过 diff + patch 的方式实现DOM结构的更新.

接下来我们实现一个 diff算法.

- **diff算法**：diff就是用来比较两颗Virtual Dom差异的算法。如果是由你来实现这段功能，我们可能会遍历两棵DOM树中的每一个节点，将其进行对比，这样的化时间复杂度将会是$O(n^3)$ → (两颗树遍历是$O(n^2)$,再做一次更新操作,时间复杂度就是$O(n^3)$)
但是在我们前端实际操作DOM元素过程中,极少会遇到跨越层级调动DOM元素的情况,所以Virtual DOM只会对同一层级的与阿奴进行对比.这样时间复杂度就可以达到 O(n).

![](https://www.xr1228.com//post-images/1593996871511.PNG)

**(1) 深度优先遍历,记录差异**
首先我们可以对新旧两颗树进行一个**深度优先遍历**,这样每个节点都会有一个唯一标记.

![](https://www.xr1228.com//post-images/1593997028669.PNG)

在深度优先遍历的同时,每遍历到一个节点就把这个节点和新的树进行对比,如果有差异的话就记录到一个对象中.
我们新建一个diff.js文件来存放diff方法的代码:
```js
/**
 * diff函数,对比两颗树
 * @param {Element} oldTree - 之前的树
 * @param {Element} newTree - 新的Virtual DOM树
 */
function diff(oldTree, newTree) {
    var index = 0; //当前节点的标志
    var patches = {}; // 用来记录每个节点差异的对象
    dfsWalk(oldTree, newTree, index, patches);
    return patches;
}

//对两棵树进行深度优先遍历
function dfsWalk(oldNode, newNode, index, patches) {
    var currentPatch = [];
    if (typeof (oldNode) === "string" && typeof (newNode) === "string") {
        //文本内容改变
        if (newNode !== oldNode) {
            currentPatch.push({ type: patch.TEXT, context: newNode })
        }
    } else if (newNode != null && oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
        //节点相同,比较属性
        var propsPathes = diffProps(oldNode, newNode);
        if (propsPathes) {
            currentPatch.push({ type: patch.PROPS, props: propsPathes });
        }
        //比较子节点,如果子节点有'ignore'属性,则不需要比较
        if (!isIgnoreChildren(newNode)) {
            diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
        }
    } else if (newNode !== null) {
        //新旧节点不相同,用replace替换
        currentPatch.push({ type: patch.REPLACE, node: newNode });
    }

    if (currentPatch.length) {
        patches[index] = currentPatch;
    }
}

// 遍历子节点
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    var diffs = listDiff(oldChildren, newChildren, 'key')
    newChildren = diffs.children

    if (diffs.moves.length) {
        var reorderPatch = { type: patch.REORDER, moves: diffs.moves }
        currentPatch.push(reorderPatch)
    }

    var leftNode = null
    var currentNodeIndex = index
    oldChildren.forEach((child, i) => {
        var newChild = newChildren[i]
        currentNodeIndex = (leftNode && leftNode.count)
            ? currentNodeIndex + leftNode.count + 1
            : currentNodeIndex + 1
        dfsWalk(child, newChild, currentNodeIndex, patches)
        leftNode = child
    })
}

// 比较节点属性
function diffProps(oldNode, newNode) {
    var count = 0
    var oldProps = oldNode.props
    var newProps = newNode.props
    var propsPatches = {}
    // 查找属性值不同的属性
    for (var key in oldProps) {
        if (newProps[key] !== oldProps[key]) {
            count++
            propsPatches[key] = newProps[key]
        }
    }
    // 查找新属性
    for (var key in newProps) {
        if (!oldProps.hasOwnProperty(key)) {
            count++
            propsPatches[key] = newProps[key]
        }
    }
    // 没有属性改变
    if (count === 0) {
        return null
    }
    return propsPatches
}

function isIgnoreChildren(node) {
    return (node.props && node.props.hasOwnProperty('ignore'))
}
```
这样我们就实现了对两个Virtual DOM树的比较，并且返回一个patches对象，记录了节点之间的差异。当然，你马上会发现这段代码还无法使用，因为其中有一个对象patch和一个方法listDiff没有实现。接下来对其进行详细说明。


**(2) 标记节点之间的差异类型**
当我们对DOM节点进行对比的时候，需要对差异进行标记，这样就能告诉程序两个节点之间的差异类型，以便程序根据不同类型执行不同的操作。

DOM操作导致的差异类型主要包括以下几点：
- 节点替换：节点改变了，例如将上面的 div 换成 h1;
- 顺序互换：移动、删除、新增子节点，例如上面 div 的子节点，把 p 和 ul 顺序互换；
- 属性更改：修改了节点的属性，例如把上面 li 的 class 样式类删除；
- 文本改变：改变文本节点的文本内容，例如将上面 p 节点的文本内容更改为 “Virtual DOM2”；

为了描述上述的差异，我们新建一个 patch.js(之所以要新建一个文件是因为在patch.js中我们还要实现操作真是DOM的操作)
```js
var REPLACE = 0 // 替换原先的节点
var REORDER = 1 // 重新排序
var PROPS = 2 // 修改了节点的属性
var TEXT = 3 // 文本内容改变 

function patch(node, patches) {
    //实现操作真实DOM的代码,暂时不写
}
patch.REPLACE = REPLACE
patch.REORDER = REORDER
patch.PROPS = PROPS
patch.TEXT = TEXT

export default patch;
```

**（3）列表对比算法(性能优化)**
到此为止,一切都显得自然而简单,我们对比两颗Virtual DOM树,生成差异对象,再通过差异对象来操作真实DOM.  但是其有很大的性能优化空间:
**列表对比**: 
我们先看一下这两棵Virtual DOM:
```js
        var virtualDom = el('div', { id: 'virtual-dom' }, [
            el('p', {}, ['Virtual DOM']),
            el('ul', { id: 'list' }, [
                el('li', { class: 'item' }, ['Item 1']),
                el('li', { class: 'item' }, ['Item 2']),
                el('li', { class: 'item' }, ['Item 3'])
            ]),
            el('div', {}, ['Hello World'])
        ])

        //再新建一颗Virtual-Dom
        var virtualDom2 = el('div', { id: 'virtual-dom' }, [
            el('ul', { id: 'list' }, [
                el('li', { class: 'item' }, ['Item 1']),
                el('li', { class: 'item' }, ['Item 2']),
                el('li', { class: 'item' }, ['Item 3'])
            ]),
            el('div', {}, ['Hello World']),
            el('p', {}, ['Virtual DOM'])
        ])
```
在这两棵树中,子节点的顺序从 p,ul,div 变成了 ul,div,p .如果我们按照同层级进行顺序对比的话,他们都会标记为 replace.进而都被替换掉.这样一来DOM操作的开销就会很大 . 实际上我们无需进行替换节点,只要通过移动节点就可以了.

上面这个问题抽象出来其实就是 字符串的最小编辑问题([EditionDistance](https://blog.csdn.net/zp1996323/article/details/51702991))   

对于一个解决问题为主的工程师来说没,了解Edition Distance其实没什么用,而且你也很快会忘掉.所以这里先放结论 :  为了解决列表对比的问题, 我们采用了插件 [list-diff2](https://github.com/livoras/list-diff) 算法.   我这个算法的核心文件引用到了项目的 list-diff.js 中, EditionDistance的算法原理在本文最后,时间多的用不完的你可以看一看.

list-diff2 的代码如下, 你可以新建一个 list-diff.js    篇幅所限, 本文代码在 [virtual-DOM中](https://github.com/Wuriqilang/PlayGround/tree/master/Virtual%20Dom)

接下来只需要将写好的 patch.js和list-diff.js 引入到  diff.js中即可. 再次郑重说明,本文项目采用了ES Module引用方式,无需nodejs环境,引用时注意import语法

```js
import patch from './patch.js';  //存放差异类型
import listDiff from './uilts/list-diff.js'; //实现列表对比算法
```

现在我们测试一下效果吧. 改写 html页面如下:
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
        import el from './Element.js';
        import diff from './diff.js';

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
        //渲染虚拟DOM
        var ulRoot = virtualDom.render();
        document.body.appendChild(ulRoot);

        //再新建一颗Virtual-Dom
        var virtualDom2 = el('div', { id: 'virtual-dom2' }, [
            el('p', {}, ['Virtual DOM2']),
            el('ul', { id: 'list' }, [
                el('li', { class: 'item' }, ['Item 21']),
                el('li', { class: 'item' }, ['Item 23'])
            ]),
            el('p', {}, ['Hello World'])
        ])

        //对比两棵树差异
        var patches = diff(virtualDom, virtualDom2);
        console.log('patches:', patches);
    </script>
</body>

</html>
```
在这个例子中,我们写了两个 Virtual DOM, 调用 diff.js 来比较两棵树的差异,生成 patches.这样我们就可以通过这个差异对象来更改真实DOM结构. 从而在尽量少的DOM操作前提下,完成DOM树的更新.

![](https://www.xr1228.com//post-images/1594286825417.PNG)

#### 3.2.3 将差异对象(patches) 应用到真实DOM树

因为3.2.1中我们通过Virtual DOM构建出的真实DOM树与Virtual DOM信息、结构是完全相同的.所以我们对真实DOM也进行深度优先遍历,遍历的过程中与patches相互对比: 

我们在 path.js中写出相关代码:

```js
function patch(node, patches) {
    var walker = { index: 0 };  //记录节点位置
    dfsWalk(node, walker, patches); //深度优先遍历真实DOM
}

function dfsWalk(node,walker,patches){
    //从patches中拿出差异
    var currentPatches = patches[walker.index];

    var len = node.childNodes?node.childNodes.length:0;
    //深度遍历子节点
    for(var i=0;i<len;i++){
        var child = node.childNodes[i];
        walker.index ++;
        dfsWalk(child,walker,patches);
    }
    //对当前节点进行DOM操作
    if(currentPatches){
        applyPatches(node,currentPatches);
    }
}
```
在这个递归函数中,我们每一次递归都会调用applyPatches函数,这个函数就是用操作真实DOM的函数.其核心代码如下，详细代码请参照: [virtual-DOM中](https://github.com/Wuriqilang/PlayGround/tree/master/Virtual%20Dom)

```js
function applyPatches(node, currentPatches) {
    currentPatches.forEach(currentPatch => {
        switch (currentPatch.type) {
            case REPLACE:
                var newNode = (typeof currentPatch.node === "string")
                    ? document.createTextNode(currentPatch.node) : currentPatch.node.render();
                node.parentNode.replaceChild(newNode, node);
                break;
            case REORDER:
                reorderChildren(node, currentPatch.moves);
                break;
            case PROPS:
                setProps(node, currentPatch.props);
                break;
            case TEXT:
                node.textContent = currentPatch.content;
                break;
            default:
                throw new Error("Unknown patch type" + currentPatch.type);
        }
    })
}
```
这样，Vitural DOM核心功能就完成了啦。 接下来我们对html做一些修改，让我们的Virtual DOM系统更加直观。







- 参考文献：
[chrome浏览器页面渲染工作原理浅析-知乎大金](chrome浏览器页面渲染工作原理浅析)
[浏览器内核-渲染引擎、js引擎](https://blog.csdn.net/BonJean/article/details/78453547)
[浏览器之渲染引擎-掘金26000步](https://juejin.im/post/5c903e23e51d45656442c5e2)
[EditionDistance](https://blog.csdn.net/zp1996323/article/details/51702991)
