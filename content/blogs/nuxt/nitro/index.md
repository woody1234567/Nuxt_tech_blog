---
title: Nitro 是什麼？從 Nuxt 專案到 Server 與 Edge 的關鍵引擎
description: 深入理解 Nitro 在 Nuxt 中的角色，為什麼它不是 Express，以及它如何讓同一份 Nuxt 專案同時支援 Node、Serverless 與 Edge。
tags: [nuxt, nitro, ssr, server, edge]
category: web_dev
date: 2026-02-05
---

## 什麼是 Nitro？先用一句話抓住定位

在 Nuxt 的世界裡，Nitro 並不是一個你「額外選用」的工具，而是從 Nuxt 3 開始就**內建在核心架構中的伺服器引擎**。

更精確地說，**Nitro 負責把你寫好的 Nuxt 專案，轉換成「實際能被部署平台執行的 Server 應用」**。
你在專案裡寫的 API、SSR 邏輯、Server middleware，最後都會交給 Nitro 統一處理。

因此可以這樣理解角色分工：

Nuxt 關心的是「你怎麼寫程式會最舒服」，
Nitro 關心的是「這些程式最後要怎麼跑、跑在哪裡」。

---

## Nitro 在 Nuxt 架構中的位置

理解 Nitro，關鍵不在於它「做了什麼功能」，而是它**站在架構中的哪一層**。

當你寫一個 Nuxt 專案時，實際上中間會多出一層你平常很少直接碰觸的轉換層，那一層就是 Nitro。

概念上可以這樣想：

```
你寫的頁面、元件、server 檔案
↓
Nuxt（路由、SSR、資料流、DX）
↓
Nitro（Server Runtime、平台適配）
↓
實際部署環境（Node / Serverless / Edge）
```

這代表一件很重要的事：
**你寫的 server code 並不是直接在 Node 或 Edge 上執行，而是先進入 Nitro 的 runtime。**

---

## 從一個最基本的 server API 看 Nitro 的存在

在 Nuxt 中，你可以在 `server/api` 資料夾建立 API：

```ts
// server/api/hello.ts
export default defineEventHandler(() => {
  return { message: "Hello from Nitro" };
});
```

從使用者的角度來看，這只是一個 API。
但從執行流程來看，事情其實是這樣發生的：

1. Nuxt 在 build 時掃描 `server/` 目錄
2. Nitro 收集所有 server handlers
3. Nitro 把它們包裝成符合目標平台的 server 程式
4. 部署後，請求才真正進到這段程式碼

也就是說，**這個 handler 並不是「Node 原生 API」**，而是由 Nitro 接管的請求流程。

---

## Nitro 為什麼不是 Express / Fastify？

很多人在這裡會出現誤解，因為 Express、Fastify 也都是「處理 HTTP 請求」。

但 Nitro 的出發點完全不同。

Express 的世界裡，你一定會看到這種寫法：

```js
app.get("/api/hello", (req, res) => {
  res.json({ hello: "world" });
});
```

這種寫法有一個前提：
👉 **你一定跑在 Node.js，而且一定有 `req` / `res` 這組 API。**

但在 Edge Runtime（例如 Cloudflare Workers）裡，這些 API 是不存在的。

因此 Nitro 採取了一個更底層、也更抽象的設計方式：
它不暴露 `req` / `res`，而是提供一個跨平台的 `event` 物件。

```ts
export default defineEventHandler((event) => {
  const query = getQuery(event);
  return query;
});
```

這裡的 `event`，不是 Node 的 request，
而是 **Nitro 封裝後的「請求事件模型」**。

正因為這層抽象存在，**同一份 server code 才能同時跑在 Node 與 Edge。**

---

## Nitro 如何讓同一份專案跑在不同部署環境？

這是 Nitro 最實際、也最有價值的地方。

在 Nuxt 中，你不需要為不同平台重寫 server 程式，只需要在設定檔中告訴 Nitro 目標環境是什麼。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: "vercel",
  },
});
```

當你指定 `vercel` 時，Nitro 會在 build 階段：

- 把 server handlers 轉成 Serverless Functions
- 處理平台限制（例如冷啟動、檔案系統）
- 輸出符合 Vercel 規範的結構

如果你改成：

```ts
nitro: {
  preset: "cloudflare";
}
```

那麼同一份程式碼，會被轉成可在 Cloudflare Workers 上執行的格式。

**你寫的不是「Vercel API」或「Cloudflare API」，而是「Nitro API」。**

---

## Nitro 與 SSR 的關係

當你在 Nuxt 中使用 SSR 時，實際上也是 Nitro 在負責執行伺服器端渲染。

例如一個頁面：

```vue
<script setup>
const { data } = await useFetch("/api/hello");
</script>
```

在 SSR 階段：

1. 請求進入 Nitro runtime
2. Nitro 執行頁面 render
3. 在 server 端呼叫 `/api/hello`
4. 組合 HTML 回傳給瀏覽器

這整個過程，並不是瀏覽器發生的事情，而是**完全在 Nitro 所建立的 server 世界中完成**。

---

## 為什麼 Nuxt 一定要自己做 Nitro？

原因其實很單純：
**現代 Web 的部署環境變化速度，已經快到不能再綁死在某一個 server 框架上。**

如果 Nuxt 綁定 Express：

- Edge 很難支援
- Serverless 會有很多限制

Nitro 的存在，讓 Nuxt 可以自己掌控 server 抽象層，而不是被底層框架牽著走。

---

## 用一個建築比喻重新理解 Nitro

如果把整個系統想成建築流程：

Nuxt 是設計圖，定義空間、動線與使用體驗。
Nitro 是結構與施工轉換，確保這張設計圖能在不同地區合法落地。
部署平台則是各地的建築法規與工法。

你畫的是同一張圖，
Nitro 會幫你轉成最適合當地的施工方式。

---

## 結語：什麼時候該想到 Nitro？

當你在 Nuxt 專案中遇到這些問題時，答案幾乎都在 Nitro 這一層：

- API 為什麼在 Edge 跑得起來？
- 為什麼 SSR 可以部署成 Serverless？
- 為什麼沒有 `req` / `res`？

理解 Nitro，不是為了寫更多設定，而是為了**在架構層級知道事情為什麼能這樣運作**。
