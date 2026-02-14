---
title: Nuxt 中 dev、build、preview 的差異一次搞懂
description: 從實際開發與部署流程出發，深入理解 nuxi dev、nuxi build 與 nuxi preview 在 Nuxt 中各自扮演的角色，以及它們背後的 runtime 差異。
tags: [nuxt, nitro, vite, deploy, ssr]
category: frontend
date: 2026-02-11
---

## Nuxt dev、build、preview 的整體心智圖

在 Nuxt 專案中，你幾乎每天都會用到 `dev`，但真正要部署時，`build` 與 `preview` 才是關鍵角色。先用一張簡化的心智圖來建立整體概念：

```
開發模式        建置           模擬 production
nuxi dev   →   nuxi build   →   nuxi preview
```

三個指令其實對應的是三個**完全不同的階段與 runtime**。

| 指令      | 用途   | 是否建置 | 是否 production |
| ------- | ---- | ---- | ------------- |
| dev     | 開發   | ❌    | ❌             |
| build   | 編譯專案 | ✅    | ❌             |
| preview | 模擬部署 | 已建置  | ✅             |

理解這張表，後面很多部署問題都會自然消失。

---

## 1️⃣ nuxi dev（開發模式）

這是你在本地端最常使用的指令：

```bash
nuxi dev
```

或是透過 package.json：

```bash
npm run dev
```

在這個模式下，Nuxt 實際啟動的是：

```
Vite dev server + Nuxt dev runtime
```

也就是一個**專為開發體驗設計的環境**。

### dev 模式的核心特性

在 `dev` 模式中，Nuxt 會刻意犧牲效能，來換取開發速度與即時回饋：

* 支援 HMR（Hot Module Replacement）
* 不進行 minify 或最佳化
* 不產生 `.output` 資料夾
* 所有 build 都發生在記憶體中
* 並非 production runtime

這代表它**從設計上就不是拿來部署的**。

---

### dev 模式實際在做什麼？

當你打開瀏覽器：

```
http://localhost:3000
```

你連到的其實是：

```
Vite dev server 即時編譯後的結果
```

每當你存檔一次：

```
只重新編譯被修改的檔案
```

而不是整個專案。
這正是 dev 模式「快」的來源，但也因此它與 production 行為並不完全一致。

---

## 2️⃣ nuxi build（建置）

當你準備要部署時，第一步一定是：

```bash
nuxi build
```

這個指令的職責只有一件事：

> **編譯專案，產生 production 用的檔案**

它本身**不會啟動任何 server**。

### build 階段實際發生的事情

在 build 過程中，Nuxt 會完成兩個主要任務：

```
前端 bundle（由 Vite 處理）
Server runtime（由 Nitro 編譯）
```

最後產出一個標準的 `.output` 目錄：

```
.output
 ├── public      # client-side assets
 └── server      # Nitro server entry
```

---

### build 的正確心智模型

`nuxi build` 本質上就像：

```
TypeScript compile
Docker build
```

它只是**準備好可以執行的產物**，但本身不負責「跑起來」。

---

## 3️⃣ nuxi preview（production 模擬）

當 `.output` 已經存在後，你可以執行：

```bash
nuxi preview
```

這一步會：

> 使用 `.output` 啟動 production server

在概念上，它幾乎等同於：

```bash
node .output/server/index.mjs
```

也就是直接啟動：

```
Nitro production server
```

這一點非常關鍵。

---

## preview 與 dev 的本質差異

很多人會誤以為 preview 只是另一種 dev，但實際上兩者完全不同。

### dev 使用的是

```
Vite dev server
```

### preview 使用的是

```
Nitro production server
```

這代表：

* SSR 行為不同
* Routing 行為不同
* API runtime 不同
* 效能特性不同

preview 才是真正貼近「部署後」的狀態。

---

## 一個實際的工程師日常流程

在實務上，你的工作流程通常會長這樣：

```
撰寫功能
↓
nuxi dev
↓
確認畫面與互動
↓
nuxi build
↓
nuxi preview
↓
正式部署
```

如果你省略 `preview`，等於是**直接在 production 環境測試**。

---

## 三者差異快速記憶法

### 直覺版

```
dev      = 即時開發環境
build    = 編譯
preview  = 模擬 production
```

### 技術版

| 功能                | dev         | build | preview            |
| ----------------- | ----------- | ----- | ------------------ |
| Vite dev server   | ✅           | ❌     | ❌                  |
| Nitro server      | dev runtime | build | production runtime |
| HMR               | ✅           | ❌     | ❌                  |
| minify            | ❌           | ✅     | 已完成                |
| .output           | ❌           | ✅     | 使用                 |
| SSR production 行為 | ❌           | ❌     | ✅                  |

---

## 最常見的三個誤解

### 誤解一：preview = dev

不是。
preview 啟動的是 **production server**。

---

### 誤解二：build 會啟動網站

不會。
build 只負責產生 `.output`。

---

### 誤解三：preview 可有可無

事實上它非常重要。
preview 可以讓你在本機驗證：

```
production SSR
production routing
production API
```

這些都是 dev 模式無法完整模擬的。

---

## 一個直覺的比喻

如果把 Nuxt 專案想成一本書：

```
dev     → 寫稿
build   → 排版印刷
preview → 看印刷樣本
deploy  → 正式出版
```

你不會直接把草稿拿去賣，Nuxt 也是一樣的道理。

---

## 回到你的實際情境（部署到 VPS / Zeabur）

你最近的環境包含：

* VPS
* Zeabur
* Nuxt deploy
* Nitro server

正確流程應該是：

```
nuxi build
node .output/server/index.mjs
```

而不是在 server 上執行：

```
nuxi dev
```

這也是為什麼 production 環境下**不應該看到 HMR 或 Vite 的痕跡**。

---

## 結語

理解 `dev`、`build` 與 `preview` 的差異，本質上是在理解 **Nuxt 的三種 runtime**。
只要心智模型建立正確，部署、SSR 問題與效能落差，幾乎都能迎刃而解。

---

## 參考資料

1. Nuxt 官方文件 — Commands Overview
   [https://nuxt.com/docs/getting-started/commands](https://nuxt.com/docs/getting-started/commands)

2. Nuxt 官方文件 — Deployment & Nitro
   [https://nuxt.com/docs/guide/deploy](https://nuxt.com/docs/guide/deploy)

3. Nitro 官方文件
   [https://nitro.unjs.io/](https://nitro.unjs.io/)


