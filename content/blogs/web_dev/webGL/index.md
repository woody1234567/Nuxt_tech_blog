---
title: WebGL 是什麼？為什麼前端 3D 幾乎都靠它？
description: 從新手角度理解 WebGL 的角色，以及 Three.js 如何站在 WebGL 之上，讓前端也能輕鬆開發 3D 圖形與互動場景。
tags: [webgl, threejs, javascript, frontend, 3d]
category: web_dev
date: 2026-02-04
---

## 從「瀏覽器為什麼能跑 3D」開始說起

當你第一次看到瀏覽器裡可以直接顯示 3D 模型、即時光影、甚至像小型遊戲一樣的畫面時，直覺反應通常會是：

> 「這不是應該要裝什麼外掛，或是用 Unity 才能做到的嗎？」

但事實上，這一切的核心技術只有一個：**WebGL**。

WebGL 是一套讓瀏覽器能夠直接使用顯示卡（GPU）進行繪圖的標準 API。只要使用者的瀏覽器支援 WebGL，就可以在「不安裝任何外掛」的情況下，直接在 `<canvas>` 裡畫出高效能的 2D / 3D 圖形。

這也是為什麼現在越來越多互動式網站、資料視覺化、3D 展示頁，會選擇直接在 Web 上完成，而不是另外做成獨立應用程式。

---

## WebGL 到底在做什麼？

從技術層面來看，WebGL 是 JavaScript 與 GPU 之間的一座橋樑。

當你用 JavaScript 呼叫 WebGL API 時，實際上是在告訴瀏覽器：「請把這些頂點資料、顏色、貼圖，交給顯示卡去計算，然後把結果畫在畫布上。」

這和一般用 DOM 操作畫面是完全不同的概念。
DOM 操作是「改變元素 → 重新排版 → 重繪」，而 WebGL 則是「資料丟給 GPU → 並行計算 → 直接輸出畫面」。

也正因為如此，WebGL 非常適合處理大量幾何計算與即時渲染的場景。

---

## 為什麼很少人「直接寫 WebGL」？

如果你曾經打開過 WebGL 的官方教學，大概很快就會遇到以下名詞：

- Vertex Shader
- Fragment Shader
- GLSL
- Buffer、Attribute、Uniform
- Projection Matrix、View Matrix

這些概念本身並沒有錯，但問題在於：
**它們幾乎完全是「顯示卡工程師的語言」**，而不是一般前端工程師熟悉的抽象層級。

即便只是想畫一個「會旋轉的立方體」，用原生 WebGL 也往往需要：

1. 自己撰寫 shader 程式碼
2. 手動處理相機投影與矩陣運算
3. 自行管理物件的幾何資料與生命週期

對大多數開發者來說，這樣的學習成本過高，也不符合實務開發的效率需求。

---

## Three.js 出現的真正意義

Three.js 並不是取代 WebGL，而是**建立在 WebGL 之上的高階抽象層**。

你可以把它理解成：

> 「Three.js = 幫你把 WebGL 那一整套底層流程包裝成好理解的物件模型」

在 Three.js 中，你不再需要直接操作 shader 或 buffer，而是改用更直覺的概念：

- Scene：整個 3D 世界
- Camera：觀看這個世界的視角
- Mesh：畫面中的物體
- Geometry + Material：物體的形狀與外觀
- Renderer：負責把場景畫出來

底層依然是 WebGL，但開發者不需要再碰那些繁瑣的細節。

![Image](https://giridhar7632.github.io/Three.js/assests/04-scenegraph.png)

---

## Three.js 是怎麼「利用 WebGL」的？

從實際流程來看，Three.js 在背後幫你做了幾件非常重要的事：

第一，它自動建立並管理 WebGL context。
你只需要告訴它「畫到哪個 canvas」，剩下的初始化流程都由它完成。

第二，它將常見的數學與圖形概念封裝成物件。
你操作的是 `Vector3`、`PerspectiveCamera`、`Mesh`，而不是一堆低階數值與矩陣。

第三，它在 render loop 中，負責把場景狀態轉換成 GPU 能理解的指令。
你只需要更新物件的位置或旋轉，Three.js 會自動幫你同步到 WebGL。

這讓前端工程師可以專注在「場景邏輯與互動設計」，而不是「顯示卡溝通細節」。

---

## 那我還需要懂 WebGL 嗎？

這是一個很常見、也很實際的問題。

答案是：**不需要一開始就懂，但懂一點會讓你走得更遠。**

在使用 Three.js 的初期，你完全可以把 WebGL 當成黑盒子，只要理解 Three.js 的 API 與概念，就能做出非常完整的作品。

但當你開始遇到以下情境時，WebGL 的基礎知識就會變得非常有幫助：

- 效能瓶頸分析
- 自訂 shader（例如特殊光影或視覺效果）
- 理解為什麼某些效果在行動裝置上特別吃效能
- Debug 渲染異常或黑畫面問題

這時候，你會發現 Three.js 並不是魔法，而是一層你「可以往下理解」的工具。

---

## WebGL、Three.js 與現代前端的關係

在現代前端生態中，WebGL 扮演的是「底層圖形引擎」的角色，而 Three.js 則是讓這個引擎真正被大量開發者使用的關鍵。

你可以在 Vue、Nuxt、React 這類框架中，把 Three.js 當成一個純 client-side 的渲染層，負責處理所有 3D 與動畫，而框架本身則專注在資料流與 UI 結構。

這種分工模式，也正是現在多數互動式 3D 網站的實際做法。

---

## 結論

WebGL 是瀏覽器中負責高效能繪圖的核心技術，但它的使用門檻相對較高。Three.js 則透過良好的抽象設計，讓前端工程師可以用更直覺的方式，站在 WebGL 之上建立 3D 世界。

理解這層關係，會讓你在學 Three.js 時不再只是「照範例貼」，而是清楚知道：
**你操作的每一個物件，最後都是交由 WebGL 與 GPU 去完成畫面的。**

---

## 參考資料

1. Khronos Group, WebGL Overview  
   https://www.khronos.org/webgl/

2. MDN Web Docs, WebGL API  
   https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API

3. Three.js Documentation  
   https://threejs.org/docs/

4. Three.js Examples  
   https://threejs.org/examples/

5. WebGL Fundamentals  
   https://webglfundamentals.org/

---
