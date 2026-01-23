# 使用 Nuxt Image vs `<img>`：為什麼 Nuxt 3 專案幾乎都該用 `<NuxtImg>`？

#Nuxt #Nuxt3 #Frontend #WebPerformance #ImageOptimization #VitePress

在 **Nuxt（特別是 Nuxt 3）** 裡，使用 **Nuxt Image（`<NuxtImg>` / `<NuxtPicture>`）** 來引入圖片，和直接使用原生 **`<img>`** 相比，差異並不只是語法上的方便，而是一整套**圖片效能優化與開發體驗（DX）設計**。

這篇文章不從抽象概念談起，而是用「**實際開發中會遇到的問題**」來對照說明，幫助你判斷：為什麼在 Nuxt 專案中，`<NuxtImg>` 幾乎是預設選項。

---

## 一、自動圖片最佳化：最關鍵的差異

在使用 `<img>` 時，瀏覽器只會忠實下載你指定的圖片檔案，不會主動替你做任何優化。

```html
<img src="/hero.jpg" />
```

這代表不論使用者是手機、平板或桌機，都會下載**同一張圖片**；圖片大小多大就載多大，也不會自動轉換成更有效率的格式。

相對地，當你改用 `<NuxtImg>`：

```vue
<NuxtImg src="/hero.jpg" width="600" />
```

Nuxt Image 會在背後自動完成多項處理，包括依照裝置尺寸產生不同解析度、只下載實際需要的大小、自動壓縮圖片，並在瀏覽器支援的情況下轉換為 **WebP 或 AVIF**。同時也會自動生成 `srcset` 與 `sizes`。

在實務專案中，這種做法往往能**直接減少 30%～ 80% 的圖片流量**，對首頁載入速度的改善尤其明顯。

---

## 二、響應式圖片：不再手寫 `srcset`

如果使用 `<img>` 想要做到真正的 responsive image，通常需要自行撰寫冗長又容易出錯的設定：

```html
<img
  src="/photo-800.jpg"
  srcset="/photo-400.jpg 400w, /photo-800.jpg 800w, /photo-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, 800px"
/>
```

而在 `<NuxtImg>` 中，你只需要描述「版面需求」：

```vue
<NuxtImg src="/photo.jpg" sizes="sm:100vw md:50vw lg:800px" />
```

Nuxt 會依照專案的 breakpoints 自動幫你轉換成正確的 `srcset`，語意清楚，也幾乎不會寫錯。

---

## 三、Lazy Loading 預設啟用

使用原生 `<img>` 時，若沒有特別設定，圖片會在頁面載入時一次全部請求，對效能不利。

```html
<img src="/banner.jpg" />
```

而 `<NuxtImg>` 預設就會啟用 lazy loading，只有在圖片即將進入視窗時才載入。這對 **LCP、INP、CLS 等 Core Web Vitals 指標**都有實質幫助。

如果你正在關注網站效能評分，這一點非常關鍵。

---

## 四、CLS（版面跳動）問題的處理

圖片載入前沒有預留空間，是造成 CLS（Cumulative Layout Shift）的常見原因。原生 `<img>` 很容易出現圖片載入後版面突然下移的情況。

在 `<NuxtImg>` 中，只要你提供圖片的寬高：

```vue
<NuxtImg src="/hero.jpg" width="1200" height="600" />
```

Nuxt 就能在圖片尚未載入前先預留正確比例的空間，大幅降低版面跳動的風險。

---

## 五、多種圖片來源的無痛切換

Nuxt Image 內建多種 image provider，可以輕鬆對應不同部署環境，例如：

- 本地 `ipx`
- Cloudinary
- Imgix
- Vercel
- Cloudflare R2

在 `nuxt.config.ts` 中設定一次即可：

```ts
image: {
  provider: "cloudflare";
}
```

之後在元件中仍然維持：

```vue
<NuxtImg src="/uploads/cover.png" />
```

即使日後從本地改成 **Cloudflare R2** 或部署到 **Vercel**，元件本身完全不需要修改。

---

## 六、`<NuxtPicture>`：自動處理多格式 fallback

若你希望同時支援 AVIF、WebP 與傳統格式，只需使用 `<NuxtPicture>`：

```vue
<NuxtPicture src="/hero.jpg" formats="avif,webp,jpg" />
```

Nuxt 會自動輸出對應的 `<picture>` 結構，並根據瀏覽器能力選擇最佳格式。這種寫法在實務中幾乎不會有人用 `<img>` 手動維護。

---

## 七、開發體驗（DX）的差距

在 `<img>` 的世界中，你需要自己處理圖片尺寸、格式、lazy loading、CLS 與 CDN 整合；而在 `<NuxtImg>` 的世界裡，你只需要描述「這裡需要一張什麼樣的圖片」，其餘交給框架處理。

這正是 Nuxt Image 被設計出來的核心價值。

---

## 什麼時候不適合用 Nuxt Image？

仍然有少數例外情境不建議使用 `<NuxtImg>`，例如 SVG icon（適合 inline 或直接 `<img>`）、Canvas 或 Three.js 使用的 texture、第三方服務要求完全固定 URL 的圖片，以及純後台管理系統、對效能要求不高的頁面。

---

## 快速對照整理

| 項目            | `<img>`    | `<NuxtImg>` |
| --------------- | ---------- | ----------- |
| 自動壓縮        | ❌         | ✅          |
| WebP / AVIF     | ❌         | ✅          |
| Responsive      | 手動       | 自動        |
| Lazy loading    | 手動       | 預設        |
| CLS 控制        | 容易出問題 | 預設安全    |
| CDN 整合        | 手動       | 原生        |
| Core Web Vitals | ❌         | ✅          |

---

## 實務建議（以常見 Nuxt 技術為例）

如果你的專案是 Nuxt + 前台內容展示，並且在意效能與 Web Vitals 指標，那麼**所有內容型圖片一律使用 `<NuxtImg>`** 是最保險的做法；只有在 WebGL、Three.js 或特殊 texture 載入場景，才回退使用 `<img>` 或 loader。

如果你願意，可以再進一步從你現有的專案結構出發，訂一份「圖片使用規範」，或直接優化 `nuxt.config.ts` 的 image 設定，讓整個專案在效能與維護性上一次到位。
