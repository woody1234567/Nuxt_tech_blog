---
title: Virtual DOM 深入解析：為什麼它能優化前端效能？
description: 探討 Virtual DOM 的基本概念、運作機制（Diffing），以及它與真實 DOM 的差異，幫助你理解現代前端框架如何提升開發效率與效能。
tags: [virtual-dom, dom, javascript, performance, frontend]
category: web_dev
date: 2026-02-03
---

## 先從「為什麼 DOM 會變慢」說起

在前一篇中，我們已經知道，DOM 是瀏覽器把 HTML 轉換後建立的一棵物件樹。
這棵樹讓 JavaScript 可以找到元素、修改內容、監聽事件，也讓網頁能夠動態更新。

問題在於，**DOM 的每一次改動，成本其實都不低**。

當你修改一個 DOM 節點時，瀏覽器並不只是改一個值而已，它還可能需要重新計算樣式（recalculate styles）、重新排版（layout），甚至重新繪製畫面（paint）。如果這些操作在短時間內大量發生，畫面就會開始卡頓。

在早期用純 JavaScript 或 jQuery 開發時，開發者常常需要非常小心地控制「什麼時候動 DOM、一次動多少」，否則效能問題會很明顯。

---

## Virtual DOM 是怎麼出現的？

為了解決「頻繁直接操作 DOM 太昂貴」這件事，前端框架提出了一個關鍵想法：

👉 **如果不要每次狀態改變就立刻動 DOM，而是先在記憶體中算好差異呢？**

這個「存在於記憶體中的結構」，就是 Virtual DOM。

Virtual DOM 並不是瀏覽器提供的東西，而是由像 Vue、React 這類框架自己維護的一棵 JavaScript 物件樹。它的結構，通常會對應到畫面上的 DOM 結構，但本身完全不影響畫面。

---

## DOM 與 Virtual DOM 的本質差異

DOM 是「真實存在於瀏覽器中的結構」，每一次改動都可能影響畫面渲染；
Virtual DOM 則只是「JavaScript 記憶體中的資料結構」，不會直接造成任何畫面成本。

你可以把兩者理解成：

DOM 是已經蓋好的房子，
Virtual DOM 是你在腦中畫的改裝草圖。

改草圖幾乎沒有成本，但真的去敲牆、換窗戶，就需要謹慎評估。

![Image](https://miro.medium.com/1%2ANLNoFfBWzu8Uu1RgWw3Z9g.jpeg)

![Image](https://miro.medium.com/1%2AiJKfCo2XlFtz-9ST0_HCtA.png)

---

## Virtual DOM 真正在做的事是什麼？

當應用程式狀態改變時，框架會先建立一份「新的 Virtual DOM」，然後把它和「舊的 Virtual DOM」進行比較。這個比較過程，通常被稱為 **diffing**。

diff 的目的不是重建整棵樹，而是找出「哪裡真的變了」。

例如，畫面中只有一個數字從 1 變成 2，那 diff 的結果可能只是：「某個文字節點內容改變了」。框架接著才會針對這個差異，精準地去操作真實 DOM，而不是整個畫面重畫一次。

---

## 用一個簡化的程式概念來想

在 Vue 或 React 中，你通常只是在改「狀態」：

```js
count.value++;
```

你並沒有寫任何類似下面的程式碼：

```js
document.querySelector("#count").textContent = count;
```

這是因為框架替你做了三件事：

第一，它根據狀態產生一份新的 Virtual DOM。
第二，它把新舊 Virtual DOM 拿來比較，找出差異。
第三，它只針對真正有差異的地方，更新真實 DOM。

你只負責「描述狀態長什麼樣子」，DOM 什麼時候、怎麼動，交給框架處理。

---

## 那 Virtual DOM 一定比較快嗎？

這是一個常見誤解。
Virtual DOM 並不是因為「它很快」才有價值，而是因為它**讓效能變得可預期、可控**。

直接操作 DOM，在「變化很小、次數很少」的情況下，反而可能比 Virtual DOM 更快。
但在大型應用中，畫面更新來源複雜、狀態變化頻繁，Virtual DOM 可以避免你不小心做出大量無效的 DOM 操作。

它的真正價值在於：**把複雜度從「人」轉移到「框架」身上**。

---

## DOM 與 Virtual DOM 各自負責什麼？

可以這樣理解：

DOM 負責「畫面真正長什麼樣子」，
Virtual DOM 負責「推導出畫面應該怎麼變」。

框架存在的意義，就是站在這兩者之間，替你做決策。

---

## 結論

DOM 是瀏覽器真正用來顯示畫面的物件結構，而 Virtual DOM 則是前端框架在記憶體中維護的一份對照模型。框架先在 Virtual DOM 中計算差異，再將必要的變更套用到真實 DOM 上，以降低直接操作 DOM 帶來的成本與風險。

如果說 DOM 是「結果」，那 Virtual DOM 就是「過程」。

---
