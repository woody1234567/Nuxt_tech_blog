# Ray 文章發布指南 (Ray Blogpost Guide)

這份文件說明了如何在 `nuxtcms_ray` 專案中正確地配置與建立技術文章。

## 1. 檔案結構規範

文章統一存放於 `content/blogs` 目錄下，採用 **「類別資料夾 / 文章 Slug 資料夾 / index.md」** 的結構。

### 範例結構：
```text
content/blogs/
├── ai/                      <-- 類別 (Category)
│   ├── mcp/                 <-- 文章 Slug
│   │   ├── index.md         <-- 文章內容
│   │   ├── architecture.png <-- 相關文章圖片
│   │   └── demo.gif
│   └── index.md             <-- 類別索引頁
```

- **Slug**: 請使用小寫英文，並以連字號 `-` 或底線 `_` 分隔。
- **圖片**: 務必放在與文章 `index.md` 同一個資料夾內。

## 2. Frontmatter 配置

每篇 `index.md` 的開頭必須包含 YAML Frontmatter。

```yaml
---
title: "這裡寫文章標題"
description: "這裡寫 50-100 字的文章摘要，用於 SEO 與列表顯示"
tags: [tag1, tag2, tag3]
category: ai                # 可選: ai, nuxt, python, web_dev
date: 2026-02-10            # 格式: YYYY-MM-DD
---
```

## 3. 文章內容規範

- **標題**: 文章內使用 `# 一級標題` 作為主要標題。
- **圖片引用**: 由於圖片在同一個資料夾，直接使用檔名引用即可：
  `![替代文字](image-name.png)`
- **程式碼區塊**: 請標註語言類型（如 `vue`, `ts`, `python`），以便語法高亮生效。

## 4. 建立流程 (Ray 的工作步驟)

1. **確認類別**: 確認文章屬於 `ai`, `nuxt`, `python`, `web_dev` 哪一個類別。
2. **建立目錄**: 執行 `mkdir -p content/blogs/[category]/[slug]`。
3. **寫入檔案**: 根據提供的內容寫入 `index.md`。
4. **處理資源**: 如果有圖片，確保將圖片放置到該目錄中。
5. **更新索引 (選配)**: 檢查該類別的 `index.md` 是否需要手動列出新文章（目前 Nuxt Content v3 自動化程度高，通常不需手動更新索引）。

---
*Last Updated: 2026-02-10 by Ray*
