---
title: 使用 Cookie 與 Session 建立使用者驗證（完整新手教學）
description: 從 HTTP 無狀態特性開始，深入理解 Cookie 與 Session 的分工、登入流程與 Node.js 實作範例，建立完整的使用者驗證心智模型。
tags: [http, cookie, session, authentication, nodejs]
category: web_dev
date: 2026-02-13
---

# 使用 Cookie 與 Session 建立使用者驗證（完整新手教學）

在多數網站中，「登入系統」其實是在解決一個非常核心的問題：**HTTP 本身不會記得使用者是誰**。當你登入後重新整理頁面，網站仍然知道你是誰，這背後並不是 HTTP 幫你記住，而是我們額外設計了一套機制。

要理解登入驗證，我們必須先理解 HTTP 的特性。

---

## 為什麼 HTTP 需要額外的驗證機制？

HTTP（HyperText Transfer Protocol）是一種 **stateless（無狀態）協定**。所謂無狀態，意思是：
- 每一個 request 都是獨立的。
- Server 不會自動記住前一次的請求內容。

舉例來說，當你發送 `GET /profile` 時，Server 並不會知道你是不是剛剛登入成功的那個人。對 Server 而言，這只是一個新的請求。因此，我們需要一種方法來讓 Server 辨認：**這個 request 是來自同一個使用者。**

傳統 Web 應用最常見的做法，就是 **Cookie + Session**。

---

## 先理解 Cookie 與 Session 的分工

很多人會把 Cookie 和 Session 混為一談，但它們其實是兩個不同的角色。

### Cookie：存在瀏覽器的小資料
Cookie 是由 Server 設定，並儲存在瀏覽器中的小型資料。當 Server 回應時，可以送出：
```javascript
Set-Cookie: sessionId=abc123
```
瀏覽器會自動儲存這個 Cookie。之後只要發送同一個網域的請求，瀏覽器就會自動附帶：
```makefile
Cookie: sessionId=abc123
```
也就是說：**Cookie 的責任是「把識別碼帶回 Server」。** 它本身通常不存放敏感資料，而是存放一個 key，例如 `sessionId`。

### Session：存在 Server 的登入狀態
Session 則是存在 Server 端的資料儲存機制。例如在 Server 中有一個 session store：
```css
abc123 → { userId: 42 }
```
當 Server 收到 `sessionId=abc123` 時，就可以查詢這個 session store，找到對應的使用者資訊。

**一句話理解關係：**
- **Cookie** 負責攜帶 sessionId
- **Session** 負責儲存使用者資料

---

## 登入流程完整解析（Login Lifecycle）

現在我們用實際情境，走一遍完整的登入流程。

### Step 1：使用者送出登入表單
瀏覽器發送 `POST /login`，並附帶帳號密碼。

### Step 2：Server 驗證帳密
Server 會查詢資料庫、驗證密碼，並取得對應的 `userId`（例如 42）。

### Step 3：建立 Session
Server 產生一個隨機的 `sessionId`（例如 abc123），並儲存在 Server 的 session store 中：
```css
abc123 → { userId: 42 }
```

### Step 4：Server 設定 Cookie
Server 在 HTTP 回應中加入 `Set-Cookie: sessionId=abc123`。瀏覽器會自動儲存，使用者無須操作。

### Step 5：之後的請求
當使用者訪問 `/profile` 時，瀏覽器會自動附帶 `Cookie: sessionId=abc123`。

### Step 6：Server 查詢 Session
Server 收到請求後，讀取 Cookie 中的 `sessionId`，並查詢 session store 找到 `userId: 42`，從而辨認出使用者身份。

---

## 用一個直覺心智模型理解

你可以把這整件事情想成：
1. 登入成功
2. Server 建立一張「**會員卡**」（session）
3. 把**卡號**（sessionId）放進 Cookie
4. 瀏覽器之後每次都帶著卡號
5. Server 查卡號辨認身份

**重要的是：真正的登入資料在 Server，瀏覽器只負責帶識別碼。**

---

## Node.js 簡化範例（概念示範）

下面用最簡單的方式模擬 Session 概念：

### 登入路由
```js
const sessionStore = {};

app.post("/login", (req, res) => {
  const sessionId = "abc123"; // 實務上會是隨機字串
  sessionStore[sessionId] = {
    userId: 42,
  };
  res.setHeader("Set-Cookie", `sessionId=${sessionId}`);
  res.send("ok");
});
```

### 需要登入的 API
```js
app.get("/profile", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = sessionStore[sessionId];
  
  if (!session) {
    return res.status(401).send("not logged in");
  }
  
  res.send(`userId = ${session.userId}`);
});
```

---

## 安全性設定（非常重要）

實務上 Cookie 通常會加上安全參數，這在開發中不可忽略：
```javascript
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax
```
- **HttpOnly**：避免 JavaScript 讀取 Cookie，降低 XSS 攻擊風險。
- **Secure**：只允許在 HTTPS 加密連線中傳輸。
- **SameSite=Lax**：降低 CSRF 跨站請求偽造的風險。

---

## 總結

Cookie + Session 驗證的核心流程如下：
**Server 建立 Session → 把 sessionId 放進 Cookie → Browser 自動帶回 → Server 查詢 Session**

理解這個流程後，你不只會知道「怎麼登入」，更會知道背後發生了什麼事情。這將幫助你在學習 JWT、OAuth 或其他驗證機制時，更容易理解它們與傳統 Session 的差異。
