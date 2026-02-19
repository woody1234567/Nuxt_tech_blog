---
title: Test 與 Log 的差異與實務搭配：建立完整系統觀測能力
description: 釐清測試（test）與日誌（log）在軟體工程中的角色差異，理解兩者如何互補，並在 Nuxt / Node 專案中建立完整觀測與除錯能力。
tags: [testing, logging, nuxt, nodejs, backend, observability]
category: web_dev
date: 2026-02-18
---

# Test 與 Log 的差異與實務搭配：建立完整系統觀測能力

在實務開發中，很多人都曾問過一個問題：「如果專案已經寫了完整的 test，還需要 log 嗎？」這是一個非常好的問題。因為 test 與 log 看起來都在「避免出錯」，但實際上它們解決的是**完全不同層級的問題**。理解這個差異，是從初階工程師走向成熟工程師的重要一步。

本文會從工程實務角度出發，幫你建立一個清晰的心智模型。

---

## Test 在解決什麼問題？

測試（unit test、integration test、e2e test）主要是在確保一件事：

> **程式在「預期情境」下運作正確**

例如：
- function 是否回傳正確結果
- API 是否回傳正確格式
- 資料庫操作是否成功
- 使用者流程是否可以順利完成

像下面這樣的測試：
```ts
expect(add(1, 2)).toBe(3)
```

這是在驗證「程式邏輯」是否符合我們的預期。**測試的核心特性是：它在「受控環境（controlled environment）」下執行。**

也就是說：
1. 你知道輸入是什麼
2. 你知道資料庫狀態
3. 你可以 mock 外部 API
4. 你能重現每一次測試情境

這是一種「預防式」保護機制。當有人改壞程式時，CI 會告訴你。

---

## Log 在解決什麼問題？

Log 解決的則是另一件事：

> **系統在「實際運行時」發生了什麼**

這包括：
- Production Error
- API Latency
- 使用者行為
- Background job 狀態
- 第三方 API 失敗
- Race condition
- Server crash 前的最後狀態

這些幾乎都是 Test 無法完整覆蓋的。測試只能保證「在你設計好的情境中是正確的」，但無法保證「真實世界一定照劇本演出」。

---

## 一個真實的 API 例子

假設你有一個 API：`POST /api/orders`。

在 Test 環境中，你可以驗證：
- 正常建立訂單
- 缺少欄位時回傳 400
- 資料庫成功寫入

```ts
it("creates order", async () => {
  const res = await createOrder(data)
  expect(res.id).toBeDefined()
})
```

這些測試很好，但它們只存在於受控情境。

### Production 會發生的真實狀況
實際環境中可能出現：
- DB connection timeout
- Redis 掛掉
- API 被流量打爆
- 使用者送出奇怪的極端資料
- Payment gateway 回傳非預期錯誤
- Server memory leak

這些狀況你不一定能在 Test 中重現。此時如果沒有 Log，你看到的可能只是一行 `500 Internal Server Error`，你完全不知道發生什麼事。

但如果有適當的 Logging：
```ts
logger.error("createOrder failed", { userId, orderId, error })
```
你至少能知道哪個使用者、哪筆訂單發生什麼錯誤，以及當時的上下文資料。這就是 Log 的價值。

---

## 核心差別（非常重要）

請記住這兩句話：
> **Test = 預防 Bug**
> **Log = 診斷 Bug**

或者更精準地說：
> **Test 是「開發時的安全網」**
> **Log 是「運行時的黑盒紀錄器」**

它們不是替代關係，而是互補關係。

---

## 成熟專案的兩層結構

一個成熟的專案通常會同時擁有：

### 第一層：測試層（Correctness）
- Unit test / Integration test / E2E test
- Type checking (TypeScript)
- Lint (ESLint)
**這一層確保程式在邏輯上正確。**

### 第二層：觀測層（Observability）
- Logging
- Metrics (Grafana / Prometheus)
- Tracing
- Error reporting (Sentry)
**這一層確保系統在真實世界可被觀察。** 如果沒有 Observability，你等於在 Production 環境「盲飛」。

---

## 總結

請記住這句話：

> **有 test 的專案仍然需要 log，因為 test 無法觀察 production 的真實行為。**

Test 保證「理想狀況下是正確的」，Log 讓你理解「真實世界發生了什麼」。兩者加起來，才是一個真正可維運、可擴展的系統。

當你的專案從「能跑」升級到「可維運」時，Logging 的設計將會成為你除錯與優化效能的生命線。
