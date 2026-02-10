---
title: Nuxt 4 全面理解 — 專案檔案結構解析
description: 了解 Nuxt 4 框架的核心目錄與檔案規劃，掌握專案結構的設計理念，提升開發效率與架構清晰度。
tags: [Nuxt, Vue, frontend, web_dev]
category: nuxt
date: 2026-02-10
---

# Nuxt 4 全面理解 — 專案檔案結構解析

## Nuxt 4 為什麼重視檔案結構

Nuxt 是基於 Vue.js 的完整堆疊（full-stack）框架，目的在於提升開發體驗和網站效能，使你可以**從一開始就把精力放在寫 `.vue` 文件、設計頁面與功能上，而不是花很多時間管理路由、SSR 設定或檔案引用**。Nuxt 使用「**約定優於設定**（convention over configuration）」的設計理念，讓開發者只要依照預設結構建立檔案，Nuxt 就能自動處理路由、引用與編譯等工作。

這種方式的核心，在於**一致且直覺的檔案結構可以大幅減少專案複雜度**，提供更快的上手速度與更好的維護性。因此理解 Nuxt 的目錄規劃，是每一位 Nuxt 開發者必備的基礎功。以下我們從最重要的幾個目錄開始解析。

---

## 專案根目錄（Root Directory）

當你建立一個 Nuxt 4 專案後，資料夾的根目錄通常會包含如下檔案：

```bash
nuxt.config.ts
package.json
tsconfig.json
app/
content/
server/
```

其中最核心的一個檔案就是 `nuxt.config.ts`。這是 Nuxt 的全域設定中樞，你可以在這裡設定應用行為、註冊模組、調整 SSR/SPA 模式、加入第三方插件等。無論是預設值還是客製化設定，都可以透過這個檔案進行調整。

---

## app/ 目錄 — 應用主要區塊

Nuxt 4 的一個重要變化是：大多數前端相關的內容都放在 `app/` 這個目錄之下。這個設計讓前端和後端邏輯更清楚地分離。

典型的目錄結構如下：

```bash
app/
├─ assets/
├─ components/
├─ composables/
├─ layouts/
├─ middleware/
├─ pages/
├─ plugins/
└─ utils/
```

### 🧰 assets/ — 靜態資產
這個資料夾放置像是樣式檔（CSS/SCSS）、圖片、字體等資源。Nuxt 會讓構建工具（例如 Vite）處理這些素材，以便它們可以高效地加入到網站中。

### 📦 components/ — Vue 元件
所有可重複使用的 Vue 元件都放在 `components/` 下。Nuxt 支援自動匯入（auto-import），**你不需要手動 import 就能在頁面或其他組件中直接使用**。

例如：
```text
components/
├─ BaseButton.vue
├─ Card.vue
└─ form/
   └─ InputField.vue
```
可以在任何頁面直接使用 `<BaseButton />`、`<Card />`，元件命名會根據檔案夾層級自動生成。

---

### 📄 pages/ — 基於檔案路由
Nuxt 最有名的功能之一就是「檔案路由」：只要你在 `pages/` 下建立 `.vue` 檔案，Nuxt 就會自動根據檔案結構生成對應的路由。例如：

```text
pages/
├─ index.vue -> /
├─ about.vue -> /about
└─ blog/
   └─ [id].vue -> /blog/:id
```
這讓你不需要手動定義路由設定，大幅提升開發效率。

---

### 🎨 layouts/ — 佈局模板
`layouts` 目錄用來定義頁面佈局，像是網站的全域 header/footer 結構。若頁面沒有特別指定佈局，Nuxt 會使用預設的 `default.vue`。

例如：
```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>
```
在這裡，`<NuxtPage />` 是頁面內容的插槽，而 header/footer 則包覆應用所有頁面 UI 樣板。

---

### ⚙️ middleware/ — 導航中介邏輯
這裡可以放置在頁面導航之前執行的邏輯，例如權限判斷、頁面拦截等。Nuxt 會依照文件名稱自動把 middleware 掛載到對應頁面。這種設計讓跨頁邏輯的管理變得更簡潔。

---

### 🔌 plugins/ — 第三方插件與擴充
當你需要在 Vue 或 Nuxt 初始化階段注入插件時，例如全域元件或外部庫，這些設定就放在 `plugins/` 目錄下。Nuxt 會自動偵測並在建構時註冊。

---

### 🧠 composables/ & utils/ — 共享函式
- **composables/**：放置可重用的 Vue composition 函式。
- **utils/**：放置一般的工具函式，像是 helper、純邏輯函式等。

這兩類目錄通常自動被 Nuxt 註冊，所以你可以直接在頁面或組件用而不需手動匯入。

---

## server/ 目錄 — 伺服器端 API 與處理

除了前端資源外，Nuxt 也支援後端 API 直接在專案內撰寫。`server/` 目錄用來存放後端路由與伺服器處理程式：

```bash
server/
├─ api/
│  └─ hello.ts -> 對應 /api/hello
├─ middleware/
│  └─ auth.ts
└─ routes/
```
在這裡建立的 API 檔案會被 Nuxt 自動識別並註冊為伺服器端路由，使你可以在前端透過 fetch 或 useFetch 輕鬆呼叫。

---

## content/ 目錄 — 內容管理系統

如果你安裝了 Nuxt Content 模組，`content/` 目錄會被 Nuxt 用來讀取 `.md`、`.yml`、`.json` 等檔案，讓你可以**建立一個基於檔案的 CMS（內容管理系統）**。例如撰寫文章、API 文檔等內容。

你可以透過內建元件將 Markdown 文件渲染在頁面中，並進行查詢和導航。

---

## 其他重要目錄

Nuxt 還會在開發過程中產生一些「自動生成的位置」：
- **.nuxt/**：在開發模式下生成的中間構建目錄，不需加入版本控制。
- **.output/**：在編譯為生產環境後生成的最終輸出結果，可以部署到伺服器或靜態主機環境。

---

## 結語

Nuxt 4 架構強調「**由檔案而生的路由與設定**」，只要依照官方建議架構書寫資料夾與檔案，就能讓開發過程更直覺、更具維護性。理解各個目錄的用途，將使你能夠更有效地規劃專案、快速開發並提高可讀性。

隨著 Nuxt 的自動匯入、自動路由、自動 SSR 等特性，你可以把開發重心放在功能與效能上，而不是繁瑣的配置細節。希望這篇整理能讓你建立一個清晰的 Nuxt 4 專案架構觀念。

---

## 參考資料
- [Nuxt 官方 — Introduction（Nuxt v4）](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Nuxt 官方 — Directory Structure（Nuxt v4）](https://nuxt.com/docs/4.x/directory-structure)
- [Nuxt 官方 — Components 目錄說明](https://nuxt.com/docs/4.x/directory-structure/app/components)
- [Nuxt 官方 — Content 模組與 content/ 目錄](https://nuxt.com/docs/4.x/directory-structure/content)
- [Nuxt 官方 — .nuxt 生成目錄說明](https://nuxt.com/docs/4.x/directory-structure/nuxt)
