---
title: DOM (Document Object Model) 深入解析
description: 掌握高效操作 DOM 的技巧，了解其運作機制，並學習如何優化 Web 應用的效能。
tags: [dom, javascript, performance, frontend]
category: web_dev
date: 2026-02-03
---

## 從一段最基本的 HTML 說起

HTML 是網頁的原始藍圖，而 DOM 則是瀏覽器在讀取 HTML 後，幫你建立好的「可被 JavaScript 操作的物件模型」。
前端所有互動行為，幾乎都發生在 DOM 這一層。

我們先從一段非常單純的 HTML 開始：

```html
<body>
  <h1>你好</h1>
  <button>點我</button>
</body>
```

從人類的角度來看，這段程式碼很直覺，就是「畫面上有一個標題和一個按鈕」。
但對瀏覽器來說，這仍然只是一段**純文字描述**，它本身不能被 JavaScript 直接修改，也無法監聽點擊、滑鼠移動這類事件。

因此，瀏覽器在真正顯示畫面之前，會先把這份 HTML 進行解析與轉換。

---

## 瀏覽器如何把 HTML 變成 DOM？

當瀏覽器讀取 HTML 時，會依照標籤的巢狀關係，建立出一個樹狀結構。這個結構中的每一個節點，都會是一個 JavaScript 物件，而不是文字。這棵樹，就是所謂的 DOM（Document Object Model）。

用結構化的方式來看，剛剛那段 HTML 會被轉換成類似下面的樣子：

```
document
 └─ body
    ├─ h1
    │   └─ "你好"
    └─ button
        └─ "點我"
```

在這個模型中，`document` 是整份網頁的根節點，`body` 是它的子節點，而 `h1`、`button` 以及文字內容，都是依附在樹上的節點。這些節點不再只是標籤，而是可以被 JavaScript 存取與操作的物件。

## ![Image](https://www.w3schools.com/js/pic_htmltree.gif)

## 為什麼 JavaScript 一定要透過 DOM？

關鍵原因在於：**JavaScript 只能操作物件，不能直接修改 HTML 原始碼**。
DOM 正好扮演了中介角色，讓 JavaScript 可以用「物件操作」的方式來影響畫面。

例如，當你想取得畫面上的按鈕時，實際上是透過 DOM 提供的介面，從這棵樹中找到對應的節點：

```js
const button = document.querySelector("button");
```

這行程式碼的意思並不是「去讀 HTML 檔案」，而是「從目前這棵 DOM 樹中，找到第一個 button 節點」。

---

## DOM 如何讓畫面可以被動態改變？

一旦取得節點物件，接下來的所有操作，其實都是在改變 DOM 的狀態。
例如，修改標題文字時：

```js
const h1 = document.querySelector("h1");
h1.textContent = "哈囉世界";
```

這並沒有改動 HTML 原始碼，而是直接修改 DOM 中 `h1` 節點所代表的文字內容。瀏覽器偵測到 DOM 改變後，才會重新繪製畫面，讓使用者看到新的文字。

同樣的概念也適用在樣式修改上：

```js
button.style.color = "red";
```

這行程式是在改變 `button` 節點的樣式屬性，而不是在 HTML 中新增或修改 `style` 標籤。

---

## 事件其實也是綁在 DOM 上

當你替按鈕加上點擊事件時，本質上是在對 DOM 節點註冊一個事件監聽器：

```js
button.addEventListener("click", () => {
  alert("你點我了");
});
```

這代表瀏覽器會「持續監聽」這個 DOM 節點的狀態，一旦使用者點擊，對應的 JavaScript 函式就會被觸發。整個過程，依然與 HTML 原始碼無關，而是完全發生在 DOM 與 JavaScript 之間。

---

## 用一個直覺的比喻來統整

如果把網頁想成一棟建築，HTML 就像是設計圖，負責描述結構；DOM 則是依照設計圖實際搭建完成的房子；而 JavaScript 則是你的人，可以走進房子裡，開燈、推門或重新佈置家具。

你平常寫的 JavaScript，其實從來不是在「改設計圖」，而是直接對已經存在的房子動手。DOM 正是那個讓操作成為可能的關鍵層。

---

## 為什麼學 Vue / Nuxt 還是一定會碰到 DOM？

即使在 Vue 或 Nuxt 中，你很少直接寫 `querySelector`，DOM 仍然存在於背後。框架的工作，只是幫你管理「什麼時候該新增 DOM 節點、什麼時候該更新或移除」，並避免你手動操作時容易出錯的情況。

理解 DOM 的結構與行為，會讓你更容易理解為什麼某些情況必須使用 client-side、為什麼 hydration 會失敗、以及為什麼像 Three.js 這類高度互動的應用，通常不適合直接做 SSR。

---

## 結論

HTML DOM 指的是瀏覽器在讀取 HTML 後，建立出來的一個物件樹。JavaScript 正是透過這棵樹，才能找到畫面元素、修改內容、調整樣式並監聽事件。只要把 HTML、DOM 與 JavaScript 的角色區分清楚，前端的很多「看起來很神祕的行為」，其實都只是這套機制的自然結果。
