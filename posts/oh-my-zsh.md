---
title: '[程序员必做的100件事] 我是用的 oh-my-zsh 配置'
date: 2022-07-24 01:54:35
tags: [代码仓库]
published: true
hideInList: false
feature: https://industry.wuriqilang.com/uPic/2022-07/WcniMW.png
isTop: false
---
工欲善其事必先利其器,经过多年的大浪淘沙,似乎mac系中终端的选择迎来版本最终答案. oh-my-zsh. 这里记录一下简单的配置过程
<!-- more -->

## 1. 安装

GitHub:
```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

Gitee ( 国内镜像 )
```bash
sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
```

## 2.设置主题

- 打开配置文件
```bash
vim ~/.zshrc
```

- 修改主题： (推荐使用 robbyrussell)
```bash
ZSH_THEME="robbyrussell"
#可以改为
ZSH_THEME="ys"
```

- 加载配置
```bash
source ~/.zshrc
```

查看主题列表
```bash
~/.oh-my-zsh/themes && ls
```

![THEMES](https://industry.wuriqilang.com/uPic/2022-07/2fnYv7.png)


## 3.安装插件
```bash
vim ~/.zshrc
```
找到
```bash
plugins=(git)
#改为
plugins=(git zsh-syntax-highlighting zsh-autosuggestions)
```
- 加载配置
```bash
source ~/.zshrc
```

加载配置时你会发现没有找到 zsh-syntax-highlighting zsh-autosuggestions 插件,下载方法:

安装zsh-syntax-highlighting (高亮显示)
```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

安装zsh-autosuggestions (自动提示,错误显示)
```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

基本配置到这里就结束了,相信你的终端已经发生了让你开心的变化.

## 4.进阶,使用powerlevel10k打造一个专业的终端


- 安装powerlevel10k
```bash
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```
- 安装nerd字体(也可以不安装)
仅仅安装 powerlevel10k 是不够的，你还需要一个能够满足它的字体，包括各种特殊字符和图标（如上图）等，网络中使用最多的是 Hack Nerd Font 。
https://nerdfonts.com/ 

推荐使用 source-code nerd-fonts   它长这样: https://www.programmingfonts.org/#source-code-pro

![](https://industry.wuriqilang.com/uPic/2022-07/MyP66Q.png)


安装后需要做两件事:
1. 修改~/.zshrc中的ZSH_THEME="powerlevel10k/powerlevel10k"，
2. 修改终端字体: Preferences > Profile > Text ；修改终端字体和Non-ASCII字体为Roboto Mono for Powerline(如果安装了nerd字体就可以选择nerd字体)
3. 修改VS Code字体 : SauceCodePro NF

```json
  "editor.fontFamily": "SauceCodePro NF, Menlo, Monaco, 'Courier New', monospace",
```

![](https://industry.wuriqilang.com/uPic/2022-07/4kaYkv.png)


## 5.git插件

可以命令通过这里查看
```bash
vim ~/.oh-my-zsh/plugins/git/git.plugin.zsh
```

```bash
alias ggpur='ggu'
alias ggpull='git pull origin "$(git_current_branch)"'
alias ggpush='git push origin "$(git_current_branch)"'

alias ggsup='git branch --set-upstream-to=origin/$(git_current_branch)'
alias gpsup='git push --set-upstream origin $(git_current_branch)'

alias ghh='git help'

alias gignore='git update-index --assume-unchanged'
alias gignored='git ls-files -v | grep "^[[:lower:]]"'
alias git-svn-dcommit-push='git svn dcommit && git push github $(git_main_branch):svntrunk'

alias gk='\gitk --all --branches &!'
alias gke='\gitk --all $(git log -g --pretty=%h) &!'

