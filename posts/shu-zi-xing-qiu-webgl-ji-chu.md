---
title: '【数字星球】WebGL基础'
date: 2020-10-19 00:45:05
tags: []
published: true
hideInList: false
feature: /post-images/shu-zi-xing-qiu-webgl-ji-chu.jpeg
isTop: false
---
webGL被视为前端未来几年发展中比较大的增长点。许多团队在涉及到数字工业，农业，城市，园区，交通时最先想到的前端解决方案就是WebGL。
<!-- more -->

# 一、组成 Threejs 应用的几个重要组件

### 场景

场景就是舞台,可以吧任何显示的东西放在场景中的任何位置

```javascript
THREE.Scene = funciton()
```

### 相机

相机就是拍摄场景物体的镜头

- 透视相机
- 正投影相机(远处近处一样大,如CAD图纸)

```javascript
THREE.PerspectiveCamera = function(fov,aspect,near,far);
```

1. 视角fov:眼睛查看世界的角度
2. 近平面near:近处裁面的距离
3. aspect:宽高的比例
4. far:远平面

### 渲染器

将场景的内容显示在屏幕上 THREE.WebGLRenderer()

### 几何体

几何体就是场景中现实的对象
