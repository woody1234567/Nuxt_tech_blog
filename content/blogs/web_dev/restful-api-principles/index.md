---
title: RESTful API 五大設計原則深入解析
description: 從 REST constraints 出發，理解 RESTful API 為何這樣設計，以及每個原則在實務開發中的意義與常見錯誤。
tags: [rest, api, backend, architecture, http]
category: web_dev
date: 2026-02-12
---

# RESTful API 五大設計原則深入解析

在討論 RESTful API 時，我們常聽到「五項設計原則」或「REST constraints」。這些原則並不是隨意訂出來的規則，而是由 **Roy Fielding** 在其博士論文中提出，用來描述一種適合 Web 架構的系統設計風格。

理解這五個原則的關鍵，不是背起來，而是知道：

> **每一個 constraint 都在解決「可擴充性、可維護性、效能或一致性」的問題。**

以下我會用「解決什麼問題 → 怎麼做 → 實務例子與常見坑」的方式，帶你真正看懂 RESTful 的設計思維。

---

## 1️⃣ Client–Server（前後端分離）

### 它在解決什麼問題？
Web 系統會不斷演進。如果畫面與資料處理混在一起，每次改動都會牽一髮動全身。Client–Server constraint 的核心目的，是 **讓使用者介面與資料邏輯解耦**。

這樣的好處是：
- 前端可以改框架（Vue → React）
- 後端可以換語言（Node → Go）
- API 只要合約不變，雙方都能獨立演進

這正是現代 SPA + API 架構（例如 Nuxt + REST API）的基礎。

### 怎麼做？
- Client 只負責 UI 與發送 HTTP request
- Server 只負責資料存取與業務規則
- 雙方透過清楚的 API schema 溝通（JSON 格式）

例如：
```bash
GET /api/posts
```
前端只知道這個 endpoint 會回傳 JSON，不需要知道背後是單體架構還是微服務。

### 常見坑
- Server 回傳 HTML 片段給 SPA（畫面邏輯回流）
- API 沒有版本管理，導致 client 被迫同步修改
- request/response 格式頻繁變動，沒有穩定合約

---

## 2️⃣ Stateless（無狀態）

### 它在解決什麼問題？
Stateless 的核心目標是：
> **讓每個 request 都可以被「任何一台伺服器」處理。**

如果 server 把使用者狀態存在記憶體裡，當你擴充成多台機器時，就會出現 sticky session 問題，負載平衡變得困難。

### 怎麼做？
每個 request 都要帶齊資訊，例如：
```sql
GET /orders
Authorization: Bearer <token>
```
Server 不需要記住你是誰，每次都從 token 驗證身份。
狀態如果需要保存，應該：
- 放在資料庫
- 放在 Redis
- 或由 client 持有（例如 JWT）

### 常見坑
- 使用 server memory 存 session
- 設計流程式 API（必須先呼叫 A 才能呼叫 B，中間靠 server 記狀態）
- 認為 Stateless 等於「系統不能有狀態」

特別釐清：Stateless 不代表沒有狀態，而是 **不要把狀態綁在單一伺服器記憶體上**。

---

## 3️⃣ Cacheable（可快取）

### 它在解決什麼問題？
Web 的流量與效能瓶頸，很多來自於重複請求。Cacheable constraint 的目的是：
- 減少伺服器負擔
- 降低延遲
- 降低成本
讓 CDN、proxy、browser 幫你分擔壓力。

### 怎麼做？
對適合快取的回應設定：
```arduino
Cache-Control: public, max-age=60
ETag: "abc123"
```
並支援條件式請求：
```sql
If-None-Match: "abc123"
```
當資源未改變時，回傳：
```mathematica
304 Not Modified
```

### 實務例子
- `/posts` 公開文章列表 → 可快取
- `/me` 使用者個資 → `private, no-store`

### 常見坑
- 完全沒設定 cache header
- 將含個資的資料設為 `public`
- POST/PUT 後沒有處理 cache 失效策略

---

## 4️⃣ Uniform Interface（統一介面）——REST 的核心

在五個 constraint 中，Uniform Interface 是最核心的一個。它讓 API 具有一致性與可預測性。

### (a) Resource-based（以資源為中心）
URL 用名詞，而不是動詞：
```bash
/users
/posts/1
```
行為交給 HTTP method：

| Method | 意義 |
| :--- | :--- |
| GET | 讀取 |
| POST | 新增 |
| PUT | 完整更新 |
| PATCH | 部分更新 |
| DELETE | 刪除 |

### (b) Representation（資源的表徵）
Client 操作的是資源的「表示」，通常是 JSON：
```bash
Accept: application/json
```
同一資源可以有不同表示（例如 JSON、CSV）。

### (c) Self-descriptive messages（自我描述訊息）
Response 必須清楚：
- 正確的 HTTP status code
- 明確的 Content-Type
- 一致的錯誤格式

例如驗證失敗應回：
```bash
401 Unauthorized
```
而不是 200 + 錯誤字串。

### (d) HATEOAS（超媒體作為應用狀態引擎）
Response 可以包含相關連結：
```json
{
  "id": 1,
  "title": "Post",
  "links": {
    "self": "/posts/1",
    "delete": "/posts/1"
  }
}
```
讓 client 透過連結探索流程，而不是寫死路徑。雖然很多 API 沒完全實作，但核心概念是：**API 應該引導 client，而不是讓 client 硬編碼流程**。

---

## 5️⃣ Layered System（分層系統）

### 它在解決什麼問題？
讓系統可以在 client 不知情的情況下插入中介層，提升安全性、可擴充性與可維護性。例如：
- CDN
- API Gateway
- Load Balancer
- WAF

### 架構例子
```css
Client ↓ CDN ↓ API Gateway ↓ Service A / Service B ↓ Database
```
Client 只知道一個入口。

### 常見坑
- Client 直接依賴內部服務位址
- Response 缺少必要 header，導致中介層無法正確快取

---

## 一個實用的 REST 檢查清單

設計 API 時，可以快速問自己：
1. URL 是名詞資源嗎？
2. GET 是否無副作用？
3. 每個 request 是否獨立完整？
4. Status code 是否正確？
5. 是否能在前面加 CDN 而不改 client？

---

## 小結

REST 並不是「用 JSON + HTTP method」這麼簡單，而是一套為了 **可擴充性與長期演進** 設計的架構風格。五個 constraint 彼此配合，讓系統能「活得更久」。

---

## 參考資料
- Roy Fielding, *Architectural Styles and the Design of Network-based Software Architectures*, Doctoral Dissertation, 2000.
