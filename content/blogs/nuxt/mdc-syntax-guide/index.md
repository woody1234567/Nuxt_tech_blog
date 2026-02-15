---
title: Nuxt Content 中的 MDC Syntax 深入解析
description: 了解 Nuxt Content 的 MDC Syntax 如何讓 Markdown 擁有 Vue 組件能力，並學會在教學部落格中整合動態元件。
tags: [nuxt, nuxt-content, mdc, markdown, vue]
category: nuxt
date: 2026-02-15
---

# Nuxt Content 中的 MDC Syntax 深入解析

在使用 Nuxt 建立教學型網站時，很多人會選擇搭配 Content 模組來撰寫文章。這樣的好處是可以用 Markdown 管理內容，同時保有 Vue 與 Nuxt 的動態能力。而當你開始希望「文章中能插入 Vue 元件」時，就會遇到一個關鍵概念：MDC Syntax。

這篇文章會帶你理解什麼是 MDC、它解決什麼問題，以及如何在 Nuxt Content 中實際使用它。

---

## 為什麼 Markdown 不夠用？

Markdown 的設計目標是簡單、可讀、可維護。它非常適合寫文件與教學文章，例如：

```md
# 標題
這是一段文字。
- 列點一
- 列點二
```

但問題來了。當你想在文章中加入：
- 自訂提示框（Alert）
- 動態互動元件
- Tabs 切換
- Vue Chart 圖表
- 可折疊區塊

純 Markdown 是做不到的。你會需要 HTML，甚至 Vue 組件。如果你直接在 Markdown 中插入 Vue component，標準 Markdown 解析器其實無法理解。這時候，MDC 就登場了。

---

## 什麼是 MDC？

**MDC** 是 **Markdown Components** 的縮寫，是由 Nuxt 團隊設計，並整合在 Nuxt 生態系中的語法擴充機制。

簡單來說：
> **MDC = 讓 Markdown 可以使用 Vue Component**

它並不是取代 Markdown，而是「擴充 Markdown 的能力」，讓你在 `.md` 檔案中寫 Vue component，並且可以傳遞 props。這個能力主要由 Nuxt Content 與 Nuxt MDC 模組提供支援。

---

## MDC 解決了什麼問題？

如果你正在建立技術教學部落格，你很可能會希望：
1.  文章結構清晰（Markdown）
2.  版型可客製（Vue）
3.  可插入互動元件（Component）
4.  可控制 SEO metadata

傳統作法會變成：
- 純 Markdown → 不夠彈性
- 全部改寫成 Vue SFC → 失去 Markdown 可讀性

MDC 則提供一個折衷解法：**內容仍然是 Markdown，但可以嵌入 Vue 元件**。這讓內容與版型真正分離，同時又保有高度擴充性。

---

## MDC 的基本語法

在 Nuxt Content 中，你可以這樣使用 Vue 元件：

```md
::Alert
這是一段提示文字
::
```

如果 `Alert.vue` 已經存在於 `components/` 目錄中，MDC 會自動解析並渲染成 Vue component。你也可以傳入 props：

```md
::Alert{type="warning"}
請注意這個設定
::
```

這段 Markdown 在編譯時會轉換成：
```vue
<Alert type="warning"> 請注意這個設定 </Alert>
```

---

## Inline Component 語法

除了區塊元件，MDC 也支援 inline component：

```md
這是一個 :Badge{label="NEW"}。
```

這會轉換為：
```vue
<Badge label="NEW" />
```

這在寫教學文章時非常實用，例如在標題旁加入版本標記、插入小型 icon 或 tooltip。這種語法比直接寫 HTML 更乾淨，也更符合 Vue 的使用方式。

---

## MDC 背後發生了什麼？

當 Nuxt Content 讀取 Markdown 檔案時，會透過 MDC parser 進行擴充解析。整體流程大致如下：
1.  讀取 `.md` 檔案
2.  經過 Markdown parser
3.  經過 MDC 擴充解析
4.  轉換為 Vue render function
5.  交由 Nuxt runtime 渲染

這代表 **MDC 不是在瀏覽器執行，而是在 build / server 階段被編譯**。因此它不會影響 client-side performance，這對 SEO 與 SSR 來說非常重要。

---

## MDC 與 Content 的關係

在使用 Nuxt Content v2 之後，MDC 是內建整合的。如果你在 Nuxt 專案中安裝 Content：

```bash
npx nuxi module add content
```

MDC 功能通常會自動啟用。若你單獨想使用 MDC，也可以安裝：

```bash
npx nuxi module add mdc
```

---

## 實務應用場景

以技術教學部落格為例，MDC 可以讓你建立：
- `Callout.vue` 提示框
- `CodeGroup.vue` 多語言程式碼切換
- `Demo.vue` 互動範例
- `YouTubeEmbed.vue` 嵌入影片

而文章仍然保持 Markdown 的可維護性。例如：
```md
::Demo{src="/demos/dom-example"}
::
```
這種做法非常適合技術教學網站，因為你可以把「內容」與「展示邏輯」完全分離。

---

## 結論

MDC Syntax 是 Nuxt 生態系中一個非常重要但常被忽略的能力。它讓 Markdown 不再只是靜態文件格式，而是能與 Vue component 無縫整合的內容語言。對於想用 Nuxt Content 建立技術教學網站的人來說，MDC 幾乎是必學工具。

---

## 參考資料
- [Nuxt Content 官方文件 — MDC Syntax](https://content.nuxt.com/docs/files/markdown#mdc-syntax)
- [Nuxt MDC Module 官方頁面](https://nuxt.com/modules/mdc)
