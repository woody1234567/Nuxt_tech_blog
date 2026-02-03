---
title: CSR、SSR 與 SSG 是什麼？前端渲染策略完整比較
description: 一次搞懂 CSR、SSR、SSG 的差異、運作流程與適用情境，幫助你在 Nuxt、Vue 或現代前端專案中選擇最合適的渲染策略。
tags: [csr, ssr, ssg, frontend, nuxt, rendering]
category: web_dev
date: 2026-02-03
---

在現代前端開發中，「畫面是怎麼被產生的？」其實是一個非常核心、卻又容易被忽略的問題。當我們談到 CSR、SSR 與 SSG，本質上就是在討論：**HTML 是在什麼時間點、什麼地方被產生的**。理解這三種渲染策略，會直接影響你對效能、SEO、部署方式，甚至是框架設計（像 Nuxt 為什麼要區分 client / server）的理解。

這篇文章會從「新手能直覺理解」的角度出發，一步步比較 CSR、SSR 與 SSG 的運作流程與適合情境。

---

## 什麼是 CSR（Client-Side Rendering）？

CSR，全名是 Client-Side Rendering，中文通常翻成「客戶端渲染」。這種模式下，**HTML 幾乎是空的殼，真正的畫面是由瀏覽器下載 JavaScript 後才組裝出來的**。

當使用者打開一個 CSR 網站時，伺服器回傳的 HTML 通常只包含一個 root 節點，例如 `<div id="app"></div>`。接著瀏覽器會下載 JavaScript bundle，執行程式碼、建立 DOM、抓取 API 資料，最後才把完整畫面渲染出來。

這也是早期 SPA（Single Page Application）最典型的模式，例如使用 Vue CLI、Vite + Vue 建立的純前端專案。

CSR 的好處在於前後端分離明確，開發體驗單純，部署也非常容易，只要能放靜態檔案即可。但缺點同樣明顯：**初次載入時間較長，搜尋引擎在沒有執行 JavaScript 的情況下，幾乎看不到內容**，因此對 SEO 並不友善。

## ![Image](https://m2z7h8d7.delivery.rocketcdn.me/wp-content/uploads/2023/06/ClientSideRender.jpg%E6%8B%B7%E8%B2%9D.png.webp)

## 什麼是 SSR（Server-Side Rendering）？

SSR，全名是 Server-Side Rendering，也就是「伺服器端渲染」。與 CSR 最大的差別在於：**HTML 是在伺服器上先產生好，再送到瀏覽器的**。

在 SSR 模式下，當使用者請求一個頁面時，伺服器會先執行 JavaScript（例如 Nuxt 的 server renderer），把 Vue 元件轉換成一份「已經有內容的 HTML」。瀏覽器拿到這份 HTML 後，可以立刻顯示畫面，接著再下載 JavaScript 進行 hydration，讓頁面變成可互動的狀態。

這種方式最大的優點是：**首屏顯示速度快，而且搜尋引擎一開始就能讀到完整內容**。因此，對於重視 SEO 的內容型網站、電商首頁或行銷頁面，SSR 是非常常見的選擇。

不過，SSR 的成本也比較高。你需要一個能即時執行 JavaScript 的伺服器環境，每一次請求都可能觸發一次渲染，對效能與架構設計的要求都比 CSR 高得多。

![Image](https://m2z7h8d7.delivery.rocketcdn.me/wp-content/uploads/2023/06/ServerSideRender.jpg%E6%8B%B7%E8%B2%9D.png.webp)

---

## 什麼是 SSG（Static Site Generation）？

SSG，全名是 Static Site Generation，中文常稱為「靜態網站產生」。它可以被視為 SSR 的「預先計算版」。

在 SSG 中，**HTML 不是在使用者請求時才產生，而是在 build 階段就全部產生完成**。也就是說，專案在部署之前，框架（例如 Nuxt、VitePress）會先把所有頁面轉成完整的 HTML 檔案，之後只要直接提供這些靜態檔案給使用者即可。

這讓 SSG 兼具 SEO 與效能優勢：HTML 一打開就有內容，而且因為只是靜態檔案，不需要伺服器運算，載入速度非常快，也非常穩定。這正是為什麼技術文件、教學部落格、官方文件網站，幾乎都偏好 SSG 的原因。

但 SSG 也有其限制。由於內容是在 build 時就固定，如果資料需要頻繁即時更新，或是頁面數量龐大且高度動態，SSG 的 build 成本與更新流程就會變得較不彈性。

![Image](https://www.ionos.co.uk/digitalguide/fileadmin/_processed_/9/9/csm_Static-site-generation-diagram_9412b039b9.webp)

---

## 三種渲染方式的核心差異整理

如果用一句話來總結三者的差異，可以這樣記：

CSR 是「**瀏覽器自己畫畫面**」，
SSR 是「**伺服器即時幫你畫好再送來**」，
SSG 是「**先畫好、存起來，需要時直接拿**」。

從時間點來看，CSR 的 HTML 產生在使用者端、請求之後；SSR 的 HTML 產生在伺服器端、請求當下；SSG 則是在部署前就已經完成。

---

## 在 Nuxt 中為什麼要懂 CSR、SSR、SSG？

你之所以會在 Nuxt 裡看到 `process.client`、`process.server`、`ssr: false`、`nuxi generate` 這些設定，本質上都是因為 **Nuxt 同時支援這三種渲染策略**。

當你使用 Three.js、Canvas、Web Audio 這類「只存在於瀏覽器的 API」時，就會發現它們在 SSR 階段根本不存在，這也是為什麼很多互動式專案最後會選擇純 CSR 或 client-only 的原因。

反過來說，如果你正在做教學文章、部落格或文件網站，SSG 幾乎就是最佳解；而如果你需要動態資料但又不想犧牲 SEO，那 SSR 就會成為折衷但強大的方案。

---

## 結語

CSR、SSR 與 SSG 並沒有誰「比較先進」，它們只是為了解決不同問題而存在的工具。真正重要的不是記住名詞，而是理解：**你的 HTML 是在什麼時候、什麼地方產生的，以及這對使用者與搜尋引擎意味著什麼**。

一旦你掌握了這個核心概念，無論是在 Nuxt、Vue、React 或任何現代前端框架中，渲染策略的選擇都會變得非常清楚。
