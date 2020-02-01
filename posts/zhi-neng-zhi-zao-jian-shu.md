---
title: ' 智能制造简述'
date: 2020-01-22 15:56:31
tags: [智能制造,大数据]
published: true
hideInList: false
feature: /post-images/zhi-neng-zhi-zao-jian-shu.jpg
isTop: false
---

## 一、为什么智能制造
2016年7月，京东方的业务定位由一家半导体显示技术、产品和服务提供商转型为一家为信息交互和人类健康提供智慧端口产品和专业服务的物联网公司。在践行智能制造的过程中，我们开发了一套应用于京东方面板生产产线的设备智能监控系统。旨在消除设备监控死角，节约不良调查时间，减少工厂生产运营人力成本。将设备监控从“发现不良→调查设备→解决问题”的被动模式转化为”设备监控→预防不良”的主动模式。通过充分挖掘企业数据潜能，建立一套可视化、智能化的设备监控系统，将工程师从繁复的日常监控工作中解放出来,为公司运营提供长久动力。
### 1.1 Array智造整体架构
如何真正实现智能制造，将智能化生产应用于实际工厂运营当中来不同工厂有不同的思路。通过对我国智能制造试点示范项目进行分析，梳理出如下九种典型的智能制造新模式：
![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567583134061-9095d2cc-1ced-4460-a1d0-b20f5a119eaa.png#align=left&display=inline&height=386&name=%E5%9B%BE%E7%89%87.png&originHeight=386&originWidth=587&size=118189&status=done&width=587)


工厂的智能化程度取决于其对数据的利用程度。结合对京东方自动化程度以及实际生产制造模式，设计了一种以挖掘企业数据潜能为核心的智能制造模式。
设备智能监控系统是一套建立在BOE工厂现有CIM系统基础上，以挖掘数据潜能为核心思路而设计的数据采集、处理、分析系统。这个系统由以下几个节点组成：
1.设备端：高度信息化的设备实时信息发送给MES系统，通过EIS对信息格式进行统一。
2.CIM端：通过MES、YMS、DFS、eMpa、SPC、BO等系统将生产信息，测试信息进行汇总处理，并提供端口供设备智能监控程序调用原始数据。
3.监控端：智能监控程序将原始数据进行分析处理最后生成可视化程度、集成度高的信息反馈给工程师，并展示在Monitor看板，以便管理者掌握生产运营状态。
![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567583254106-8d646a0c-d511-4e26-8363-63e59382842a.png#align=left&display=inline&height=320&name=%E5%9B%BE%E7%89%87.png&originHeight=320&originWidth=548&size=74161&status=done&width=548)


所以说Array智造软件专注于应用层的开发，通过整合现有数据资源，通过软件来优化工程师工作效率，减少无用的重复的劳动。

### 1.2 Array智造的基础 —— 数据
本节重点介绍Array智造中的数据如如何获取的，并介绍了两个采集数据的软件。
为了便于理解，下面将通过不同功能的的数据源获取方式来依次介绍Array智造的数据模块。
#### 1.2.1 AOI Monitor的数据获取
AOI Monitor在设计之初是单纯为日常Monitor工作服务的，所以采用了单一数据源 —— DFS

- DFS 是公司提供的分布式文件存储服务，对于我们业务部门来说，其使用体验等同于共享。
- 目前DFS 的统一访问地址是  10.120.8.52  账号是 dfssrv2\cifsa  密码是 cifsa 
- 注意：AOI Monitor为访问Inform等常用功能开放了快捷方式，后续担当可以根据业务需求修改

![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567584769308-57815052-ea59-4897-8f98-fb85eaaac450.png#align=left&display=inline&height=192&name=%E5%9B%BE%E7%89%87.png&originHeight=192&originWidth=226&size=7897&status=done&width=226)    ![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567584583410-1027da76-f284-42dd-93d9-7359c56a053f.png#align=left&display=inline&height=178&name=%E5%9B%BE%E7%89%87.png&originHeight=178&originWidth=404&size=39133&status=done&width=404)
#### 1.2.2 CD Monitor的数据获取
CD Monitor的数据流是 CD设备→曝光机共享→Monitor软件  来进行的，其获取数据的手段都是通过FileGee软件，该软件会在后面重点介绍。 该部分由马晓宇负责，如由疑问联系马晓宇。
#### 1.2.3 IM Monitor的数据获取
IM Monitor的数据来源如下：

- DFS   包含了用户查询的IM Monitor图片信息
- FTP   IM监控电脑不能访问共享，所以提交Abnormal时会先将Abnormal数据传到
> FTP://10.120.9.22/【7】IM Abnormal

- 共享  所有的Abnormal图片都会在存储在新共享
> \\10.120.21.123\Photo共享\42.Photo工程部工作优化小组\Array智造\MuraHistor


所以IM Monitor的数据流向如下
![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567586067028-e975c41e-9c89-48cc-9b56-597a0626b153.png#align=left&display=inline&height=349&name=%E5%9B%BE%E7%89%87.png&originHeight=349&originWidth=1096&size=11649&status=done&width=1096)
#### 1.2.4 THK Monitor
THK Monitor数据来源全部为共享，数据流如下
![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567586183451-5e1e7fb1-b0a9-4bbe-98a5-7f7866258f86.png#align=left&display=inline&height=121&name=%E5%9B%BE%E7%89%87.png&originHeight=121&originWidth=1053&size=6779&status=done&width=1053)
值得注意的是THK共享近期没有进行维护，后续担当需要开启。
#### 1.2.5 设备监控
设备监控中所有的数据都是从设备ProcessData中获取的，当我们将ProcessData保存到共享中，Array智造软件就可以方便的对数据进行处理和展示。其数据流向如下：


![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567586828504-61a29a83-9785-4c56-9734-d43c4a0895ce.png#align=left&display=inline&height=667&name=%E5%9B%BE%E7%89%87.png&originHeight=667&originWidth=1110&size=29880&status=done&width=1110)

值得注意的是：每天设备的数据现在设备上使用FTP Ghost软件简单处理后再利用FileGee进行上传

#### 1.2.6 不良监控
不良监控为了将各台设备的AOI Trend和工艺相关联起来，采取了比较复杂的数据获取方式。
其数据获取方式与设备监控数据获取类似，重点在于将设备的工艺数据与DFS的测试数据相结合起来。


![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567589162513-c0c2b6b2-ecb0-45c2-a1e7-ee86bfdb0c17.png#align=left&display=inline&height=659&name=%E5%9B%BE%E7%89%87.png&originHeight=659&originWidth=1106&size=30516&status=done&width=1106)
#### 1.2.7 产能监控
产能监控数据获取与设备监控相同，请参考 6.2.5


#### 1.2.8 数据处理软件 参考附件【14】
不难发现，上述各种数据获取离不开两个软件 FileGee与FTP Ghost。 具体使用方法较为复杂，已经单独交接给相关担当，软件请参考附件【14】

### 1.3  智能制造的具体实现
本节将介绍各软件模块的功能与基本实现思路，便于后续担当对软件进行进一步开发与维护。

#### 1.3.1 AOI Monitor
AOI Monitor目的是简化工程师日常Monitor流程，方便数据信息获取与基本的不良调查，其功能必须配合DFS使用，即用户电脑要开启DFS权限。AOI Monitor主要功能与实现如下：
**AOI Monitor部分**


- 通过LotID查询所有测试过得工序
- 点击相应工序后显示测试过得Glass并且计算Total，对于异常Total使用红色显示
- 点击跳转到DFS后能快捷跳转到DFS中，便于工程师看图

**Tracing工具部分**

- 通过GlassID查询所有测试过的工序
- 多工序匹配Tracing结果，已经抓图的显示匹配结果，有Defect未抓图显示粉色背景，没有抓图显示灰色

这里着重说一下Tracing工具的实现方式：先通过Data文件夹将所有Defect点位获取，匹配后（匹配规则是如果两个工序的点 X+Y的差＜0.5um且Y的差<0.5认为这两个点能够匹配到）筛选出查询到的Defect点并到Image文件夹中根据坐标找相应的图片，将图片地址存储到数据列表中，最后通过一定规则显示出来。


#### ![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567588150931-63e193b6-bbd9-4e61-bc70-942ca4601f84.png#align=left&display=inline&height=220&name=%E5%9B%BE%E7%89%87.png&originHeight=823&originWidth=1130&size=415771&status=done&width=302)        ![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567588691160-49d5e579-b6bc-4cac-ac67-0d3662c67fa4.png#align=left&display=inline&height=223&name=%E5%9B%BE%E7%89%87.png&originHeight=823&originWidth=1138&size=231877&status=done&width=308)
**Mapping工具**

- 该功能尚未开发完成，目标是能够根据DefectCode对多张Glass，或者多个Lot或者一段时间内的defect进行Mapping，请后续担当继续开发，如有问题可以联系我。
#### 1.3.2 IM Monitor
IM Monitor主要功能与实现如下：

- 通过LotID查询所有测试过得工序，并显示IM图片
- IM图片查看时具有放大镜功能
- 点击图片时自动计算点位与在LC机台上的位置
- 点击发送Abnormal单跳转到Abnormal单界面，在Abnormal单可以输入不良点位，并对图片进行标注
- 提交Abnormal单时自动计算，防止出现错误提交重复提交的情况
- 提交后的Abnormal单自动保存到FTP并且同步到共享中，工程师打开软件可以看到之前开的Abnormal记录
- 工程师可以对Abnormal单进行回复，回复后再记录界面显示回复情况，回复人等信息
- 附加Mura管理手册，便于Monitor人员判断不良原因

![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567589798924-4c6d99bc-c741-411a-bbef-00940806f74e.png#align=left&display=inline&height=923&name=%E5%9B%BE%E7%89%87.png&originHeight=923&originWidth=1239&size=116133&status=done&width=1239)
#### 1.3.3  THK Monitor
注：THK Monitor目的是统一管理膜厚数据，简化膜厚数据处理。
THK Monitor实现功能主要如下：

- 从共享中中获取各设备测试历史，计算测试结果。 →**后续担当应该严格要求到班组将数据放入相应文件夹中**

- 拖拽计算测试结果（支持用户把文件直接拖拽到软件中，自动计算）
- 支持同时查看两次测试结果（3D/Cross可以放到一个界面）

因为测试数据复杂，计算逻辑和可视化逻辑需要的步骤较多，目前THK Monitor不足之处：

- 文件命名必须严格遵循命名规则 （详见5.1）

- 对于3D的显示没有合适的Chart控件，所以没有显示三维图形。 →需要后续开发
- 


![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567648084311-11142500-65b7-4d1a-b92c-ae0f6e3de52d.png#align=left&display=inline&height=785&name=%E5%9B%BE%E7%89%87.png&originHeight=785&originWidth=1162&size=102181&status=done&width=1162)

#### 1.3.4 设备管理系统
设备管理系统承担着我们科室自动点检，设备状态监控，产能监控的重要使命。该部分需要详细介绍并后续担当重点优化与开发。
##### 1.3.4.1 设备管理系统的两个软件版本
为了优化设备的管理，在之前设备管理系统的基础上，开发了两个版本，他们在Array智造主界面的以下位置。
![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567648651670-a55ae6b8-0281-4584-9d12-209cb0201242.png#align=left&display=inline&height=222&name=%E5%9B%BE%E7%89%87.png&originHeight=222&originWidth=1110&size=20182&status=done&width=1110)


- 设备监控为旧版软件，包括了设备监控的绝大多数功能。
- 设备管理为新版软件，包括了HoldList与自动点检、ProcssData查看等新功能

**计划将旧版软件所有功能迁移到新版软件，但是时间有限，请后续担当继续推进。**
##### 1.3.4.2 自动点检功能
自动点检实现是将ProcessData中最新三张Glass数据与Spce表对比，如果其中有连续两张Glass都OutOfSPC，则提示设备参数异常。
所以后续担当主要维护以下几点

- 根据实际生产情况调整Spec
- 根据实际生产情况设置报警逻辑
- 根据工程师经验为每个参数设定调整建议和影响    

同时自动点检功能为一些重点参数设定了快捷查看入口，对于TactTime也设立了可视化图表


![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567649535066-521bef35-9c16-4555-8513-944b96f6c7fe.png#align=left&display=inline&height=825&name=%E5%9B%BE%E7%89%87.png&originHeight=825&originWidth=1354&size=175515&status=done&width=1354)

##### 1.3.4.3 Tank监控
为了避免Tank切换导致的批次性工艺不良，在主界面也可以显示目前PLN设备使用的Tank情况
计算逻辑是：根据设备最近一张Glass使用Tank情况判断目前设备使用哪个Tank
##### 1.3.4.4 VCD时间点检
计算逻辑：根据设备最近几张Glass VCD工艺时间计算两个VCD Chamber的工艺时间差


![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567649710578-67fa62aa-c044-4c18-8f1d-8f4920ac0a21.png#align=left&display=inline&height=493&name=%E5%9B%BE%E7%89%87.png&originHeight=493&originWidth=347&size=27243&status=done&width=347)


##### 1.3.4.5 CD波动调查
计算逻辑：根据设备ProcessData将某个Lot CD波动相关数据直观展示
##### 1.3.4.6 Hold List
HoldList实现逻辑相对较为复杂，具体实现方式
BO自动发送邮件 → 通过OutLook功能自动下载附件至D盘→利用FileGee同步文件到共享→设备监控软件读取HoldList文件并筛选与Track相关Lot
该功能重点在于邮箱附件的自动保存，但是这种方式费时费力还不好维护（OutLook的自动化功能也不稳定，后续我去CIM以后再进行修改吧）
##### 1.3.4.7 自动化点检表
为应对体系审核，需要对点检表进行自动生成，该功能放在设备管理系统中，具体交由王志敏维护，详见1.3.5
##### 1.3.4.8 ProcessHistroy
为便于查看ProcessData History，模仿产线内History功能。
该功能未开发完成，有以下遗留问题：

- 数据获取耗时较长，计算逻辑有待优化
- 未加入可视化图表和数据筛选功能，需要进一步开发
- 


![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567650482748-27b87d01-0913-4f86-936f-92192ab25a6d.png#align=left&display=inline&height=981&name=%E5%9B%BE%E7%89%87.png&originHeight=981&originWidth=1303&size=65177&status=done&width=1303)

#### 1.3.5 自动化点检表
为应对体系检查，需要生成点检表。针对该问题开发功能如下：

- 输入点检人，点击点检按钮对当日所有设备进行点检
- 对于NG项目备注中提示NG原因，并提示已经调整OK
- 点击保存点检结果后将点检数据保存到共享中
- 点击SPEC设置，可以查看设定的Spec值，（暂未加入修改Spec功能，修改需要在共享中修改Txt文件）
- 隐藏功能：选择StartTime→点击管理员功能  就可以实现从选择日期开始所有日期点检表的检查和保存


![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567671153504-9972651b-53d9-427a-9855-720d91be2e91.png#align=left&display=inline&height=971&name=%E5%9B%BE%E7%89%87.png&originHeight=971&originWidth=1292&size=81412&status=done&width=1292)

#### 1.3.6 不良监控系统
为了优化不良调查流程，减少重复工作，开发了不良监控系统。
目前实现功能如下：

- 根据设备，日期，自动分析进行过的Lot，生成相关的Layer。
- 根据用户选择的Layer，输入的Defect Code，生成Trend（时间按照Track进行Mask时间），Chamber别，Mapping结果。 （如果DefectCode输入所有不良，则刷取所有Code）
- 支持切换DIPI和FIPI结果

该功能仍有许多优化空间：

- 目前尚未加入型号别刷取
- 刷取速度很大一部分取决于电脑速度，可以通过更加优化的异步等方法优化。
- 每次刷取是对时间和DFS资源的巨大负担，后续可以通过自动记录数据库的方式优化。（数据库已经进行过开发，但是受限于CS架构模式，暂时弃用）

我们最终的目的是，10W左右的数据量能够在10s内显示出来，这必须依托于CS架构，所以我先去CIM学习了，后续开发可以联系我。

#### 1.3.7 产能监控
产能监控主要功能如下：

- 根据用户选择设备，日期读取ProcessData，自动计算TactTime
- 根据过滤条件选择计算相应TactTime
- 计算cycleTime（但是cycleTime中部分EXP单元时间不正确，后续可以酌情调整）


![图片.png](https://cdn.nlark.com/yuque/0/2019/png/332465/1567673699483-867c9f77-37a9-4c97-9d64-92738be78158.png#align=left&display=inline&height=771&name=%E5%9B%BE%E7%89%87.png&originHeight=771&originWidth=1240&size=101617&status=done&width=1240)

#### 1.3.8 其他辅助功能
智能制造中也开发了多项辅助功能，类似人工判图，Recipe自动生成等，请知悉。
#### 1.3.9 Recipe自动备份 参考附件【14】
Recipe自动备份是确保重要数据不丢失的手段。其实现方法是通过FileGee进行的，附件中提供了FileGee使用手册。
目前建立自动备份的方法已经交接给张雪，姜欢欢。请知悉

### 1.4 智能制造的开发 参考附件【15】
#### 1.4.1 Array智造软件的发布与安装
 Array智造是一种CS构架的软件。CS架构是一种较为早期的软件架构模式，大多数的数据处理逻辑与运算是在客户端进行的，这种模式在效率和用户体验上有一定提升，但是每次用户安装和升级需要大量的工作。这里着重介绍一下Array智造软件的发布与安装。

- 发布采用Visual Stuido自带的OneClick模式（类似于OIC的发布），这样的好处在于安装包存放在服务器或者共享中，提供给用户可以是一个2k的小安装程序。
- 发布时开发者设置好 版本号，运行环境，安装地址后点击发布即可（具体有疑问联系我）
- Array智造采用了 Task.Run（多线程）等.net FrameWork4.5 以上才有的功能，所以Win7电脑安装Array智造时需要先安装 .net FrameWork 4.5即以上  参考附件【16】

#### 1.4.2 Array智造 开发环境构建

- Array智造开发工具为 VS（Visual Studio 2017即以上），该软件有微软提供的社区免费版本，百度一下即可
- Array智造选用的主要开发语言为C#，少量功能采用了 前端语言实现（html js css），后续担当简单学习即可，以解决实际工作需求为目的。
- 经过大量对比测试，Array选用的技术框架为 Winform，这是一种比较古老的技术框架，但是适配性好，上手容易。
- UI控件集选用了MetroFramework UI，并且根据其源码进行了一定程度的定制开发。推荐后续担当采用此框架

#### 1.4.3 Array智造源代码

- 因为Array智造本质也属于一种比较宝贵的脑力活动资产，源代码保留在我之前使用的科室笔记本电脑中，已经交际给担当 姜欢欢。
#### 1.4.4 智能制造开发所需的一些学习资源  参考附件【17】

- 编程学习推荐在网易云课堂搜索C#进行学习
- 附件中提供了少量学习资料，多数学习教程存放在 科室笔记本电脑  D盘 学习资料中
- 在Bilibili上也有很多C#语言相关的学习资源

