---
title: '[ 值得投资的一个小时 ] 1个小时快速学习Go'
date: 2022-07-25 00:10:26
tags: [值得一读]
published: true
hideInList: false
feature: https://industry.wuriqilang.com/uPic/2022-07/VzRjXF.jpg
isTop: false
---
这里是 <值得投资的一个小时> 系列, 不说废话 , 希望这一个小时能给你带来一些美好的改变
<!-- more -->

# 一 背景

## 1.1 什么是 Go
Go ( == Golang) 是Google研发的** 静态强类型**,**编译型** 语言

## 1.2 为什么要学Go

- 大势所趋: 
许多大厂(包括我所在的阿里☁️很多项目已经切换到Go)
![trend](https://industry.wuriqilang.com/uPic/2022-07/t8nONt.png)

- 时代变化
1. Go的很多特性更适合云原生场景
2. Go对于区块链中加密算法很有优势

总之Go是一门非常优秀的语言, 它很适合喜欢简洁,高效代码的你. 推荐你将Go作为你的**第二语言** 

## 1.3 Go的优点 ( 这部分可以先略过, 后面回过头再看 )

- **语言风格**
大道至简，比如及其简单但完备的面向对象设计，面向接口，没有继承只有组合；
最少特性，一个特性对解决问题有显著效果就没有必要存在；
显式表达，比如数据类型必须显式转化，不提供隐式转化能力；
最少惊异，减少那些奇怪的特性设计，最大程度减少错误发生概率；

- **语言特性**
静态语言、静态编译速度快，拥有静态语言的安全与性能；
天然支持并发，基于CPS并发模型，goroutine轻量级线程，支持大并发处理；
简洁的脚本化语法，如变量赋值 a := 1，兼具静态语言的特性与动态语言的开发效率；
提供垃圾回收机制，不需要开发人员管理，通过循环判活，再启用goroutine来清理内存；
创新的异常处理机制，普通异常通过返回error对象处理，严重异常由panic、recover处理；
函数多返回值，方便接收多值，一些解释性语言已经支持，如python、js的es6等；
支持defer延迟调用，从而提供了一种方式来方便资源清理，降低资源泄露的概率；
面向接口的oop，没有对象与继承，强调组合，以类似于duck-typing的方式编写面向对象；

你很容易就会发现 Go是一帮大佬强迫症犯了 , 解决其他语言中各种缺陷的产物.


# 二 安装
这里只介绍Mac系统下的安装 ( 其他系统可以查看相关资料 )

## 2.1 下载安装
~[下载地址](https://golang.google.cn/)

点击下载, 然后安装, 就这么简单 (windows系统需要设置环境变量)
![](https://industry.wuriqilang.com/uPic/2022-07/mLy8qS.png)

安装后查看版本
```bash
❯ go version
go version go1.18.4 darwin/amd64
```

## 2.2  环境配置
安装成功后，环境变量的配置也很简单 ( 此时此刻 )

仅需要几步操作即可

1、设置GOPATH路径（GOPATH路径是我们的工作区, 默认是 usr/go  不配置也可以）
```bash
go env -w GOPATH=我们自己的工作区路径
```
2. 什么都别管，先打开GoMOD，再配置代理
```bash
go env -w GO111MODULE=on 
go env -w GOPROXY=https://goproxy.cn,direct
```
3. 重要的环境变量

Go 通过环境变量来做项目上的管理和控制，通过命令 go env 可以查看相关变量：

```bash
go env
```
重要的就两条
**GOROOT** ： Go 的安装目录，即可执行文件所在的目录；
**GOPATH** ：GOPATH 是 Go 语言中使用的一个环境变量，它使用绝对路径提供项目的工作目录（也称为工作区）。~[参考文章](https://www.cnblogs.com/ailiailan/p/13454139.html)

因为我们想在全局使用go相关的命令,所以需要简单的配置一下环境变量:  (适用于mac, 其他系统请另行百度,大同小异)

1. 打开配置文件  vim ~/.zshrc
2. 在文件底部加上这三行
```zsh
export GOROOT=/usr/local/go  # 告诉系统GO的安装位置
export GOPATH=/Users/wuriqilang/go # 告诉系统三方包安装的位置
export PATH=$PATH:$GOPATH/bin # 告诉系统,我可以直接使用三方包提供的指令
```
3. 加载配置  source ~/.zshrcx

## 2.2 开发工具
推荐使用VS Code , 安装Go插件即可

# 三 第一个行代码

新建go项目目录，并在项目的src目录中创建hello目录

```bash
# 创建project的目录
$ mkdir gproject

# 进入目录
$ cd gproject/

# 初始化
go mod init gproject
go: creating new go.mod: module gproject
```

在该目录中创建一个main.go文件：

```go
package main // import "golang" (此处的注释为go mod init 生成的 module 值)

import "fmt"

func main() {
	fmt.Println("xxx")
}
```

执行或编译后执行：
```bash
# 直接run
$ go run main.go 

# 编译成二进制文件
$ go build

# 执行二进制文件
```

# 四 Go的语法细节(针对初学者)
这部分不建议去看任何其他资料,除了这个网址
https://tour.go-zh.org


看到这里你已经对于Go有了一个初步的了解, 你对于第一章里Go的语言风格和特性似乎有了进一步的了解, 那么你决定去深入学习他了吗?

# 五 如何你决定要深入学习Go, 下面资料可以参考
只列举我认为必看的文档,持续更新

- go官网:https://go-zh.org/
- 切片的本质: https://blog.go-zh.org/go-slices-usage-and-internals
- Go Web编程:https://www.bilibili.com/video/BV1Xv411k7Xn/?p=1 (视频教程,杨旭)
- 一个很好的Go教程(可以当做查询工具)  https://www.topgoer.com/