---
title: 深入理解 Nuxt 的 .nuxt 與 .output：為什麼部署時一定要分清楚？
description: 很多人在部署 Nuxt 時卡關，其實問題不在伺服器，而是沒搞清楚 .nuxt 與 .output 的角色差異。本文從用途、產生時機與部署觀點，完整解析這兩個資料夾。
tags: [nuxt, nitro, deployment, build, frontend]
category: web_dev
date: 2026-02-11
---

## 為什麼 `.nuxt` 與 `.output` 是理解 Nuxt 架構的關鍵？

在實務上，**很多 Nuxt 部署問題，其實都不是環境或指令錯誤**，而是對 Nuxt 產物的理解不夠清楚。
最常見的狀況，就是搞混了下面這兩個資料夾：

```
.nuxt
.output
```

如果你沒分清楚它們的用途，就很容易發生像是：

* 不知道該把哪個資料夾丟到伺服器
* 誤以為 `.nuxt` 就是 build 結果
* 刪錯 `.output`，導致正式站無法啟動

這篇文章會用「用途、產生時機、能不能部署」三個角度，幫你一次把觀念釐清。

---

## 一句話先抓住核心差別

在 Nuxt 專案中，這兩個資料夾的角色非常明確：

```
.nuxt    = 開發與編譯過程中的暫存資料夾
.output  = production 環境實際部署的產物
```

只要記住這一句，後面九成的部署問題都會自然消失。

---

## `.nuxt` 是什麼？

`.nuxt` 是 **Nuxt 在開發與建置過程中，自動產生的內部編譯目錄**。

當你在專案中執行：

```bash
nuxi dev
```

Nuxt 就會建立一個 `.nuxt/` 資料夾，作為整個開發流程的工作空間。

---

## `.nuxt` 裡面實際放了哪些東西？

一個常見的 `.nuxt` 結構會長得像這樣：

```
.nuxt/
 ├── components.d.ts
 ├── imports.d.ts
 ├── app.config.mjs
 ├── dist/
 └── nitro/
```

這裡面包含的並不是「你要部署的檔案」，而是 Nuxt 在運作時需要的中介資料，例如：

* 自動 import 的對應表
* components 註冊資訊
* 型別宣告（TypeScript）
* virtual modules
* dev 模式用的 runtime metadata
* 開發期間產生的暫時 build 結果

---

## `.nuxt` 的本質是什麼？

你可以把 `.nuxt` 想成：

> Nuxt 自己使用的「工作目錄」

它的角色其實就跟其他框架的暫存資料夾一樣，例如：

```
.next                  (Next.js)
node_modules/.vite     (Vite)
dist-temp
```

這些資料夾都有一個共通點：
**它們是框架用來工作的，不是給你部署的。**

---

## 為什麼 `.nuxt` 不該被 commit 或部署？

`.nuxt` 有幾個非常重要的特性：

首先，它是 **可被重建的產物**。
只要你的原始碼存在，Nuxt 就能隨時重新產生 `.nuxt`。

因此，`.nuxt` 通常都會被加進 `.gitignore`：

```
.nuxt
```

再來，它並不是 production build。
即使你在 build 階段看到 `.nuxt` 被使用，那也只是中途站，並不是最終結果。

**結論很簡單：`.nuxt` 不能、也不該被拿來部署。**

---

## `.output` 是什麼？

`.output` 則完全是另一個層級的存在。

它是 **Nuxt 在 production build 完成後，產生的最終部署產物**。

這個資料夾只會在你執行以下指令時出現：

```bash
nuxi build
```

---

## `.output` 的實際結構

一個標準的 `.output` 目錄通常會長這樣：

```
.output/
 ├── public/
 │    └── _nuxt/
 └── server/
      ├── index.mjs
      └── chunks/
```

這個結構本身，就已經在暗示它的用途。

---

## `.output/public` 在做什麼？

`.output/public` 裡面放的是：

> 給瀏覽器下載的前端資源

也就是：

* JavaScript bundle
* CSS
* 圖片與靜態資源
* Vite build 後的產物

這些檔案會被伺服器直接送給使用者的瀏覽器。

---

## `.output/server` 是真正的 Nitro Server

`.output/server` 則是 **Nitro 在 production 模式下產生的伺服器程式碼**。

其中最重要的一個檔案是：

```
index.mjs
```

這個檔案本身就是一個完整可執行的 server entry，你可以直接在 VPS 上這樣跑：

```bash
node .output/server/index.mjs
```

這也是為什麼 Nuxt 能夠被部署到 VPS、Serverless、Edge 平台的關鍵。

---

## 用工程師角度對照兩者差異

| 項目           | `.nuxt`     | `.output`          |
| ------------ | ----------- | ------------------ |
| 主要用途         | 開發與編譯暫存     | production 部署      |
| 產生時機         | dev / build | build              |
| 是否可部署        | ❌           | ✅                  |
| 是否建議 commit  | ❌           | 視部署策略              |
| 前端 bundle    | 不完整         | 完整                 |
| Nitro server | dev runtime | production runtime |

---

## Nuxt 真實的 build pipeline

理解這個流程非常重要：

```
Nuxt 專案原始碼
     ↓
產生 .nuxt（內部編譯資料）
     ↓
Vite build + Nitro build
     ↓
.output（最終部署產物）
```

也就是說：

```
.nuxt 是過程
.output 是結果
```

---

## 一個最好記的心法

如果你只想記一句話：

```
.nuxt   = build workspace
.output = deploy artifact
```

---

## 回到實際部署情境（VPS / Zeabur / Nitro）

在你目前的使用情境中：

* 使用 VPS
* 自行跑 Nitro server
* Nuxt production 環境

你真正需要的，只有這個資料夾：

```
.output
```

`.nuxt` 完全不需要，也不該出現在正式環境。

---

## 一個最小可行的部署範例

在伺服器上，你實際會做的事情通常只有兩步：

```bash
nuxi build
node .output/server/index.mjs
```

---

## 新手最常犯的三個錯誤

第一個錯誤，是把 `.nuxt` 當成 build 完成的結果。
第二個錯誤，是把 `.nuxt` 上傳到 server。
第三個錯誤，是以為 `.output` 只是暫存資料而刪掉它。

只要你能避開這三點，Nuxt 部署的難度會直接下降一個等級。

---

## 結語

`.nuxt` 與 `.output` 的差別，並不是「資料夾名稱不同」這麼簡單，而是 **Nuxt 架構設計的核心分工**。

當你真正理解：

* 哪些是框架的工作資料
* 哪些是你要負責部署的產物

很多原本看起來很神祕的部署問題，其實都會迎刃而解。
