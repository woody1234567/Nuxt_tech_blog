---
title: Service Worker Request Flow 深入解析
description: 從請求流程圖到實戰策略，完整理解 Service Worker 如何攔截請求、操作快取並打造離線優先的 PWA 體驗。
tags: [pwa, service-worker, cache, web-performance, frontend]
category: web_dev
date: 2026-02-13
---

# Service Worker Request Flow 深入解析

在現代 Web 開發中，只要談到 **PWA（Progressive Web App）**，幾乎一定會提到 **Service Worker (SW)**。但很多人對它的理解停留在「可以離線使用」這句話，卻不清楚它真正的 Request Flow 到底是怎麼運作的。

這篇文章會用「流程圖 + 實際情境 + 實作策略」帶你理解 Service Worker 的請求生命週期。只要理解這一篇，你就會真正掌握 SW 的核心機制。

---

## Service Worker 在瀏覽器中的位置

在介紹流程之前，我們先釐清一件重要的事情：

> **Service Worker 不是伺服器，而是瀏覽器裡的一層「攔截代理」。**

當使用者打開網站時，請求流程其實會變成：
`Page → Service Worker → (Cache 或 Server)`

它就像是瀏覽器內建的一個 Proxy，可以在 Request 送到 Server 之前先攔截並決定怎麼處理。它的架構位置如下：

```text
Browser Page
    │
    ▼
Service Worker
    │
┌───┴────────────┐
│                │
Cache API     Fetch API
│                │
▼                ▼
Cache          Server
```

---

## 整體 Request Flow 圖解

當使用者開啟網站時，核心工作流程如下：

```text
使用者開啟網頁
      ↓
Browser Page
      ↓
HTTP request
      ↓
Service Worker（攔截）
      ↓
┌───────────────┬───────────────┐
│  Cache 有資料  │  Cache 沒資料  │
│  (cache hit)  │  (cache miss) │
└───────┬───────┴───────┬───────┘
        ↓               ↓
    回傳 cache    向 server 發 request
        ↓               ↓
    Page 收到資料    Server 回應
                        ↓
                     回傳 Page
                        ↓
                  （可選）寫入 cache
```

---

## 實際情境：載入 index.html

假設你打開：`https://mysite.com`

### Step 1：Page 發出 request
瀏覽器發出請求：`GET /index.html`。如果沒有 SW，請求會直接送往 Server。

### Step 2：Service Worker 攔截請求
只要 SW 已經註冊並啟用，所有請求都會先進到 SW。
```js
self.addEventListener("fetch", (event) => {
  console.log("intercepted:", event.request.url)
})
```

### Step 3：檢查 Cache
SW 會決定如何回應，通常會檢查 `caches.match(event.request)`。

#### 情況一：Cache Hit（有快取）
流程：`Page → SW → Cache → Page`
結果：不需要網路、回應極快、支援離線。這就是 **Offline-first** 行為。

#### 情況二：Cache Miss（沒有快取）
流程：`Page → SW → Server → SW → Page`
這時 SW 就像透明代理一樣，將請求轉發給 Server。

---

## 真正關鍵：快取策略（Caching Strategy）

Service Worker 的 Request Flow 取決於你使用的策略。以下是實務上最常見的三種模式：

### 1. Cache First（離線優先）
- **流程**：Page ↓ SW ↓ Cache? → (Yes: 回傳) / (No: Server → Cache → Page)
- **適合**：靜態資源、投影片、教學網站、SPA build 後的 assets。
- **實作**：
```js
event.respondWith(
  caches.match(event.request).then((res) => {
    return res || fetch(event.request)
  })
)
```

### 2. Network First（最新資料優先）
- **流程**：Page ↓ SW ↓ Server → (Success: Page + Cache) / (Fail: Cache → Page)
- **適合**：API 動態資料、使用者內容。優先確保資料新鮮度。
- **實作**：
```js
event.respondWith(
  fetch(event.request)
    .then((res) => res)
    .catch(() => caches.match(event.request))
)
```

### 3. Stale While Revalidate（最常用）
- **流程**：Page ↓ SW ↓ Cache → 立即回應，同時 Server → 背景更新 Cache。
- **特色**：兼顧速度與新鮮度。使用者先拿到舊資料，背景偷偷更新。
- **實作**：
```js
event.respondWith(
  caches.match(event.request).then((res) => {
    const fetchPromise = fetch(event.request).then((networkRes) => {
      caches.open("v1").then((cache) => {
        cache.put(event.request, networkRes.clone())
      })
      return networkRes
    })
    return res || fetchPromise
  })
)
```

---

## 一個很多人會誤解的重點

Service Worker **並不是替代 Server**。它的角色是多了一層「控制權」，讓你可以決定何時使用快取、何時打 API、何時離線回應以及何時背景更新。理解這層代理機制，你就真正掌握了 SW。

---

## 結語

Service Worker 的核心其實只有一句話：**攔截請求，決定回應來源。**

只要你理解了這個 Request Flow，未來在設計 PWA、優化效能或部署 SPA 時，就能有清晰的架構思維，而不只是「照框架設定」。
