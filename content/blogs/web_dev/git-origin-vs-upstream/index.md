---
title: Git 中 origin 與 upstream 的差別與實務操作
description: 深入理解 Git 遠端倉庫 origin 與 upstream 的角色差異，掌握 fork 專案常見協作流程與指令操作。
tags: [git, github, version_control, workflow]
category: web_dev
date: 2026-02-15
---

# Git 中 origin 與 upstream 的差別與實務操作

在使用 Git 進行協作開發時，你可能會看到兩個常見名稱：`origin` 與 `upstream`。它們其實都是「遠端倉庫（remote repository）」的別名，但在實務上代表的角色不同。

很多新手會以為這是 Git 的某種特殊功能，但其實它們只是遠端倉庫的「名稱」。差別不在技術層面，而在於 **協作流程中的角色定位**。理解這件事最好的方式，是從 GitHub 上的 fork 協作模式開始。

---

## 用 fork 情境理解 origin 與 upstream

想像你在 GitHub 上看到一個你想參與的專案，例如：

**原作者的專案：**
`https://github.com/alice/project`

你點擊 GitHub 的 Fork 按鈕後，會得到一份自己的副本：
`https://github.com/damien/project`

這時候就出現兩個不同的遠端倉庫：
1. 原作者的 repo
2. 你 fork 出來的 repo

當你把自己的 fork clone 到本機時：
```bash
git clone https://github.com/damien/project.git
```

Git 會自動幫你建立一個遠端名稱：
```bash
origin → https://github.com/damien/project.git
```

此時，`origin` 代表的是「你自己的遠端倉庫」。但原作者的專案還沒有被加入遠端設定，所以這時候其實還沒有 `upstream`。

---

## 手動加入 upstream

如果你希望同步原專案的更新，就需要手動把原作者的 repo 加入為另一個遠端：

```bash
git remote add upstream https://github.com/alice/project.git
```

此時遠端關係就變成：
```perl
origin → 你的 fork（可以 push）
upstream → 原始專案（通常只 fetch）
```

這是一種社群慣例，而不是 Git 的強制規則。你也可以用其他名稱，但大家通常都遵循這種命名方式。

---

## 用圖像方式理解整體關係

可以把這個架構想成三層關係：

```markdown
upstream (original project)
   ↑
   |
Local repo → origin (your fork)
```

或用資料流向來看：
```perl
upstream → origin → local
            ↑
           push
```

1. 你從 `upstream` 拉取最新更新
2. 整合到本地
3. 再 push 到 `origin`

這樣就完成了一個標準的 fork 協作流程。

---

## 常見的實務工作流程

在 fork 專案後，最常見的需求是「同步原專案的更新」。

### 同步 upstream 的更新
```bash
git fetch upstream
git merge upstream/main
```

或使用 rebase：
```bash
git rebase upstream/main
```

這代表：**把原專案的最新變更整合進你的本地分支。** 這一步非常重要，否則你的 fork 會慢慢與原專案產生差異。

### 推送到自己的遠端（origin）
當你完成修改後，可以把變更推送到自己的 GitHub repo：

```bash
git push origin main
```

這代表：**把本地修改推送到你可以控制的遠端倉庫。** 通常你會在 GitHub 上對原專案發送 Pull Request，而不是直接 push 到 upstream。

---

## 如何查看目前的遠端設定？

你可以使用：
```bash
git remote -v
```

可能會看到：
```perl
origin https://github.com/damien/project.git (fetch)
origin https://github.com/damien/project.git (push)
upstream https://github.com/alice/project.git (fetch)
upstream https://github.com/alice/project.git (push)
```
這表示你的本地倉庫同時知道兩個遠端來源。

---

## 為什麼 upstream 很重要？

當你 fork 一個專案後，原作者的專案仍然會持續更新。但你的 fork 並不會自動同步這些更新。因此你需要：
- `upstream` 作為更新來源
- `origin` 作為你的工作與推送位置

這樣的角色分工，可以避免你直接修改原專案，也讓協作流程更清楚。

---

## 如果沒有 fork 呢？

如果你只是單純開發自己的專案，例如：
```bash
git clone https://github.com/damien/my-project.git
```

通常只會有 `origin`。因為沒有「原始專案」的概念，自然也不需要 `upstream`。

所以：
- **fork 專案** → 通常會有 `origin` + `upstream`
- **自己的專案** → 通常只有 `origin`

---

## 最重要的總結

可以把它記成這樣：
```ini
origin = 我的遠端 repo（我可以 push）
upstream = 原始專案 repo（我用來同步更新）
```

更完整地說：
- `origin` 是你實際開發與提交修改的地方
- `upstream` 是你用來追蹤專案最新狀態的來源

只要記住一句話：**origin 是我的舞台，upstream 是專案的源頭。** 這樣就不會再搞混了。
