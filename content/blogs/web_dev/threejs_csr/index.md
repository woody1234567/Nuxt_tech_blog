---
title: 為什麼 Three.js 專案幾乎都選擇 CSR？從 SSR 問題談起
description: 從 Three.js 的運作原理出發，說明為什麼高度互動、基於 Canvas/WebGL 的應用不適合 SSR，以及為何純 CSR 或 client-only 會是更合理的選擇。
tags: [threejs, csr, ssr, nuxt, frontend, webgl]
category: web_dev
date: 2026-02-03
---

在學習 Three.js 或將它整合進 Nuxt、Vue 專案時，很多人都會遇到同一個問題：**為什麼一開啟 SSR，專案就開始報錯？**
錯誤訊息可能是 `window is not defined`、`document is not defined`，或是在 hydration 階段直接整個畫面炸掉。

這並不是你寫錯程式，而是 **Three.js 的性質，天生就與 SSR 不相容**。這篇文章會一步步說明原因，並解釋為什麼大多數 Three.js 專案最後都選擇純 CSR 或 client-only 的架構。

---

## 先釐清一件事：SSR 並不是在瀏覽器執行

理解這個問題的第一步，是要先打破一個常見誤解：
**SSR（Server-Side Rendering）不是在瀏覽器跑的 JavaScript。**

在 SSR 階段，JavaScript 執行的環境是：

- Node.js（或其他 server runtime）
- 沒有視窗
- 沒有 DOM
- 沒有 `<canvas>`
- 沒有顯示畫面

換句話說，SSR 的世界是一個「純後端環境」，它的任務只有一個：**產生 HTML 字串，然後回傳給瀏覽器**。

---

## Three.js 的核心前提：它一定要在瀏覽器

Three.js 是一個用來操作 3D 圖形的函式庫，而它的整個設計基礎，建立在以下幾件事情上：

- 透過 `<canvas>` 作為繪圖容器
- 使用 WebGL 進行 GPU 繪製
- 依賴瀏覽器提供的 DOM 與視窗環境

也就是說，Three.js 假設了一件事：

> **「現在執行程式的地方，是一個真的有畫面、有瀏覽器的環境。」**

但這個假設，在 SSR 階段並不成立。

---

## 為什麼 Three.js 在 SSR 階段會直接壞掉？

我們用最直覺的方式來看。

在 Three.js 中，你幾乎一定會寫到類似下面的程式碼：

```js
const canvas = document.querySelector("canvas");
```

或是：

```js
const renderer = new THREE.WebGLRenderer();
```

這些程式碼背後都隱含了一個前提：
**`document`、`canvas`、`WebGLRenderingContext` 必須存在。**

但在 SSR 階段：

```text
window ❌
document ❌
canvas ❌
WebGL ❌
```

於是問題就出現了——
**不是 Three.js 寫錯，而是執行環境根本不支援它。**

這也是為什麼你會在 SSR 專案中看到這類錯誤：

- `ReferenceError: window is not defined`
- `document is not defined`
- hydration mismatch
- dev server 直接 crash

---

## 即使「不報錯」，SSR 對 Three.js 也沒有實際意義

假設你花了很多力氣，用條件判斷避免 SSR 報錯，例如：

```js
if (process.client) {
  // Three.js code
}
```

這樣確實可以讓程式「不炸掉」，但問題來了：

> **就算 SSR 階段沒執行 Three.js，它也「什麼都沒做」。**

因為 SSR 的目的，是產生「可顯示內容的 HTML」。
但 Three.js 的畫面：

- 不是文字
- 不是靜態結構
- 而是即時渲染的圖形結果

也就是說，在 SSR 階段：

- 無法預先產生 Three.js 的畫面
- 無法輸出有意義的 HTML
- 最終還是得等瀏覽器載入後才開始渲染

既然如此，SSR 在這裡就只剩下「增加複雜度」，而沒有實質好處。

---

## 為什麼純 CSR / client-only 反而是合理選擇？

對於 Three.js 專案來說，核心價值通常是：

- 3D 即時渲染
- 動畫與互動
- 滑鼠、鍵盤、觸控操作
- requestAnimationFrame 的高頻更新

這些行為有一個共同點：
**它們只在瀏覽器中才有意義。**

選擇純 CSR 或 client-only，可以帶來幾個非常實際的好處：

1. 不需要處理 SSR 與 client 環境差異
2. 不會遇到 hydration 問題
3. 可以放心使用瀏覽器 API
4. 架構更單純、除錯成本更低

因此在實務上，你會發現：

> **展示型、互動型、模擬型的 Three.js 專案，幾乎清一色是 CSR。**

---

## 在 Nuxt 中，這不是缺點，而是正確使用方式

很多初學者會以為：

> 「關掉 SSR，是不是代表專案比較不專業？」

但實際上剛好相反。

Nuxt 提供 `ssr: false`、`<ClientOnly>`、`process.client` 這些工具，**本來就是為了處理「只適合在瀏覽器執行的應用」**。

Three.js 正是這類應用的典型代表。

只要你的專案核心是 3D 互動，而不是 SEO 導向的內容頁面，那麼選擇 CSR：

- 不是妥協
- 而是符合技術本質的設計決策

---

## 結語

Three.js 不適合 SSR，並不是因為它「不夠好」，而是因為 **SSR 的世界裡，根本不存在它所需要的環境**。
當一個應用的核心價值來自即時互動與視覺渲染，與其勉強套用 SSR，不如誠實地選擇純 CSR 或 client-only。

記住這個判斷原則會很有幫助：

> **內容導向 → SSR / SSG
> 互動導向 → CSR / client-only**

理解這一點，你在 Nuxt 中使用 Three.js，反而會變得非常順。
