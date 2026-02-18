---
title: TDD（Test-Driven Development）介紹：測試驅動開發的核心流程與實務
description: 深入了解 TDD 的核心精神「Red-Green-Refactor」，掌握如何透過先寫測試再開發的方式，提升程式碼品質與設計穩定度。
tags: [tdd, testing, software-engineering, web_dev, quality-assurance]
category: web_dev
date: 2026-02-18
---

# TDD（Test-Driven Development）介紹

在軟體開發中，傳統的做法通常是先編寫功能程式，再補上測試；然而 **TDD（Test-Driven Development，測試驅動開發）** 則倡導一種截然相反的思維。

一句話理解 TDD：
> **TDD = 先寫測試，再寫功能**

這不單純只是開發順序的對調，而是一種強調透過測試來「驅動」程式設計與架構的完整流程。

---

## 為什麼需要 TDD？

在沒有 TDD 的傳統流程中，開發者通常會遵循以下循環：
**寫功能 → 手動測試 → 修 Bug → 重構**

這種做法雖然直覺，但長期下來容易面臨幾個問題：
- **測試不完整**：容易忽略邊緣案例（edge cases）。
- **回歸錯誤（Regression）**：新增功能時容易意外破壞既有的功能。
- **設計失控**：程式碼容易變得難以測試，從而導致耦合度過高。
- **缺乏信心**：在進行大規模重構時，因為沒有自動化測試保護而感到害怕。

TDD 的核心精神在於：**測試不只是用來驗證程式，更是為了幫助設計程式。**

---

## TDD 的核心循環（Red → Green → Refactor）

TDD 建立在一個極短的開發週期之上，被稱為 **TDD 循環**：

### 1️⃣ Step 1：Red（先寫失敗的測試）
在尚未編寫任何功能代碼之前，先寫一個針對該功能的測試。
例如：
```js
test("add should return correct result", () => {
  expect(add(1, 2)).toBe(3);
});
```
此時因為 `add` 函式根本還不存在，測試一定會**失敗（顯示紅色）**。
**目的**：明確定義需求、思考 API 的使用方式、決定行為規格。

### 2️⃣ Step 2：Green（寫最小可行程式）
編寫「剛好能讓測試通過」的程式碼。
```js
function add(a, b) {
  return a + b;
}
```
**目的**：專注於達成功能，不追求程式碼的完美或過度設計。

### 3️⃣ Step 3：Refactor（重構）
在測試保護的情況下，優化剛才寫出的程式碼。
- 改善變數命名。
- 消除重複代碼。
- 提高程式碼的可讀性與結構。
**目的**：在確保功能正確的前提下，提升代碼品質。

---

## TDD 的實際範例

假設我們要實作一個判斷偶數的函式 `isEven()`。

1.  **Red**：寫下測試 `expect(isEven(2)).toBe(true)`。執行測試，失敗。
2.  **Green**：實作最小功能 `function isEven(n) { return n % 2 === 0; }`。執行測試，通過。
3.  **Red (擴充)**：加入反向測試 `expect(isEven(3)).toBe(false)`。
4.  **Refactor**：檢查代碼是否簡潔，若邏輯已足夠清晰則完成循環。

---

## TDD 帶來的好處

-   **程式更穩定**：測試成為「安全網」，大幅減少 Regression Bug。
-   **設計更乾淨**：TDD 會引導你寫出小函式、低耦合、高內聚且易於測試的代碼。
-   **重構更有信心**：修改代碼後只需跑一次測試，就能知道是否破壞了功能。
-   **測試即文件**：測試代碼本身就是「可執行的規格說明書」，比文字文件更準確。

---

## TDD 的限制與挑戰

儘管優點眾多，TDD 也有其成本：
-   **開發初期變慢**：需要先花時間設計與編寫測試。
-   **學習曲線**：需要熟悉測試框架與 Mock 技術。
-   **非萬能藥**：不適合快速實驗的 Prototype、純 UI 排版、或一次性腳本。

---

## 結論

TDD 的本質並不是關於測試，而是：**用測試來設計程式**。

當你堅持「測試先行，功能跟隨」時，良好的軟體設計會自然而然地浮現。對於需要長期維護、多人協作的大型系統來說，TDD 是建立高品質代碼不可或缺的基石。

---

## 參考資料
- [Nuxt Content Documentation - Markdown Syntax](https://content.nuxt.com/docs/files/markdown#mdc-syntax)
- [Nuxt MDC Module](https://nuxt.com/modules/mdc)
