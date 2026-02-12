---
title: HTTP Request 結構完整解析：從 Request Line 到 Header 一次看懂
description: 透過真實瀏覽器送出的 HTTP Request 範例，逐行拆解每個欄位的意義，建立完整的 HTTP 心智模型。
tags: [http, web, backend, frontend, networking]
category: web_dev
date: 2026-02-12
---

# HTTP Request 結構完整解析：從 Request Line 到 Header 一次看懂

在理解 HTTP 是瀏覽器與伺服器之間溝通的規則後，本篇文章將更進一步，帶你拆解一個「接近真實瀏覽器送出的完整 HTTP Request」，逐段說明每個欄位的意義與存在的理由。

我們會使用瀏覽器（例如 Google Chrome）打開首頁時常見的請求內容作為範例，從上到下完整分析。

---

## 一個較完整的 HTTP Request 範例

以下是一個常見的 HTTP/1.1 GET 請求：

```makefile
GET / HTTP/1.1
Host: example.com
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7
Cookie: sessionId=abc123
```

這就是瀏覽器實際送出的原始文字內容。HTTP 本質上就是一段符合規範格式的純文字協定。我們現在從上到下逐段說明。

---

## 1️⃣ Request Line：請求的起始行

```sql
GET / HTTP/1.1
```

這一行稱為 **Request Line**（請求起始行），格式為：`METHOD + PATH + HTTP VERSION`。

在這個例子中，它的意思是：**使用 GET 方法，對 `/` 這個路徑發出請求，並使用 HTTP/1.1 協定。**

這一行定義了三件非常重要的事情：
- 第一，瀏覽器要做什麼（GET）。
- 第二，目標資源在哪裡（/）。
- 第三，使用哪一個協定版本（HTTP/1.1）。

HTTP 的「行為」本質上就是由這一行決定的。

---

## 2️⃣ Host：目標網站

```makefile
Host: example.com
```

這個 Header 的作用是告訴伺服器：「這個請求是要給哪個網站的」。

在現代環境中，一台伺服器通常會透過 Virtual Hosting 技術同時服務多個網站。如果沒有 Host，伺服器就無法判斷這個請求應該對應哪個網站。在 HTTP/1.1 中，Host 是強制性的欄位。

---

## 3️⃣ Connection：連線策略

```makefile
Connection: keep-alive
```

這個欄位表示：**回應完成後不要關閉 TCP 連線。**

在早期 HTTP/1.0 中，每一次請求都會建立一次 TCP 連線，用完就關閉，效率非常低。HTTP/1.1 預設支援 keep-alive，可以讓後續請求共用同一條連線（例如拿完 HTML 後接著拿 CSS、JS、圖片），大幅降低延遲成本。

---

## 4️⃣ Cache-Control：快取控制

```arduino
Cache-Control: max-age=0
```

這表示：**瀏覽器希望重新驗證這個資源是否為最新版本。**

瀏覽器在控制的是「要不要使用快取」。當 `max-age=0` 出現時，代表即使本地有快取，也要先向伺服器確認是否需要更新。

---

## 5️⃣ Upgrade-Insecure-Requests：安全升級請求

```makefile
Upgrade-Insecure-Requests: 1
```

這表示：**如果資源是 HTTP，請嘗試升級為 HTTPS。**

這是一種安全機制，用來減少混合內容（mixed content）問題，也能避免在安全頁面中載入不安全資源。

---

## 6️⃣ User-Agent：客戶端資訊

```makefile
User-Agent: Mozilla/5.0 (...) Chrome/120.0.0.0
```

這個欄位描述了：
- 瀏覽器類型
- 作業系統
- 裝置資訊

伺服器可能會根據 User-Agent 進行相容性處理、統計分析，或回傳不同版本內容（例如行動版網站）。

---

## 7️⃣ Accept：可接受的回應格式

```bash
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
```

這個欄位表示：**瀏覽器可以接受哪些格式的回應。**

- `text/html` 是最高優先。
- `application/xml;q=0.9` 表示可以接受，但優先度較低（q 代表 quality value）。
- `*/*` 表示任何格式都可以。

---

## 8️⃣ Accept-Encoding：壓縮格式

```makefile
Accept-Encoding: gzip, deflate, br
```

這表示：**瀏覽器可以接受壓縮過的資料。**

如果伺服器支援，可能會回傳 `Content-Encoding: gzip`。這會讓傳輸量大幅降低，提高整體效能。現代網站幾乎都會啟用壓縮。

---

## 9️⃣ Accept-Language：語言偏好

```makefile
Accept-Language: zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7
```

這表示語言優先順序為：繁體中文 → 中文 → 美式英文 → 英文。伺服器可以依此決定回傳哪個語言版本的內容。

---

## 🔟 Cookie：狀態資料

```makefile
Cookie: sessionId=abc123
```

這是 HTTP 中非常關鍵的一個欄位。因為 HTTP 本身是 **stateless（無狀態）** 的協定，每一次請求彼此獨立。Cookie 的存在，是為了讓伺服器能辨識使用者（例如登入狀態、購物車內容）。

---

## HTTP Request 的完整結構

實際上，一個 HTTP Request 結構如下：

```css
Request Line
Headers
(空行)
Body（可選）
```

例如一個帶有 Body 的 POST 請求：

```pgsql
POST /login HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 18

{"user":"damien"}
```

**請注意：Header 與 Body 之間一定要有一個空行。** 這是 HTTP 規範明確要求的分隔方式。

---

## 建立一個清晰的 HTTP 心智模型

你可以把一個 HTTP Request 想成四個層次：

1. **動作（Method）**：WHAT to do
2. **目標（Path + Host）**：WHERE to go
3. **附加資訊（Headers）**：META info
4. **實際資料（Body）**：DATA

也就是：**WHAT → WHERE → META → DATA**

---

## 一句話總結

一個完整的 HTTP Request，其實就是在對伺服器說：
> **我要對某個資源做某件事，並附帶一些環境資訊與資料。**

只要你把 Request Line、Header 與 Body 的角色區分清楚，HTTP 就會從「神祕的網路黑盒子」，變成一段有邏輯、有結構的純文字溝通格式。
