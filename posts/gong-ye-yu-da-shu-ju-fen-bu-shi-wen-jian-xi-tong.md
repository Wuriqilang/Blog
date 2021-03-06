---
title: '【工业与大数据】分布式文件系统'
date: 2020-02-02 16:14:41
tags: [大数据]
published: true
hideInList: false
feature: /post-images/gong-ye-yu-da-shu-ju-fen-bu-shi-wen-jian-xi-tong.jpg
isTop: false
---
## 一、文件系统基础  
</br>

### 文件系统概述
#### 为什么要有文件系统？
需要介质保存一些永久的数据，停电后数据也可以长期保存
#### 文件系统的名字空间，名字空间的操作
在文件数节点上进行操作
#### 文件系统中文件读写操作
提供一些例如 open、read、write、close的操作函数
- open 操作：将文件 offset = 0，并记录文件操作信息
- close 操作：将文件从内存中删除
- read 操作：从offset=0位置读取size大小的数据。
  
### 文件系统的设计
#### 文件系统的下层接口
- 磁盘的读写接口，磁盘中的地址
#### 文件系统的上层接口
- 文件树的组织
- 文件数据的读写
#### 文件系统最本质的功能：将文件名字翻译定位到一个具体的磁盘位置，进而可以完成文件的读写。  

</br>


### 文件系统接口标准化
虚拟文件系统（VFS）是物理文件系统与服务之间的一个接口层，它对Linux的每一个文件系统的所有细节进行抽象，使得不同的文件系统在Linux核心以及系统中运行的其他进程看来，都是相同的。即调用VFS接口来调用不同的文件操作系统。
</br>
</br>
### 文件系统的磁盘数据结构
![](http://doc.xr1228.com//post-images/1580632535964.png)

### 文件系统的讨论
- 关于磁盘块大小的讨论
    - 一个文件起码占用1个文件块的空间（选择磁盘块越小浪费越小）
    - 每个磁盘块需要元数据进行描述（磁盘块越多，开销越大）
    - 虽然磁盘物理特性决定了最小的读写单元512字节，但是目前多数文件系统选用4k磁盘块。（根据不同文件系统特点选择）

- 文件系统的缓存
    - 缓存能够加速的必要条件，时间局部性（经常访问）与空间局部性（附近的数据也需要访问）

- 磁盘系统的优化策略
    - 磁盘的顺序读写与随机读写：尽量让磁盘进行顺序读写（顺序读写100MB带宽，随机读写1MB带宽）
    - 如何进行磁盘优化

## 二、分布式文件系统

- 分布式文件系统需要提供什么功能？
    - 文件系统目录树
    - 文件的读写
- 分布式文件系统建立的基础要讨论的两个问题
    - 是否直接面对磁盘？ 
        - 无需直接面对磁盘，而是使用每台机器的操作系统中的文件系统来操作磁盘
        -  直接面对磁盘： SANFS 更高性能
    - 分布式文件系统中的地址是什么？
        - 无法直接定位到磁盘：先定位到机器，然后定位到磁盘

> 分布式文件系统的本质功能：将一个以目录树表达的文件翻译为具体的节点，而到磁盘的定位则可以交给本地文件系统完成。

## 三、分布式文件系统举例 NFS（网络文件系统）

![](http://doc.xr1228.com//post-images/1580954964552.PNG)

###NFS文件系统的扩展：AFS文件系统
NFS系统只有一台服务器，通过一台服务器对文件进行定位，用户操作某一个文件时，其实是对Server上某个目录进行操作。

![](http://doc.xr1228.com//post-images/1580955318970.PNG)

AFS是放在广域网的分布式文件系统

1. 当用户访问某个文件时，先访问根服务器 /afs
2. 根服务器维护了下一级服务器 （pku,tsinghua,washington)
3. 每一级服务器为用户返回下一级服务器地址
4. 最后一步交给本地文件系统对具体文件操作









