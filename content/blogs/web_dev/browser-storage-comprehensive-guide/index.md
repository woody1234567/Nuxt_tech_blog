---
title: 瀏覽器儲存空間完整解析：Cookie、localStorage、IndexedDB 到 Cache Storage
description: 一次搞懂瀏覽器五種常見儲存方式的差異、容量限制、生命週期與實務使用場景，建立清晰的前端儲存心智模型。
tags: [browser, cookie, localstorage, indexeddb, pwa, frontend]
category: web_dev
date: 2026-02-13
---

# 瀏覽器儲存空間完整解析：Cookie、localStorage、IndexedDB 到 Cache Storage

在現代前端開發中，「資料要存在哪裡？」其實是一個非常關鍵的設計問題。瀏覽器提供了多種儲存機制，它們看起來都可以存資料，但在容量、生命週期、是否自動送到 server，以及設計目的上都有本質差異。

如果沒有建立清楚的心智模型，很容易出現錯誤的使用方式，例如把大量 JSON 存進 Cookie，或把登入憑證隨便丟進 localStorage。這篇文章會幫你建立一個完整的架構理解：從整體分類出發，再逐一深入每一種儲存機制的特性與實務用途。

---

## 瀏覽器儲存空間的整體心智模型

你可以把瀏覽器中的儲存空間分成兩大類：

1.  **會參與 HTTP 溝通的儲存**：也就是 Cookie。
2.  **純前端本地儲存**：包含 localStorage、sessionStorage、IndexedDB 以及 Cache Storage。

最重要的區別只有一個問題：**這份資料會不會隨著 HTTP request 自動送到 server？**

**只有 Cookie 會。其他全部都不會。** 這個差異，會直接影響效能、安全性與設計選擇。

為了幫助你建立直覺印象，可以用這樣的比喻理解：
- **Cookie**：是會寄給 server 的小紙條。
- **localStorage**：是瀏覽器的記事本。
- **sessionStorage**：是分頁專用記事本。
- **IndexedDB**：是瀏覽器內建資料庫。
- **Cache Storage**：是資源快取倉庫。

---

## 1️⃣ Cookie：唯一會自動送到 Server 的儲存方式

Cookie 是瀏覽器最早出現的儲存機制，也是唯一會自動隨 HTTP request 一起送到 server 的資料。當 server 回應時設定 `Set-Cookie`，瀏覽器會儲存這份資料。之後每次發送同網域請求時，都會自動附帶 `Cookie` header。

這就是為什麼 Cookie 常被用來保存登入狀態。其核心特性在於容量非常小（大約 4KB），而且每一次 request 都會被送出。如果你在 Cookie 中放入大量資料，會直接拖慢所有請求的效能。

此外，Cookie 還可以設定：
- **過期時間**（Expires / Max-Age）
- **HttpOnly**（避免被 JavaScript 讀取）
- **Secure**（只在 HTTPS 傳送）
- **SameSite**（控制跨站請求行為）

---

## 2️⃣ localStorage：最常見的前端儲存方式

localStorage 是瀏覽器提供的 key-value 儲存空間，存在於使用者本機，不會自動送到 server。

它的特點包括：
- **不會參與 HTTP 傳輸**
- **關閉瀏覽器後仍然存在**（永久儲存，除非手動清除）
- **容量約 5–10MB**
- **同一個 domain 可以共用**

例如，亮／暗模式切換（Dark Mode）的偏好設定存入 localStorage 是最典型的場景。需注意 localStorage 只能儲存字串，存取 JSON 須經 `JSON.stringify()` 與 `JSON.parse()` 轉換。

---

## 3️⃣ sessionStorage：分頁等級的暫存空間

sessionStorage 和 localStorage 的 API 幾乎完全相同，但生命週期不同。

最大的差別是：**當該分頁（tab）關閉時，sessionStorage 會立即消失。** 而且每個分頁的 sessionStorage 是獨立的，彼此不共享。這種特性使它非常適合暫存多步驟流程中的狀態，例如表單填寫進度或臨時 UI 狀態。

---

## 4️⃣ IndexedDB：真正的瀏覽器資料庫

如果 localStorage 是記事本，那 IndexedDB 就是完整資料庫。它支援儲存結構化資料，不只字串，還可以存 JSON、Blob、圖片、檔案等大量資料。

IndexedDB 的特性：
- **容量很大**（可達數百 MB，依瀏覽器而定）
- **非同步 API**（不阻塞 UI 渲染）
- **支援索引與查詢**
- **不會自動送到 server**

由於它支援大量資料與查詢功能，因此常用於離線應用、文件儲存、或 PWA 的離線資料存取。

---

## 5️⃣ Cache Storage：Service Worker 的資源倉庫

Cache Storage 通常會與 Service Worker 一起出現。它的用途不是儲存任意資料，而是儲存 **HTTP response**。它的設計目的只有一個：**快取網站資源，支援離線存取。**

在 PWA 架構中，Service Worker 會攔截 request，優先從 Cache Storage 讀取資源（HTML, CSS, JS, 圖片等），若沒有再向 server 請求。

---

## 工程師必須記住的四個關鍵差異

1.  **傳輸**：只有 Cookie 會自動送到 server。
2.  **容量**：Cookie < localStorage < IndexedDB。
3.  **生命週期**：sessionStorage 隨分頁關閉消失，其他通常為永久儲存（Cookie 可設定）。
4.  **型態**：只有 IndexedDB 支援真正的結構化與二進位資料。

---

## 實務選擇指南

- **登入 session / Server 驗證** → 使用 Cookie。
- **UI 設定 / 使用者偏好** → 使用 localStorage。
- **分頁暫存流程 / 臨時狀態** → 使用 sessionStorage。
- **大量離線資料 / 複雜結構** → 使用 IndexedDB。
- **PWA 快取資源 / 離線資源** → 使用 Cache Storage。

---

## 結語

瀏覽器提供多種儲存機制，不是為了讓你隨意選擇，而是針對不同層級的需求設計。理解它們的核心差異，能讓你的架構更清晰，也能避免效能與安全問題。只要明確了資料的使用對象、生命週期、容量需求，就能選出最正確的儲存方式。
