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


## 一个前端页面是如何渲染出来的？

