---
title: Abstraction Layer 與 Adapter 的差別，一次搞懂設計角色
description: Abstraction layer 與 Adapter 常一起出現卻容易混淆，本文從系統架構與設計模式角度，搭配 Nuxt / Nitro 實例，帶你理解兩者真正的角色分工。
tags: [architecture, design-pattern, abstraction, adapter, nuxt, nitro]
category: web_dev
date: 2026-02-11
---

## 為什麼 abstraction layer 跟 adapter 常被搞混？

在實務開發中，**abstraction layer（抽象層）**與 **adapter（適配器）**幾乎總是一起出現。
也因為它們高度共存，很多人會以為這是「同一件事的不同說法」。

但實際上，它們解決的是**完全不同層級的問題**。

理解這兩者的差別，會直接影響你在：

* 架構系統
* 拆模組
* 設計可維護程式碼

時，做出正確的決策。

---

## 一句話先建立直覺

在進入細節前，先給你一個工程師好記的版本：

> **Abstraction layer（抽象層）定義「要做什麼」**
> **Adapter（適配器）負責「怎麼接上去」**

如果用比喻來說：

```
Abstraction layer = 規格 / 介面
Adapter = 轉接頭
```

這個比喻在後面會反覆出現。

---

## Abstraction layer 是什麼？

抽象層的核心目的只有一個：

> **隱藏底層實作細節，讓上層程式碼只關心「能力」，而不是「怎麼做」**

當你在寫應用程式時，你其實不希望每一層都知道所有底層細節，否則整個系統會變得高度耦合、難以維護。

---

### 一個常見的例子：資料庫操作

假設你在專案中寫的是：

```js
database.query()
database.insert()
database.update()
database.delete()
```

這時候，你的程式碼並沒有在意底層實際使用的是：

* PostgreSQL
* MySQL
* SQLite
* Supabase

你只在乎「我可以查詢、寫入、更新、刪除」。

這一層 **database API**，就是一個典型的 abstraction layer。
它把底層的 SQL driver、連線管理、語法差異全部藏起來。

---

### 作業系統 API 也是抽象層

像這樣的呼叫：

```js
File.open()
```

在不同平台底下，實際執行的可能是：

* Windows 的檔案系統
* Linux 的檔案系統
* macOS 的檔案系統

但對你來說，這些差異並不存在。
你只知道：**我可以開檔案**。

這正是抽象層存在的價值。

---

## Adapter 是什麼？

如果說抽象層是在「畫規格」，那 adapter 就是：

> **真正把抽象層對應到某一個具體系統的實作者**

換句話說，adapter 的工作是：

> **把 A 的介面，轉成 B 能理解的介面**

這也是為什麼 adapter 本身就是一個經典的設計模式：
**Adapter Pattern**。

---

### 一個簡單的 Python 概念例子

假設你定義了一個抽象的儲存介面：

```py
class Storage:
    def save(file):
        pass
```

但你實際上可能有兩種儲存系統：

* 本機檔案系統
* AWS S3

這時候你不會改 abstraction layer，而是寫不同的 adapter：

```py
class LocalAdapter(Storage):
    def save(file):
        writeFile(file)

class S3Adapter(Storage):
    def save(file):
        s3.putObject(file)
```

抽象層不變
更換的只有 adapter

---

## abstraction layer 與 adapter 的關係

這裡是整篇文章最重要的理解點。

抽象層與 adapter 並不是對立，而是**上下游關係**：

```
Application Code
      ↓
Abstraction Layer（定義介面）
      ↓
Adapter（具體實作）
      ↓
Real System / Platform
```

抽象層負責「統一世界觀」
adapter 負責「適應現實世界」

---

## 用硬體來比喻（非常直覺）

如果你覺得抽象概念太抽象，可以直接記這個：

* **Abstraction layer**：USB 標準
* **Adapter**：USB-C → HDMI 轉接器

USB 規格定義了「我能傳資料、影像、電力」
轉接器負責把這個能力，接到不同裝置上

---

## 放回 Nuxt / Nitro 的脈絡中理解

你最近在研究 Nitro，其實這正是一個**教科書等級的案例**。

---

### Nitro 的 abstraction layer

像這些 API：

```js
defineEventHandler()
event.node.req
event.node.res
```

它們讓你寫 server code 時，**不用關心執行環境**。

不管你最後跑在哪裡，你寫的程式碼都是一樣的。

---

### Nitro 的 adapters

Nitro 內部提供多種 adapter，例如：

* Node server adapter
* Vercel adapter
* Cloudflare Workers adapter
* Bun adapter

這些 adapter 的責任是：

> 把 Nitro 的 server 抽象，轉成各平台能執行的形式

也因此你可以做到「程式碼不改，部署環境隨意換」。

---

## 最後總結

如果要用最精準的工程語言來說：

> **Abstraction layer 是設計概念（interface）**
> **Adapter 是實作元件（implementation bridge）**

或更白話一點：

* 抽象層告訴你：**這個系統「能做什麼」**
* 適配器負責處理：**這件事「在這個平台怎麼做」**

一旦你把這個角色分清楚，很多架構上的選擇就會變得非常自然。
