---
title: Server-Sent Events (SSE) 深入解析與實作教學
description: 從原理到實戰，完整理解 SSE 的運作機制、資料格式與 Node.js 實作方式，並學會何時選擇 SSE 而非 WebSocket。
tags: [sse, http, nodejs, realtime, backend]
category: web_dev
date: 2026-02-12
---

# Server-Sent Events (SSE) 深入解析與實作教學

## 為什麼我們需要 SSE？

在設計即時系統時，我們通常會遇到一個問題：**資料更新要如何從伺服器傳到瀏覽器？**

最傳統的方式是一般 HTTP request-response 模型。Client 發出請求，Server 回傳資料，連線隨即關閉。這種模式非常適合取得靜態資料，例如讀取文章、登入、送出表單等等。但它有一個根本限制：**Server 不能主動推送資料**，只能等 Client 發問。

為了解決這個問題，有人會使用 polling（輪詢）。例如每秒向伺服器請求一次狀態更新：

```js
setInterval(() => fetch("/status"), 1000)
```

這種方式雖然可以達到「看起來即時」的效果，但本質上仍然是重複發送請求。它會浪費頻寬、增加伺服器負擔，而且更新頻率越高，資源消耗越大。

當應用場景需要「伺服器主動推送資料」時，就會出現兩種主流選擇：WebSocket 與 SSE。而當資料流是單向（Server → Client）時，SSE 往往是一個更簡潔的方案。

---

## 什麼是 SSE？

**SSE** 是 **Server-Sent Events** 的縮寫。顧名思義，它是一種讓伺服器持續向瀏覽器傳送事件資料的機制。

一句話理解：
> **SSE = 伺服器透過一條不關閉的 HTTP 連線，持續把資料推送給瀏覽器（單向）。**

這裡的關鍵在於「單向」。SSE 只支援 Server → Client，不支援 Client → Server 的即時通訊。如果需要雙向互動，才會考慮使用 WebSocket。

在心智模型上可以這樣理解：
- **一般 HTTP**：問一句，回一句。
- **WebSocket**：雙方隨時對話。
- **SSE**：Server 一直廣播，Client 一直聽。

這種模式非常適合：
- 即時 log 顯示
- AI 回覆串流（token streaming）
- 任務進度更新
- CI/CD build log
- Agent 執行狀態推送

---

## SSE 的底層其實仍然是 HTTP

SSE 並沒有發明新的傳輸協定，它仍然建立在 HTTP 之上。這一點非常重要。

實作上，SSE 只是建立一個「長時間不關閉的 HTTP response」，並設定特殊的 header：

```yaml
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

只要連線不關閉，Server 就可以持續透過這條通道傳送資料。這種方式相較於 WebSocket（使用 `ws` 協定）來說，更容易穿透防火牆與代理伺服器，也更容易部署。

---

## SSE 的資料格式

SSE 傳送的是純文字格式，而且非常簡單。基本格式如下：

```kotlin
data: hello

data: world
```

每一筆事件都必須以**空行**結尾。這個空行是事件的分隔符號，沒有它瀏覽器就不會觸發事件處理函式。

除了 `data:`，SSE 還支援 `event:`、`id:` 等欄位，但在大多數實務應用中，`data:` 就足夠使用。

---

## 使用 Node.js 建立最小 SSE 範例

接下來我們用 Node.js 建立一個最小可運作的 SSE 範例。這個範例會每秒向瀏覽器推送一個遞增數字。

建立一個 `server.js`：

```js
const http = require("http")

http
  .createServer((req, res) => {
    if (req.url === "/events") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      })

      let count = 0
      const timer = setInterval(() => {
        res.write(`data: ${count++}\n\n`)
      }, 1000)

      req.on("close", () => {
        clearInterval(timer)
      })
    }
  })
  .listen(3000)

console.log("Server running at http://localhost:3000")
```

啟動伺服器：
```bash
node server.js
```

這時候 `/events` 這個路由會建立一條不關閉的 HTTP 連線，並每秒推送一個數字。

---

## 瀏覽器端如何接收 SSE？

瀏覽器提供一個原生 API 叫做 `EventSource`，專門用來處理 SSE。

在 HTML 中加入：

```html
<script>
  const eventSource = new EventSource("http://localhost:3000/events")

  eventSource.onmessage = (event) => {
    console.log("received:", event.data)
  }

  eventSource.onopen = () => {
    console.log("connection opened")
  }

  eventSource.onerror = () => {
    console.log("error occurred")
  }
</script>
```

重新整理頁面後，就會看到數字持續增加。

`EventSource` 會**自動重連**，如果網路斷線，瀏覽器會嘗試重新建立連線。這也是 SSE 相較 WebSocket 的一大優勢。

---

## 傳送 JSON 資料

實務上我們通常會傳送 JSON，而不是單純字串。

Server 端可以這樣寫：
```js
res.write(`data: ${JSON.stringify({ progress: 50 })}\n\n`)
```

Client 端：
```js
eventSource.onmessage = (e) => {
  const data = JSON.parse(e.data)
  console.log(data.progress)
}
```

這樣就可以將進度、狀態、log 結構化後傳送到前端。

---

## SSE 與 WebSocket 的差異

當選擇即時技術時，很多人會在 SSE 與 WebSocket 之間猶豫。以下是核心差異整理：

| 功能 | SSE | WebSocket |
| :--- | :--- | :--- |
| **方向** | Server → Client (單向) | 雙向 |
| **協定** | HTTP | ws / wss |
| **複雜度** | 低 | 高 |
| **自動重連** | ✅ 原生支援 | ❌ 需自行實作 |
| **防火牆友善** | ✅ 非常友善 | ⚠️ 可能被擋 |

如果應用情境是 AI 回覆串流、任務進度、log 顯示等「只需要推送資料」的場景，SSE 會比 WebSocket 更簡單且更穩定。

---

## SSE 的限制

理解限制同樣重要：
1. **單向傳輸**：SSE 只能 Server → Client。如果需要雙向通訊，例如聊天室，就必須使用 WebSocket。
2. **純文字**：SSE 僅支援文字資料。
3. **連線限制**：SSE 是長連線模式，要注意伺服器連線數上限。

---

## 在 AI 與即時系統中的實際應用

在現代 AI 系統中，SSE 非常常見。例如大型語言模型回覆時會逐字串流（Token Streaming），本質上就是透過類似 SSE 的串流機制實現。

如果你正在開發像 OpenClaw 這類 autonomous coding agent，並希望在瀏覽器中即時看到 VPS 上的 log 輸出，那麼 SSE 會是一個非常自然的選擇。架構可以設計為：

**Agent → Server log stream → SSE → Browser**

這種設計簡單、穩定，且容易部署。

---

## 總結

SSE 是一種建立在 HTTP 之上的單向即時資料推送機制。它透過維持長時間開啟的 HTTP response，讓伺服器可以持續向瀏覽器傳送事件資料。相較於 WebSocket，它更簡單、更穩定，也更適合只需要 Server → Client 推送資料的場景。

---

## 參考資料
- [MDN Web Docs – Using Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
