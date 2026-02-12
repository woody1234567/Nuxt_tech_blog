---
title: JWT 驗證機制完整解析：從登入流程到實務應用
description: 深入理解 JWT（JSON Web Token）的運作原理與完整驗證流程，學會如何在 Node.js 與 SPA 架構中實作無狀態身份驗證。
tags: [jwt, authentication, nodejs, security, api]
category: web_dev
date: 2026-02-13
---

# JWT 驗證機制完整解析：從登入流程到實務應用

在現代 Web 應用中，「登入系統」其實是在解決一個非常核心的問題：HTTP 不會記得使用者是誰。當瀏覽器送出每一次請求時，對伺服器而言，那都只是一次全新的 request。HTTP 是一種 stateless（無狀態）協定，它不會自動保存使用者的登入狀態，也不會知道這個請求是否來自同一個人。因此，我們需要一種機制，讓伺服器能夠辨認「這個 request 是哪個使用者發出的」。

在這樣的背景下，JWT（JSON Web Token）成為一種非常常見的解決方案。JWT 是一種標準格式（RFC 7519），用來在雙方之間安全地傳遞資訊，最常見的用途就是身份驗證。理解 JWT 的核心邏輯後，你會發現它其實並不複雜，它只是把「身份資訊」包裝成一個被簽名的憑證。

---

## JWT 的基本結構與概念

JWT 通常長得像這樣：

```text
xxxxx.yyyyy.zzzzz
```

它由三個部分組成：

```css
header.payload.signature
```

- **Header**：主要說明簽名演算法，例如常見的 HS256。
- **Payload**：包含實際資料，例如 userId、角色、過期時間（exp）。
- **Signature**：伺服器使用 secret key 對前兩段資料進行簽名後產生的結果。

這裡最重要的一個觀念是：**JWT 的重點不是加密，而是簽名。** 簽名的作用在於確保資料沒有被竄改。只要 payload 被修改，signature 就會失效。伺服器不需要相信 client 傳來的內容本身，而是透過驗證 signature 來確認這份資料確實是自己簽發的。

---

## 從登入開始看 JWT 的完整生命週期

我們可以從使用者登入的那一刻開始，一步一步走完整個 JWT 的 lifecycle。

當使用者在瀏覽器中輸入帳號密碼，前端會送出一個 HTTP request，例如：

```bash
POST /login
```

Request body 可能長這樣：

```json
{
  "username": "damien",
  "password": "1234"
}
```

伺服器收到這個請求後，會查詢資料庫，驗證密碼是否正確。如果驗證成功，伺服器取得使用者的識別資訊，例如 userId = 42。

接著，伺服器會建立一個 JWT。Payload 可能包含：

```json
{
  "userId": 42,
  "exp": 1730000000
}
```

其中 exp 代表過期時間。然後伺服器使用 secret key 進行簽名，產生最終的 token：

```text
xxxxx.yyyyy.zzzzz
```

這個 token 就是「身份憑證」。

---

## Token 如何在後續請求中發揮作用

當伺服器將 token 回傳給前端後，前端會把它儲存起來。儲存方式可能是 localStorage、cookie 或記憶體。接下來，只要呼叫需要登入權限的 API，前端就會在 HTTP header 中帶上：

```makefile
Authorization: Bearer <token>
```

例如：
```makefile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

當伺服器收到這個 request 時，會做幾件事情：解析 Authorization header、驗證 signature、檢查 exp 是否過期，最後從 payload 中取得 userId。如果所有檢查都通過，這個 request 就會被視為「已登入使用者發出」。

整個流程可以用一句話總結：
**登入成功 → server 簽發 JWT → client 儲存 → request 帶 token → server 驗證 → 辨認使用者。**

---

## 為什麼 JWT 不需要 Session？

在傳統的 session-based 驗證中，伺服器會保存一份 session 狀態，例如把 sessionId 存在記憶體或資料庫中。每次請求都必須查詢 session store，確認這個使用者是否仍然登入。

而 JWT 的特點是：**身份資訊本身就包含在 token 裡面**。伺服器只要驗證 signature，就能信任 payload 的內容。這種方式稱為 **stateless authentication**。

也就是說，伺服器不需要保存登入狀態。每次驗證都是根據 token 本身完成。這讓系統在水平擴展（例如多台 server、microservices 架構）時更加容易，因為不需要共享 session store。

---

## 使用 Node.js 實作 JWT（概念示範）

在 Node.js 中，常見的做法是使用 `jsonwebtoken` 套件來處理簽發與驗證。

建立 token 的方式大致如下：

```js
const jwt = require("jsonwebtoken");
const token = jwt.sign(
  { userId: 42 },
  SECRET,
  { expiresIn: "1h" }
);
```

驗證 token 時則使用：

```js
const payload = jwt.verify(token, SECRET);
```

`verify` 會同時檢查 signature 與過期時間。如果驗證失敗，會直接拋出錯誤。這就是伺服器端保護 API 的核心機制。

---

## JWT 適合哪些應用場景？

JWT 特別常見於 SPA（例如 React、Vue、Nuxt）與 mobile app。由於前後端分離架構中，API 通常是獨立存在的，使用 JWT 可以讓 API server 保持無狀態，減少對 session store 的依賴。

在 microservices 架構中，JWT 也非常實用。因為每個服務都可以自行驗證 token，而不需要集中式 session 管理。這讓系統更容易擴展，也更適合雲端環境。

---

## JWT 的本質與安全觀念

請牢記一句話：
> **JWT 是被 secret key 簽名的身份資料。**

伺服器真正信任的不是 payload，而是 signature。只要 secret key 沒有洩漏，攻擊者就無法偽造合法的 token。

然而，JWT 並不是萬能解法。它仍然需要搭配 HTTPS、防止 XSS、妥善管理 secret key，以及考慮 token 失效與刷新機制（refresh token）等設計。

---

## 結語

JWT 驗證其實非常單純：伺服器簽發 token，客戶端保存 token，之後的每一次請求都帶上它，伺服器再驗證它。只要你理解「簽名」與「無狀態」這兩個核心概念，就真正掌握了 JWT authentication 的本質。

當你在 Nuxt 或其他前端框架中實作登入系統時，只要記得：HTTP 不會記得使用者，而 JWT 是讓伺服器重新辨認使用者的一種方式。
