---
title: 'Python实用教程01  一句话表白 '
date: 2020-01-22 21:49:28
tags: [python]
published: true
hideInList: false
feature: /post-images/python-jiao-cheng-01.png
isTop: false
---
让我们做一个小游戏吧,体会一下 Python 独特的魅力。
<!-- more -->


请在 VS Code 中新建一个.py 文件，或者是在命令行管理器中输入 Python（MacOS 输入 Python3）写入以下内容。

```python
print('\n'.join([''.join([('Chinese！'[(x-y)%8]if((x*0.05)**2+(y*0.1)**2-1)**3-(x*0.05)**2*(y*0.1)**3<=0 else' ')for x in range(-30,30)])for y in range(15,-15,-1)]))
```

点击运行（F5）后,出现了一个中国心。是不是很有趣？将代码中 Chinese！ 修改为喜欢的姑娘的名字送给她吧！(注意必须是 8 个字符)

![](http://doc.xr1228.com//post-images/1579701034908.png)

Python 的魅力远不止于此,这段代码初学者还不需要明白是什么意思，让我们赶快进入到后面的学习吧！