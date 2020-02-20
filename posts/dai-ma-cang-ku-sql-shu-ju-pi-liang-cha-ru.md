---
title: '【代码仓库】SQL -- 数据批量插入'
date: 2020-02-14 11:37:01
tags: [SQL,代码仓库]
published: true
hideInList: false
feature: /post-images/dai-ma-cang-ku-sql-shu-ju-pi-liang-cha-ru.jpg
isTop: false
---
-- 1 清空临时表,清空后注意提交
```sql
delete EQP_ALARM_MST_PP_TEMP
```
-- 2 用excel生成的代码 插入到临时表


-- 3 判断临时表中是否有重复数据
```sql
select count(distinct t.EQP_MODULE_ID ||t.EQP_DCP_ID || t.ALARM_ID) from EQP_ALARM_MST_PP_TEMP t 
select count(t.EQP_MODULE_ID ||t.EQP_DCP_ID || t.ALARM_ID) from EQP_ALARM_MST_PP_TEMP t
```

-- 4 如果有重复数据  删除临时数据  提交
```sql
delete from EQP_ALARM_MST_PP_TEMP T
 where (t.EQP_MODULE_ID, t.EQP_DCP_ID, t.ALARM_ID) in
       (select EQP_MODULE_ID, EQP_DCP_ID, ALARM_ID
          from EQP_ALARM_MST_PP_TEMP
         group by EQP_MODULE_ID, EQP_DCP_ID, ALARM_ID
        having count(*) > 1)
   and rowid not in (select min(rowid)
                       from EQP_ALARM_MST_PP_TEMP
                      group by EQP_MODULE_ID, EQP_DCP_ID, ALARM_ID
                     having count(*) > 1)
```

-- 5 将临时数据表merge 到目标表

--方法1
```sql
INSERT INTO EQP_ALARM_MST_PP
  SELECT *
    FROM EQP_ALARM_MST_PP_TEMP t
   where not exists (SELECT 1
            FROM EQP_ALARM_MST_PP
           where EQP_ALARM_MST_PP.EQP_MODULE_ID = t.EQP_MODULE_ID
             and EQP_ALARM_MST_PP.EQP_DCP_ID = t.EQP_DCP_ID
             and EQP_ALARM_MST_PP.ALARM_ID = t.ALARM_ID)
```
--方法2
```sql
Merge into EQP_ALARM_MST_PP G
using (select * from EQP_ALARM_MST_PP_temp) NG
on (G.EQP_MODULE_ID = NG.EQP_MODULE_ID 
and G.EQP_DCP_ID = NG.EQP_DCP_ID 
and G.ALARM_ID = NG.ALARM_ID
)
when not MATCHED THEN
INSERT (RAWID,EQP_MODULE_ID,EQP_DCP_ID,ALARM_ID,ALARM_CODE,ALARM_TEXT,ALARM_TYPE,USED_YN,SEVERITY_CD,SEND_YN,FIRST_YN,SUBEQP_RAWID,DESCRIPTION,CREATE_DTTS,CREATE_BY,LAST_UPDATE_DTTS,LAST_UPDATE_BY,EQP_ID,SOURCE_ID)
VALUES (NG.RAWID,NG.EQP_MODULE_ID,NG.EQP_DCP_ID,NG.ALARM_ID,NG.ALARM_CODE,NG.ALARM_TEXT,NG.ALARM_TYPE,NG.USED_YN,NG.SEVERITY_CD,NG.SEND_YN,NG.FIRST_YN,NG.SUBEQP_RAWID,NG.DESCRIPTION,NG.CREATE_DTTS,NG.CREATE_BY,NG.LAST_UPDATE_DTTS,NG.LAST_UPDATE_BY,NG.EQP_ID,NG.SOURCE_ID)
```