---
title: '【工业与大数据】典型的云计算系统：OPENSTACK'
date: 2020-02-02 16:02:11
tags: [大数据]
published: true
hideInList: false
feature: /post-images/gong-ye-yu-da-shu-ju-dian-xing-de-yun-ji-suan-xi-tong-openstack.png
isTop: false
---
### 一个虚拟机的生命周期
![](http://doc.xr1228.com//post-images/1580630632121.png)

1. 用户通过界面或命令行向API发送 ‘create instance’
2. API节点记录虚拟机信息，发送调度请求给调度器
3. 调度器找到可用的计算节点，向计算节点发送‘vm provision’请求
4. 计算节点通过虚拟机hypervisor启动虚拟机
5. Hypervisor去**镜像存储服务**获取虚拟机磁盘镜像
6. 计算节点向网络节点发信息，请求给新创虚拟机分配网络资源
7. 网络节点通过配置虚拟交换机配置网桥、VLAN等，实现虚拟网络，并在数据库中记录网络信息
8. 计算节点向虚拟存储服务要求新建虚拟磁盘卷，并通过iSCS协议挂载
9. 用户通过界面查询虚拟机创建的结果

> 以上操作是异步

### 什么是一个好的云计算系统
- 让用户彻底忘记底层的硬件（通过好的虚拟化和抽象，让用户忘记复杂的硬件与运算逻辑）