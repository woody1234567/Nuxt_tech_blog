---
title: RESTful API 設計原則與實務解析
description: 深入理解 RESTful API 的核心概念、五大設計原則與實務範例，建立正確的 API 架構思維。
tags: [restful, api, http, backend, web]
category: web_dev
date: 2026-02-12
---

# RESTful API 設計原則與實務解析

RESTful API 是現代 Web 系統中最常見的一種 API 設計風格（architecture style）。無論你是使用 Vue、Nuxt 建立前端，或是用 Node、Python 開發後端，幾乎都會與 RESTful API 互動。理解 REST 的設計思想，會直接影響你未來如何設計後端服務、如何規劃資料結構，甚至影響整體系統的可維護性。

REST 並不是一種框架，也不是一種技術或語言，而是一組 **設計原則**。這個概念最早由 Roy Fielding 在 2000 年的博士論文中提出，完整名稱為 Representational State Transfer。REST 描述的是一種如何利用 HTTP 來設計分散式系統的方式，而 RESTful API 則是遵循這套設計原則所實作出來的 API。

---

## RESTful API 是什麼？

一句話理解：

> **RESTful API = 用「HTTP + 資源（resource）」來設計 API**

也就是說：
*   API 的核心是 **資源（resource）**
*   使用 **HTTP 方法**（GET / POST / PUT / DELETE）操作資源
*   而不是設計一堆「動詞式 API」。

---

## RESTful 的核心概念

### 1️⃣ Resource（資源）

在 REST 的世界裡，一切都是「資源」。使用者是資源、文章是資源、訂單是資源、商品也是資源。API 設計的核心，不是「我要做什麼動作」，而是「我要操作哪個資源」。

資源通常用 **名詞** 表示，而不是動詞。

例如：
*   `/users`
*   `/posts`
*   `/orders`

而不是：
*   `/getUsers`
*   `/createUser`
*   `/deleteUser`

### 2️⃣ HTTP Method = 操作資源

RESTful API 的核心精神是：**用 HTTP 動詞操作資源**。

| HTTP 方法 | 用途 | 範例 |
| :--- | :--- | :--- |
| **GET** | 取得資料 | `GET /users` |
| **POST** | 新增資料 | `POST /users` |
| **PUT** | 更新資料 | `PUT /users/1` |
| **DELETE** | 刪除資料 | `DELETE /users/1` |

### 3️⃣ URL 代表資源位置

例如：
*   `GET /users` 代表：**取得所有使用者**
*   `GET /users/5` 代表：**取得 ID = 5 的使用者**

URL 描述的是「資源」，不是「行為」。

---

## RESTful API 實務範例：部落格系統

假設我們設計一個簡單的文章 API。

**取得文章列表**
```bash
GET /posts
```
回傳：
```json
[
  { "id": 1, "title": "Hello REST" }
]
```

**新增文章**
```bash
POST /posts
```
Request Body：
```json
{ "title": "New Post" }
```

**更新文章**
```bash
PUT /posts/1
```

**刪除文章**
```bash
DELETE /posts/1
```

---

## RESTful 的 5 個重要設計原則

這部分是「真正的 REST 精神」。

### 1️⃣ Client–Server 分離
前端與後端分離。
*   **Client**：Vue / Nuxt（負責 UI 與體驗）
*   **Server**：Node / Python（負責資料與邏輯）

這點其實跟你現在做的 Nuxt + API 架構很一致。這種分離讓系統更容易擴展與維護。

### 2️⃣ Stateless（無狀態）
每個 request 必須包含完整資訊。Server 不應該記住 client 的狀態。

例如：
```makefile
Authorization: Bearer <token>
```
Server 只根據這次請求做判斷，而不是依賴先前的請求狀態。這種設計讓系統更容易擴展，因為任何一台伺服器都能處理請求，不需要共享 session。

### 3️⃣ Cacheable（可快取）
HTTP response 可以被 cache。良好的 API 設計會利用 HTTP headers：
*   `Cache-Control`
*   `ETag`

如果設計良好，API 回應可以被瀏覽器或 CDN 快取，大幅降低伺服器負載。

### 4️⃣ Uniform Interface（統一介面）
這是 REST 最重要的一點：
*   **URL 表示資源**
*   **HTTP method 表示操作**
*   使用標準 HTTP status code（200, 201, 400, 404）
*   使用統一資料格式（通常是 JSON）

一致的介面設計，讓 API 可預測、可理解，也更容易被第三方整合。

### 5️⃣ Layered System（分層）
Client 不需要知道請求最終由哪一層處理。中間可能包含：
*   API server
*   Proxy
*   Load Balancer
*   Microservices

Client 只知道「我打到某個 URL」，但實際處理可能經過多層架構。這種分層讓系統更容易擴展與重構。

---

## RESTful vs 傳統 API

**傳統 RPC 風格 API** (偏動詞)
```bash
POST /createUser
POST /deleteUser
POST /updateUser
```
這種設計強調「動作」，比較像在呼叫函式。

**RESTful API** (偏資源)
```bash
POST /users
DELETE /users/1
PUT /users/1
```
這種方式強調「資源」。當 API 數量變多時，資源導向的設計更容易維持一致性，也更容易讓其他開發者理解。

---

## 一句話總結

RESTful API 的本質是：

> **用 HTTP 方法操作資源，並讓 URL 表示資源位置。**

當你理解 REST 是一種「架構思想」，而不是一種「技術規格」時，你就會開始用更系統化的方式設計 API。這對於建立可維護、可擴展的系統架構至關重要。
