---
title: Secret Key 簽名是什麼？從零理解資料簽名的本質
description: 不用先懂 JWT，也能理解 secret key 簽名在做什麼。帶你從問題出發，掌握資料完整性與驗證機制的核心原理。
tags: [security, jwt, hmac, backend, web]
category: web_dev
date: 2026-02-13
---

# Secret Key 簽名是什麼？從零理解資料簽名的本質

在 Web 開發中，我們經常會把資料交給使用者，例如登入後的身分資訊、權限資訊、或某些狀態資料。但有一個根本問題必須先釐清：

> **如果資料被使用者改掉，伺服器要怎麼知道？**

假設 Server 傳給 Client 一段資料：
```json
{
  "userId": 42
}
```

Server 的要求其實很單純：你可以讀這份資料，但不能修改它。

然而，HTTP 是一種可被攔截與修改的通訊形式。只要資料回到 Client 端，理論上都可能被竄改。那麼 Server 要如何判斷這份資料是否還是「原本那一份」？這個問題的答案，就是「**簽名（Signing）**」。

---

## 簽名到底在做什麼？

簽名的核心概念非常單純：

> **用「資料 + 只有 Server 知道的 Secret Key」產生一段不可偽造的指紋。**

這段指紋通常是透過一種單向運算產生，例如雜湊函式（Hash Function）。常見的做法是使用 **HMAC**（Hash-based Message Authentication Code）。

概念上可以寫成：
```ini
signature = hash(data + secret)
```

- **data**：你要保護的資料。
- **secret**：只有 Server 知道的密鑰。
- **hash**：單向運算（無法反推出原始資料）。

最後會得到一段固定長度的字串，例如：`a8f9c2d1e4b7...`。這段字串，就是「**簽名**」。

---

## 簽名的完整流程

我們用一個簡化版本的流程來看整個運作方式。

### Step 1：Server 建立資料
```json
data = { "userId": 42 }
```

### Step 2：Server 用 Secret 產生簽名
```ini
secret = "my-secret"
signature = hash(data + secret)
```

### Step 3：Server 傳送資料 + 簽名
Client 最終會拿到：`{ "userId": 42 } + signature`。此時 Client 可以看到資料內容，但無法偽造簽名。

---

## 驗證機制如何運作？

當 Client 把資料送回 Server 時，Server 會做一件事：**重新計算簽名**。

```ini
signature2 = hash(data + secret)
```

然後比較：
```ini
signature2 === 原本的 signature ?
```

- **如果一致**：代表資料沒有被修改。
- **如果不一致**：代表資料被竄改。

這整個過程稱為「**驗證簽名（Verification）**」。

---

## 為什麼攻擊者無法偽造？

關鍵就在於 **Secret Key**。

假設攻擊者把 `userId: 42` 改成 `userId: 1`。他想重新產生簽名，但他不知道 Secret，他只能算：`hash(data + ???)`。

因為缺少 Secret，無法得到正確的簽名。Server 一驗證就會發現不一致。這種機制確保了資料的「**完整性（Integrity）**」。

---

## 簽名不是加密

很多人會混淆「加密（Encryption）」與「簽名（Signing）」：
- 簽名的目的不是為了隱藏資料或讓資料看不懂。
- 簽名的目的是為了**確保資料沒有被修改**。

也就是說，簽名解決的是「完整性」，不是「機密性」。資料本身可以是公開的，但只要簽名正確，Server 就能信任這份資料。

---

## JWT 裡的 Secret Key 簽名

在 **JWT（JSON Web Token）** 中，簽名機制正是使用這個原理。JWT 的結構是：`header.payload.signature`。

前兩段（Header + Payload）是資料本身。第三段（Signature）是這樣產生的：
```bash
signature = HMACSHA256( 
  base64(header) + "." + base64(payload), 
  SECRET_KEY 
)
```

常見演算法就是 **HMAC-SHA256**。JWT 的安全性並不是來自 Payload 本身（它是 Base64 編碼，任何人都能解碼），而是來自 **Signature**。

> **Server 不相信 Payload，而是相信 Signature。**

---

## Node.js 實作範例

使用 `jsonwebtoken` 套件時：

### 建立簽名
```js
jwt.sign({ userId: 42 }, SECRET);
```

### 驗證簽名
```js
jwt.verify(token, SECRET);
```

這兩行背後的本質，就是 `hash(data + secret)` 的計算與比對。

---

## 一個直覺的心智模型

你可以把 Secret Key 簽名想成：**Server 用一個只有自己知道的印章，在資料上蓋章。**

任何人都可以看到資料內容，但只有 Server 能蓋出真正的印章。如果資料被動過，印章就對不上。

---

## 最重要的總結

Secret Key 簽名的本質只有一件事：**用 Secret 產生不可偽造的資料指紋，讓 Server 能驗證資料是否被修改。**

在 JWT 中：
- **Header + Payload** 是資料。
- **Signature** 是指紋。
- **Secret** 是印章。

只要理解這三個角色，你就真正理解了「簽名到底在做什麼」。
