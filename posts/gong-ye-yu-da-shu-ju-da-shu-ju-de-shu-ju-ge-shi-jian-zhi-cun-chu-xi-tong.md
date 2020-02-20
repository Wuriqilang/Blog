---
title: '【工业与大数据】NoSql——Cassandra 键值存储系统'
date: 2020-02-19 11:28:52
tags: []
published: true
hideInList: true
feature: 
isTop: false
---

# 一、NoSQL运动与Cassandra：
NoSQL(NoSQL = Not Only SQL )，意即"不仅仅是SQL"。NoSQL一词最早出现于1998年，是Carlo Strozzi开发的一个轻量、开源、不提供SQL功能的关系数据库。2009年，Last.fm的Johan Oskarsson发起了一次关于分布式开源数据库的讨论，来自Rackspace的Eric Evans再次提出了NoSQL的概念，这时的NoSQL主要指非关系型、分布式、不提供ACID的数据库设计模式。
2009年在亚特兰大举行的"no:sql(east)"讨论会是一个里程碑，其口号是"select fun, profit from real_world where relational=false;"。因此，对NoSQL最普遍的解释是"非关联型的"，强调Key-Value Stores和文档数据库的优点，而不是单纯的反对RDBMS。

- NoSQL的技术特征
    - 否定关系模型
    - 否定ACID事务
    - 否定SQL语言（某种程度上又回归SQL）

NoSQL主要可以分为三类
-   Document（文档）：Clusterpoint，Apache CouchDB，Couchbase，MarkLogic，MongoDB
-   Key-value（键值）：Dynamo，Cassandra，FoundationDB，MemcacheDB，Redis，Riak，Aeropike
-   Grap（图）：Allegro，Neo4J，InfiniteGraph，OrientDB，Virtuoso，Stardog

## 1.1 Cassandra 

![](http://doc.xr1228.com//post-images/1582083836313.PNG)

- Apache Cassandra 是一套开源的分布式NoSQL数据库系统
- Facebook 开发，用来提升收件箱搜索的特性
- 2008年7月在Google code上开源

- Cassandra特点与定位
    - 无单点故障
    - 高可用性
    - 可配置的一致性
- Cassandra使用场景：适合时间追踪与分析
    - 时间序列数据
    - 传感器设备数据
    - 社交媒体分析
    - 风险分析
    - 故障分析


# 二、Cassandra数据模型

Cassandra数据模型借鉴了google Bigdata的数据模型：
-   键空间 - Keyspace：最上层的命名空间，通常是一个应用程序一个Keyspace， **~=database**
- 列族 - ColumnFamily：和table并不一样，因为Column Family是稀疏的表
- 行 Row： 每一行由一个key唯一标示，由columns组成
- 列 Column：存储的基本单元，它是一个三元组（name，value，timestamp）

![](http://doc.xr1228.com//post-images/1582084090409.PNG)

![](http://doc.xr1228.com//post-images/1582084216424.PNG)

# 三、Cassandra回归SQL的理由
简单的丢弃SQL极大影响了编程效率
- Thrift接口
    - 低层接口：get，get_slice,mutate ....
    - 直接暴露了内部存储结构（不利于系统升级）
- CQL2不支持行操作
- CQL3通过采用复合类型，将KV存储映射到一个更自然的行和列方式表示

 ```sql
  CREATE keyspace testsp WITH replication = {
      'class':'SimpleStrategy','replication_factor':1
  };
  USER testsp;
  DESCRIBE keyspace testsp;
  CREATE ColumnFamily users1(id int,user_name varchar,PRIMARY KEY(ID));
  INSERT INTO users1(id,user_name)Values(1,'abc');
  UPDATE USERS SET user_name = '2025' WHERE id = 1;
  DELETE FROM users WHERE id =1 ;
  SELECT * FROM users1 ;
  ```
可以看出目前Cassandra的语法与SQL非常类似

# 四、Cassandra 系统架构

## 4.1 分布式接口
- Cassandra 采用P2P分布式架构
    - 所有节点在结构上是**对等**关系
- Cassandra任一节点**宕机**
    - 可能对整个集群的吞吐性能造成潜在的影响
    - 不会造成灾难性的服务中断
- Cassandra扩展能力强
    - 集群扩展时，绝大多数步骤都是自动完成的
    - 得益于P2P的架构，集群的扩展想必**主从结构更**为便捷
    - 
## 4.2 不同节点的相互感知 —— 流言协议（Gosspi协议）
在Hadoop这种主从架构的系统中，所有数据节点定期与主节点通讯。所以主从架构中管理节点比较容易。由于cassandra的P2P架构与主从架构不同，在管理集群节点需要特殊技术，那么P2P架构如何管理节点。

  Cassandra借鉴了Amazon的键值系统Dynamo的体系架构，节点利用Gossip协议来发现集群中其他节点的位置（如路由表、Hash环上的位置）、状态（如版本，负载，死活）等信息
- 流言协议也被成为”Epidemic Algorithms“（疫情算法）：一个节点一旦获得了另一个节点的信息，它就将信息传给所有节点。

- Gossip交换信息的三种模式
    - 推模式（Push）
    - 拽模式（Pull）
    - 推+拽模式（Push - Pull）
    - Cassandra Gossip协议选用了第三种模式 
        - 发起者周期性地随机选择一个节点（朋友节点），并初始化一个与它的gossip会话
            1. gossip 发起者向朋友节点发送GossipDigestSynMessage
            2. 这个朋友节点接收到该信息后，返回GossipDigestAckMessage
            3. 发起者接收到朋友节点的ACK消息后，向朋友节点发送 GossipDigestAck2Message

# 五、一致性哈希与数据切分

- 一致性哈希的基本思想
    - 用同样的哈希函数来计算数据对象和节点的哈希值
    - 哈希对象不只是数据，还有节点
- 节点不再是影响书记对象哈希值的参数，而是作为哈希值的参数





























