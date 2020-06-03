---
title: '【前端拾遗】很基础,但很实用——Meta标签'
date: 2020-06-02 16:28:17
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
今天来说一个很基础但是很实用的Html功能，以及很多前端面试中要考察的基础内容 —— meta标签。

<!-- more -->

直接切入正题，meta标签是非常有用的辅助性标签，所有浏览器都能识别它。meta标签的内容并不会显示出来，但是会被浏览器识别。浏览器识别meta数据是将其识别为“metadata”（中文范围为元数据，但我觉得词不达意，容易造成误解，我们就仍旧沿用其英文名称“metadata”）

> The <meta> tag provides metadata about the HTML document. Metadata will not be displayed on the page, but will be machine parsable.

meta标签通常被用来定义页面的说明，关键字，修改时间等。meta标签中的信息给浏览器或搜索引擎以实现一些特定功能。

> Meta elements are typically used to specify page description, keywords, author of the document, last modified, and other metadata.

需要说明的是，meta标签是通过name与content来定义metadata数据的，所以说metadata是一种“名值对”的数据。

meta有两个属性：
- name：用于描述网页，它是metadata“名值对”数据中的“名”，name属性确定需要描述的项目后，content填入其具体描述。
- http-equiv：equivalent是“相当于”的意思，http-equiv相当于http文件头，其定义项会加入到http请头中，实现一些特定的效果。

那么，meta有哪些好的应用场景呢？（本问仅会对常用的meta属性进行说明与列举，力求以解决问题为主要目的，如果想了解更多，请穿越这座传送门：[html头部meta标签汇总](https://www.jianshu.com/p/8d28e5130ab2)

## 1.移动端适配
```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
```
解释一下：
- viewport 是指 web 页面上用户的可见区域。
- width=device-width 是指css像素等于设备最佳像素（即占满屏幕），不同设备的divice-width是不同的
- initial-scale=1 是指初始缩放比例
- initial-scale=1.0 是指初始化的时候缩放大小是1，也就是不缩放。
- user-scalable=0 是指禁止用户进行缩放。
- maximum-scale=1.0 是指用户最大缩放大小是1，其实在禁止用户缩放以后，这一句可以省略。


通常来说我们了解这些就绰绰有余了，但是这里引出了一个重要的概念：CSS像素。我觉得有责任把这个meta的实现原理说清楚，先明确几个概念：
- **设备像素 / 物理像素（physical pixels）**
是指屏幕的实际物理像素点，比如普通的1080P手机是 1920*1080 的像素分辨率，那么代表它纵向有 1920 个物理像素点，横向有 1080 个物理像素点。
- **CSS 像素（css pixel） / 密度独立像素（density independent pixels - dip）**
CSS 像素是 web 编程中的概念，是抽象的，不是实际存在的。它是独立于设备用于逻辑上衡量像素的单位，所以又叫密度独立像素。dip 有时候也缩写为 dp 。
屏幕尺寸
指屏幕的对角线长度，单位是英寸（inch），1 英寸 = 2.54 厘米。常见屏幕尺寸有 5.0、5.5 和 6.0 等。
- **屏幕像素密度（pixels per inch - ppi）**
指屏幕上每英寸可以显示的物理像素点的数量。比如 iPhone6 Plus 是 5.5 英寸，分辨率（也就是物理像素）是 1920*1080 像素，那么它的 ppi = √(19202+10802) / 5.5 ≈ 401ppi 。也就是说它每英寸可以显示 440 个物理像素点。
- **设备像素比**
指物理像素和密度独立像素的比值。
window.devicePixelRatio = 物理像素 / dip。
可以通过 window.devicePixelRatio 获得，该属性被所有WebKit浏览器以及Opera所支持。

譬如iphone6（虽然过时了，但是这个例子最经典），他的硬件宽度是750个像素，device-width是375像素，所以我们在css将宽度定义为375px时就占满屏幕了，这就是我们经常听说的“二倍图”
这个时候，前端开发时候如果按照设计图（设计图通常是PC端）中给出的尺寸在移动端定义一张图片的宽度，其真实宽度就会放大二倍，从而产生失真。

## 2.网页内容说明
我们可以将网页的主要内容进行定义，提供给搜索引擎，便于SEO。
```html
<!-- 标题 -->
<meta name="title" content="优酷-这世界很酷" />
<!-- 关键词 -->
<meta name="keywords" content="视频,视频分享,视频搜索,视频播放" />
<!-- 描述 -->
<meta name="description" content="京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，<br>为您提供愉悦的网上购物体验!" />
<!-- 作者 -->
<meta name = "author" content = "Wuriqilang" />
<!-- 版权信息 -->
<meta name="copyright" content="本页版权 www.qidian.com 起点中文网所有。All Rights Reserved" />
```

注意这里title,keywords,descripiton几个属性对于搜索引擎来说权重是逐渐减小的。