alias gl='git pull'
alias glg='git log --stat'
alias glgp='git log --stat -p'
alias glgg='git log --graph'
alias glgga='git log --graph --decorate --all'
alias glgm='git log --graph --max-count=10'
alias glo='git log --oneline --decorate'
alias glol="git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset'"
alias glols="git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset' --stat"
alias glod="git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ad) %C(bold blue)<%an>%Creset'"
alias glods="git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ad) %C(bold blue)<%an>%Creset' --date=short"
alias glola="git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset' --all"
alias glog='git log --oneline --decorate --graph'
alias gloga='git log --oneline --decorate --graph --all'
alias glp="_git_log_prettily"

alias gm='git merge'
alias gmom='git merge origin/$(git_main_branch)'
alias gmtl='git mergetool --no-prompt'
alias gmtlvim='git mergetool --no-prompt --tool=vimdiff'
alias gmum='git merge upstream/$(git_main_branch)'
alias gma='git merge --abort'

alias gp='git push'
alias gpd='git push --dry-run'
alias gpf='git push --force-with-lease'
alias gpf!='git push --force'
alias gpoat='git push origin --all && git push origin --tags'
alias gpr='git pull --rebase'
alias gpu='git push upstream'
alias gpv='git push -v'

alias gr='git remote'
alias gra='git remote add'
alias grb='git rebase'
alias grba='git rebase --abort'
alias grbc='git rebase --continue'
alias grbd='git rebase $(git_develop_branch)'
alias grbi='git rebase -i'
alias grbm='git rebase $(git_main_branch)'
alias grbom='git rebase origin/$(git_main_branch)'
alias grbo='git rebase --onto'
alias grbs='git rebase --skip'
alias grev='git revert'
alias grh='git reset'
alias grhh='git reset --hard'
alias groh='git reset origin/$(git_current_branch) --hard'
alias grm='git rm'
alias grmc='git rm --cached'
alias grmv='git remote rename'
alias grrm='git remote remove'
alias grs='git restore'
alias grset='git remote set-url'
alias grss='git restore --source'
alias grst='git restore --staged'
alias grt='cd "$(git rev-parse --show-toplevel || echo .)"'
alias gru='git reset --'
alias grup='git remote update'
alias grv='git remote -v'

alias gsb='git status -sb'
alias gsd='git svn dcommit'
alias gsh='git show'
alias gsi='git submodule init'
alias gsps='git show --pretty=short --show-signature'
alias gsr='git svn rebase'
alias gss='git status -s'
alias gst='git status'

# use the default stash push on git 2.13 and newer
is-at-least 2.13 "$git_version" \
  && alias gsta='git stash push' \
  || alias gsta='git stash save'

alias gstaa='git stash apply'
alias gstc='git stash clear'
alias gstd='git stash drop'
alias gstl='git stash list'
alias gstp='git stash pop'
alias gsts='git stash show --text'
alias gstu='gsta --include-untracked'
alias gstall='git stash --all'
alias gsu='git submodule update'
alias gsw='git switch'
alias gswc='git switch -c'
alias gswm='git switch $(git_main_branch)'
alias gswd='git switch $(git_develop_branch)'

alias gts='git tag -s'
alias gtv='git tag | sort -V'
alias gtl='gtl(){ git tag --sort=-v:refname -n -l "${1}*" }; noglob gtl'

alias gunignore='git update-index --no-assume-unchanged'
alias gunwip='git log -n 1 | grep -q -c "\-\-wip\-\-" && git reset HEAD~1'
alias gup='git pull --rebase'
alias gupv='git pull --rebase -v'
alias gupa='git pull --rebase --autostash'
alias gupav='git pull --rebase --autostash -v'
alias gupom='git pull --rebase origin $(git_main_branch)'
alias gupomi='git pull --rebase=interactive origin $(git_main_branch)'
alias glum='git pull upstream $(git_main_branch)'

alias gwch='git whatchanged -p --abbrev-commit --pretty=medium'
alias gwip='git add -A; git rm $(git ls-files --deleted) 2> /dev/null; git commit --no-verify --no-gpg-sign -m "--wip-- [skip ci]"'

alias gam='git am'
alias gamc='git am --continue'
alias gams='git am --skip'
alias gama='git am --abort'
alias gamscp='git am --show-current-patch'
```