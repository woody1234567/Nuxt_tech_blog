---
title: llms.txt 是什麼？在 Nuxt 中控制 AI 與搜尋引擎爬蟲的新方式
description: 認識 llms.txt 的用途與設計理念，了解它如何補足 robots.txt 的不足，並學會在 Nuxt 專案中正確設定與使用。
tags: [seo, nuxt, llms-txt, crawler, ai]
category: web_dev
date: 2026-02-05
---

## llms.txt 是什麼？

> **llms.txt 是一份「給大型語言模型（LLMs）看的網站使用說明」，告訴 AI：哪些內容可以被理解、引用或學習，哪些不行。**

如果說：

- `robots.txt` 是對「搜尋引擎爬蟲」說話
- `sitemap.xml` 是幫搜尋引擎整理地圖

那 **llms.txt 則是專門對 ChatGPT、Claude、Gemini 這類 AI 說話的規範檔案**。

---

## 為什麼 robots.txt 不夠用了？

robots.txt 出現的年代，網站主要的訪客只有兩種：

1. 人類
2. 搜尋引擎爬蟲（Googlebot、Bingbot）

但現在多了一個全新的角色：**大型語言模型（LLMs）**。

這些模型會：

- 讀取你的文章
- 摘要你的內容
- 在回答使用者問題時「引用」你的網站概念
- 甚至間接影響你的品牌與專業形象

問題在於：
**robots.txt 並沒有被設計來處理「內容被 AI 理解與再利用」這件事。**

它只能說「能不能爬」，卻說不清楚：

- 可不可以拿來訓練？
- 可不可以被摘要？
- 可不可以在回答中引用？

---

## llms.txt 想解決的是什麼問題？

llms.txt 的核心目標不是 SEO 排名，而是：

> **讓網站擁有者，重新拿回「內容如何被 AI 使用」的主控權。**

它試圖回答三個關鍵問題：

1. 哪些內容適合被 AI 理解與引用？
2. 哪些內容僅適合人類閱讀？
3. 是否有「官方版本」應該被優先使用？

這個概念，對於教學型部落格、技術文件站、公司官網尤其重要。

---

## llms.txt 的基本形式

llms.txt 是一個**純文字檔**，放在網站根目錄：

```
/llms.txt
```

一個簡化的範例如下：

```
# llms.txt

User-agent: *
Allow: /

Disallow: /admin
Disallow: /drafts

Preferred-Content: /docs
```

這份檔案的語意不是「禁止抓取」，而是：

- 告訴 AI 哪些路徑是正式內容
- 哪些只是內部頁面、草稿或不該被引用的資料

---

## 它和 robots.txt 有什麼根本差異？

理解 llms.txt 最好的方式，是把它和 robots.txt 放在一起看。

robots.txt 的思維是：

> 「你可不可以進來？」

llms.txt 的思維則是：

> 「你進來之後，該怎麼『使用』這些內容？」

因此它更接近：

- 文件授權聲明
- 使用指南
- AI 版的 editorial policy

而不是傳統意義的爬蟲阻擋工具。

---

## 在 Nuxt 專案中該如何使用 llms.txt？

在 Nuxt 中實作 llms.txt 非常單純，本質上就是提供一個靜態檔案。

### 作法一：放在 `public/`

```
public/
 ├─ llms.txt
```

Nuxt build 後，這個檔案會直接對應到：

```
https://your-site.com/llms.txt
```

這是目前最直覺、也最推薦的做法。

---

## 為什麼這對技術教學網站特別重要？

以你正在寫的 Nuxt / 前端教學文章為例，實際上會出現這些情境：

- AI 會總結你的文章概念
- 學生會用 ChatGPT 問「Nuxt SEO 怎麼做？」
- 回答內容其實來自你過去寫的教學

如果沒有任何規範：

- AI 可能引用舊版內容
- 可能混用草稿與正式文章
- 甚至誤解你的教學脈絡

llms.txt 就是在這個時候，**提供一個「官方閱讀順序與範圍」**。

---

## llms.txt 現在就該用嗎？

要誠實說一件事：

> **llms.txt 還不是強制標準，也不是所有 AI 都保證遵守。**

但它和早期的 sitemap、canonical 很像：

- 一開始是「最佳實務」
- 後來才成為「基本配備」

對於內容導向、技術導向的網站來說，現在導入的成本幾乎是零，但潛在價值很高。

---

## 結語

llms.txt 並不是要取代 robots.txt，而是補上它從未被設計去處理的那一塊：**AI 對內容的理解與再利用**。

在 AI 成為「內容中介者」的時代，SEO 不再只是為了搜尋引擎，而是開始同時面對「會閱讀、會轉述、會回答問題的模型」。

理解並使用 llms.txt，本質上是在為你的內容，建立下一個世代的邊界與秩序。

---

## 參考資料

1. Nuxt SEO – Controlling Crawlers with llms.txt
   [https://nuxtseo.com/learn-seo/nuxt/controlling-crawlers/llms-txt](https://nuxtseo.com/learn-seo/nuxt/controlling-crawlers/llms-txt)
