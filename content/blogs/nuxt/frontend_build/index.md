---
title: Nuxt 前端 build 流程完整解析
description: 深入理解 Nuxt 在 build 階段如何將 Vue 與 TypeScript 程式碼轉換為瀏覽器可執行的前端資源，從掃描、編譯、打包到最佳化一次搞懂。
tags: [nuxt, vite, frontend, build, vue]
category: web_dev
date: 2026-02-10
---

> **前端 build 的本質，是把「給人看的程式碼」轉成「給瀏覽器執行的檔案」。**

---

## Nuxt 的前端建置到底在做什麼？

當你在專案中執行：

```bash
nuxi build
```

Nuxt 會啟動一個「正式環境的前端建置流程」，背後是由 Vite 的 production build 負責實作。這個流程不是單一步驟，而是一連串轉換與最佳化。

整體來看，可以先用下面這個流程理解：

```
.vue / .ts / CSS / images
        ↓
編譯與最佳化
        ↓
瀏覽器可執行的 JS + CSS + assets
        ↓
.output/public/_nuxt
```

接下來我們逐步拆解這條流水線。

---

## Step 1：掃描整個前端專案，建立依賴關係

建置一開始，Nuxt 並不是立刻「打包」，而是先理解你的前端世界長什麼樣子。它會掃描所有**有可能進入瀏覽器的程式碼與資源**，例如：

```
app.vue
pages/*
components/*
composables/*
plugins/*
assets/*
```

如果你有像下面這樣的檔案結構：

```
pages/index.vue
components/NavBar.vue
composables/useUser.ts
```

Nuxt 會依照「頁面 → 元件 → composable → 其他依賴」的方式，建立一棵完整的前端依賴樹。
這一步的目的不是輸出檔案，而是**確認哪些程式碼會真的影響使用者畫面**。

---

## Step 2：把 `.vue` 檔轉成瀏覽器能理解的 JavaScript

`.vue` 檔對開發者很友善，但瀏覽器其實完全不認得 `<template>`、`<script setup>` 這些語法。

例如你寫：

```vue
<template>
  <h1>Hello</h1>
</template>

<script setup>
const msg = "Nuxt"
</script>
```

在 build 過程中，Vue compiler 會把 template 轉換成一個「渲染用的 JavaScript 函式」，概念上會接近：

```js
render() {
  return h("h1", "Hello")
}
```

這一步的關鍵在於：
**畫面不再是 HTML 描述，而是 JavaScript 在「產生 DOM 結構」**。

這個過程稱為 **Single File Component（SFC）編譯**，也是 Vue 能高度動態化的核心原因。

---

## Step 3：TypeScript 只負責開發期，build 時一定會被移除

如果你在專案中使用 TypeScript，例如：

```ts
const user: string = "Damien"
```

這段型別資訊對開發工具非常重要，但對瀏覽器來說毫無意義。
因此在 build 階段，所有 TypeScript 都會被轉成純 JavaScript：

```js
const user = "Damien"
```

這一步可以理解成：
**TypeScript 是寫給你和編輯器看的，不是寫給瀏覽器看的。**

---

## Step 4：把模組關係打包成實際可載入的檔案

在開發模式中，你可能會寫很多 import：

```js
import { ref } from "vue"
import Chart from "chart.js"
```

在 dev mode 下，這些模組可以由瀏覽器動態請求。但在 production 環境，如果每一個模組都單獨請求，效能會非常差。

因此 build 時會進行 **bundling**，把多個模組整理成較少、結構清楚的檔案，例如：

```
app.js
vendor.js
chunk-xxx.js
```

這樣做的目的很單純：
**減少網路請求次數，讓第一次載入更快、更穩定。**

---

## Step 5：自動進行 Code Splitting 與 Lazy Loading

前端效能最佳化的一個核心概念是：
**不要一次把整個網站的程式碼都送給使用者。**

假設你有兩個頁面：

```
pages/index.vue
pages/about.vue
```

build 後，它們會被拆成不同的 chunk，例如：

```
index.[hash].js
about.[hash].js
```

使用者進首頁時只會下載 index 相關程式碼，真正進到 about 頁面時才載入 about 的 chunk。
這種「用到才載」的策略，就是 **lazy loading**。

---

## Step 6：CSS 也會被重新整理與最佳化

CSS 並不是原封不動地搬過去。像是：

```
assets/main.css
```

在 build 後會變成：

```
style.[hash].css
```

同時會進行多項處理，包括合併樣式、移除未使用的 CSS（tree-shaking），以及壓縮檔案大小。
最終目的只有一個：**讓畫面樣式下載更快、體積更小。**

---

## Step 7：靜態資源會被重新命名，確保快取安全

如果你在專案中使用圖片：

```
assets/logo.png
```

build 後可能會變成：

```
logo.a8sd9f.png
```

這種帶 hash 的檔名不是亂取的，而是為了解決瀏覽器快取問題。
只要內容改變，檔名就會改，瀏覽器就一定會重新下載，這個策略稱為 **cache busting**。

---

## Step 8：程式碼壓縮（Minify）

在正式環境中，可讀性不再重要，檔案大小才是重點。
例如：

```js
function add(a, b) {
  return a + b
}
```

會被壓縮成：

```js
function add(a,b){return a+b}
```

這一步不改變邏輯，只是**讓傳輸量更小、下載更快**。

---

## Step 9：所有前端產物輸出到 `.output/public/_nuxt`

完成以上所有步驟後，Nuxt 會把前端產物輸出到：

```
.output/public/_nuxt
```

裡面會看到類似：

```
.output/public/_nuxt/
 ├── app.a83hd.js
 ├── vendor.9dd2.js
 ├── index.83j2.js
 └── style.css
```

這些檔案，就是瀏覽器實際下載、執行的內容。

---

## 把整個前端 build 流程再看一次

如果用一條線來總結：

```
.vue / ts / css
        ↓
Vue compiler
        ↓
TypeScript → JavaScript
        ↓
Vite bundling
        ↓
code splitting
        ↓
minify
        ↓
.output/public/_nuxt
```

---

## 一個一定要建立的核心理解

前端 build 做的事情，其實只有一件：

> **把「適合人類開發的程式碼」，轉成「適合瀏覽器執行的檔案」。**

所以你會看到這樣的對照關係：

| 開發時        | build 後            |
| ---------- | ------------------ |
| `.vue`     | render function JS |
| TypeScript | JavaScript         |
| 多個模組       | bundle / chunk     |
| 原始 CSS     | 壓縮後 CSS            |
| 原始檔名       | hash 檔名            |

---

## 為什麼這些事情不在 dev mode 做？

因為目標不同。

開發模式追求的是「即時、好改、好除錯」，而 build 追求的是「效能、體積、穩定性」。
因此 dev 使用的是即時編譯的開發伺服器，而 build 則產出一套不可變的正式檔案。

---

## 用一個生活化的比喻收尾

開發模式就像在廚房備料、試味道、邊煮邊調整。
build 則是把菜色固定下來，裝盒、封膜，準備送出去。

`.output/public/_nuxt`，就是那個外送盒裡真正交到客人手上的食物。

