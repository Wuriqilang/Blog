---
title: '【前端拾遗】CSS知识点'
date: 2020-05-21 10:55:48
tags: [前端拾遗]
published: true
hideInList: false
feature: /post-images/CSS-Point.jpg
isTop: false
---

CSS 作为构建前端页面的三驾马车,随着现代前端技术的飞速发展,已经称为描述页面样式不可或缺的部分. 本文将从前端面试题目出发,总结CSS必须掌握的知识点.
<!-- more -->


# Questions

### 1. css sprite是什么?有什么优缺点?

- 知识点:css sprite
- 重要程度:★★★
- 概念与背景: css sprite是一种用于解决页面图片过多导致大量http请求的解决方案. css sprite将多个小图片拼接到一个图片中，通过background-positon 和元素尺寸调节需要显示的背景图案.
- 优点:
    - 减少HTTP请求数,极大的提高页面加载速度
    - 增加图片信息重复度,提高压缩比,减少图片大小
    - 更换风格方便.只需要在少量图片上修改颜色或者样式即可
- 缺点:
    - 图片合并麻烦
    - 维护不便,修改一个图片可能需要重新布局整个图片样式

- 实现 (转自MDN教程):
  如果为类名为toolbtn的元素附加一张图片
 ```css
.toolbtn{
    background:url(myfile.png);
    display : inline-block;
    height : 20px;
    width : 20px;
}
 ```
为设置 background-position 以使每个按钮得到合并后图片中的正确部分，可以在 background 属性中的 url() 后添加 x, y 两个坐标值，或直接使用 background-position 属性。例如：

 ```css
#btn1 {background-position: -20px 0px}
#btn2 {background-position: -40px 0px}
 ```

 这会将 ID 为 btn1 的元素的背景向左移 20px，ID 为 btn2 的元素的背景向左移40px（假设这两个元素都带有 toolbtn 这个类且应用了上面 background 属性中定义的图片背景）

类似的，你也可以使用下面的代码添加悬停效果：
```css
#btn:hover {
  background-position: <pixels shifted right>px <pixels shifted down>px;
}
```


### 2. display:none 与 visibility:hidden 的区别

- 知识点: display与visibility
- 重要程度:★★
- 概念与背景: 本题考察display与visibility的渲染机制
- display:none; :
    - 会让元素完全从渲染树中消失,渲染时不占任何空间
    - 非继承属性: 子孙节点同样消失,无法通过修改子孙节点属性使子孙节点显示
- visibility:hidden; :
    - 不会让元素从渲染树中消失,渲染时仍然占据控件,只是内容不可见
    - 子孙节点可以通过重新设置 visibility:visible; 使自身显示
    - 修改display属性会导致文档重拍,visibility只会导致内容重新渲染



### 3. link与@import的区别

- 知识点: 样式文件的引用方式\FOUC
- 重要程度:★★
- 概念与背景: link与@import都是前端用于引入css文件的方式.但因其作用方式不同,在传统的前端项目中容易遇到一些样式覆盖,FOUC的bug




### 4.CSS的选择器 
- 知识点: CSS的样式选择器
- 重要程度:★★★★
- 概念与背景: CSS 选择器规定了 CSS 规则会被应用到哪些元素上。CSS选择器是构建前端页面样式最基础也是最重要的部分

> 备注：暂时没有能够选择 父元素、父元素的同级元素，或 父元素的同级元素的子元素 的选择器或者组合器。

这里列举部分常见CSS元素选择器的使用方法

```html
<div id="box" class="myBox">
    <p title="value">This is a P tag</p>
    <button class="myBtn">Click</button>

    <p>This is a P tag2</p>
</div>

<style>
/* 类选择器 */
.myBox{  backgournd-color:red;  }
/* id选择器 */
#box{backgournd-color:red;}
/* 元素选择器 */
p{backgournd-color:yellow;}
/* 组合选择器 */
p, button  {backgournd-color:yellow;}   /* 多个元素为平行关系,都获得该样式属性 */
/* 后代选择器 */
.myBox .myBtn{ background-color:green; }  /* .myBox中的所有.myBtn  用空格隔开 */
/* 子选择器 */
.myBox > .myBtn{ background-color:green; }  /* .myBox中的所有.myBtn子元素  用>隔开 */
/* 相邻选择器 */
p + .myBtn{ background-color:green; }  /* p后相邻的.myBtn同级元素*/
/* 同级通配符 */
p ~ btn { background:#ff0; }  /* p后所有同级的btn元素  CSS3*/  

/* 伪类 */
.myBox:first-child { font-style:italic; }  /* mybox的第一个子元素*/  
.myBtn:hover { background-color:green; }  /* mybox的第一个子元素*/  

/* 元素选择器 */
p[title] { color:#f00; }  /*具有title属性的P标签*/  
p[title=value] { color:#f00; }  /*具有title属性且属性内容为value的P标签*/  




<style>



```

![](https://www.xr1228.com//post-images/1590135976965.png)
![](https://www.xr1228.com//post-images/1590135990176.png)





















