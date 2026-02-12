---
title: WebSocket 入門教學：從概念到 Node.js 實作
description: 深入理解 WebSocket 的核心概念，並透過 Node.js 與 ws 套件實作即時雙向通訊。
tags: [websocket, nodejs, ws, realtime, backend]
category: web_dev
date: 2026-02-12
---

# WebSocket 入門教學：從概念到 Node.js 實作

## 為什麼我們需要 WebSocket？

在理解 WebSocket 之前，我們必須先問一個關鍵問題：為什麼 HTTP 不夠用？

在傳統的 Web 架構中，瀏覽器與伺服器之間採用的是 HTTP 協定。HTTP 是一種 request-response 模型，也就是說，必須由 client 主動發送請求，server 才會回應。每一次溝通都是獨立的請求與回應流程。

這種模式非常適合讀取文章、送出表單、登入系統或呼叫 API 等「單次互動」的場景。然而，一旦需求轉變為即時更新，例如聊天室訊息、股票價格變動、多人協作文件同步或線上遊戲狀態更新，就會遇到明顯限制。

因為在 HTTP 架構下，server 無法主動推送資料給 client。為了解決這個問題，前端通常會使用 polling（輪詢）技術，例如每秒呼叫一次 `fetch()`。這種方式雖然可行，但會造成大量不必要的請求，浪費頻寬與伺服器資源。

這正是 WebSocket 出現的背景。

---

## WebSocket 的核心概念

WebSocket 是一種建立在 TCP 之上的通訊協定，它的目標非常單純：

> **建立一條持續開啟的雙向連線。**

與 HTTP 每次都建立新連線不同，WebSocket 在連線建立完成後，client 與 server 之間可以隨時互相傳送資料，而不需要重新握手。

簡單來說：
- **HTTP** 像是「說一句話就掛電話」
- **WebSocket** 像是「打電話後一直聊天」

當連線建立完成後，雙方可以 `client ↔ server` 隨時互傳資料。

---

## WebSocket 的運作流程

WebSocket 並不是完全取代 HTTP。事實上，它的連線建立過程仍然從 HTTP 開始。

整個流程大致如下：
1. Client 發送 HTTP request
2. Server 回應 Upgrade header
3. 連線升級為 WebSocket
4. 保持連線狀態
5. 雙向傳輸資料

因此你會看到 WebSocket 的網址格式為：`ws://` 或 `wss://`。其中 `wss` 對應的是加密版本，就像 `https` 一樣。

---

## 在 Node.js 中使用 ws 實作 WebSocket

接下來我們透過 Node.js 搭配 `ws` 套件，實作一個最小可運作的 WebSocket server。

### Step 1：安裝 ws
首先建立專案並安裝套件：

```bash
npm init -y
npm install ws
```

`ws` 是 Node.js 中非常輕量且廣泛使用的 WebSocket 實作套件。

### Step 2：建立 WebSocket Server
建立 `server.js`：

```js
const WebSocket = require("ws")
const wss = new WebSocket.Server({ port: 3000 })

console.log("WebSocket server running on port 3000")

wss.on("connection", (ws) => {
  console.log("Client connected")
  
  ws.on("message", (message) => {
    console.log("received:", message.toString())
    ws.send("Server received your message")
  })
  
  ws.on("close", () => {
    console.log("Client disconnected")
  })
})
```

接著啟動：
```bash
node server.js
```

當 server 啟動後，它會監聽 3000 port，等待 WebSocket 連線。這段程式碼的核心在於事件機制。WebSocket 幾乎完全是事件驅動模型，包括：
- `connection`：有 client 連入
- `message`：收到資料
- `close`：連線關閉

### Step 3：建立瀏覽器 Client 測試
在瀏覽器中測試：

```html
<script>
  const ws = new WebSocket("ws://localhost:3000")
  
  ws.onopen = () => {
    console.log("connected")
    ws.send("Hello server!")
  }
  
  ws.onmessage = (event) => {
    console.log("Server says:", event.data)
  }
  
  ws.onclose = () => {
    console.log("connection closed")
  }
</script>
```

當頁面載入後，瀏覽器會建立 WebSocket 連線並發送訊息給 server。server 收到後回傳回應。這樣就完成了最基本的雙向通訊。

---

## 傳輸資料的實務方式

WebSocket 傳送的資料本質上是：
- 字串（string）
- 二進位資料（buffer）
- JSON

實務上最常見的是 JSON 格式：

```js
// 發送
ws.send(JSON.stringify({ type: "chat", text: "hello" }))

// 接收
const data = JSON.parse(message)
```

這種設計讓你可以建立「訊息協定」，例如透過 `type` 區分 chat、notification 或 system message。

---

## 實作一個簡易聊天室（廣播功能）

在實際應用中，聊天室需要把一個人的訊息傳送給所有連線中的 client。我們可以這樣修改 server：

```js
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString())
      }
    })
  })
})
```

`wss.clients` 會包含目前所有連線中的 client。只要遍歷並發送訊息，就可以完成最基本的聊天室廣播功能。

---

## WebSocket 與 REST 的差異

許多初學者會誤以為 WebSocket 是 HTTP API 的替代品。事實上，它們解決的是不同問題。

- **REST API** 適合資源導向操作，例如：取得使用者資料、建立文章、更新訂單狀態。
- **WebSocket** 則適合：即時聊天、即時通知、即時數據流。

REST 是「一次請求一次回應」，WebSocket 是「持續雙向資料流」。兩者並不是競爭關係，而是互補關係。

---

## 在現代框架中的應用

在實務專案中，你常會看到：
- Express + WebSocket
- Fastify + WebSocket
- 或在 Nuxt/Nitro 中整合 WebSocket server

一般做法是：HTTP server 負責 API，WebSocket server 負責即時資料。這樣的架構可以讓系統同時具備 REST 與即時能力。

---

## 最重要的理解

如果你只記住一件事，那就是：

> **WebSocket 是一條持續開著、可雙向傳資料的連線。**

當你的系統需要即時更新，而不想讓 client 不斷輪詢 API 時，WebSocket 就是最自然的解法。掌握這些，你就真正跨進即時系統設計的世界了。
