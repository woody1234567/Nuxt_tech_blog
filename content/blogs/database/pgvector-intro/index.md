---
title: pgvector 深入解析：讓 PostgreSQL 成為向量資料庫
description: 介紹 pgvector 的核心概念、運作原理與實務應用，了解如何在 PostgreSQL 中進行向量儲存與相似性搜尋。
tags: [pgvector, postgresql, vector-database, ai, rag]
category: database
date: 2026-02-19
---

# pgvector 深入解析：讓 PostgreSQL 成為向量資料庫

**pgvector** 是一個專為 **PostgreSQL** 設計的開源擴充套件（extension），目的是讓原本以關係型資料為核心的資料庫，能夠支援高維向量（vector）的儲存與相似性搜尋。

在傳統情境下，PostgreSQL 擅長處理結構化資料，例如使用者資料、訂單資料、文章內容等，並透過 SQL 進行精確查詢與條件篩選。但在 AI 與機器學習快速發展的今天，越來越多應用場景需要處理「向量化資料」──也就是將文字、圖片或聲音轉換為數值向量（embedding），再進行語義相似度比對。

pgvector 的角色，就是在不離開 PostgreSQL 生態系的前提下，替資料庫加入向量型別與相似性搜尋能力，使其可以兼具傳統資料庫與向量資料庫的功能。

---

## 為什麼 AI 應用需要向量？

在現代 AI 系統中，資料往往會透過深度學習模型轉換為一組數值，例如：
- 一段文字會被轉換成 768 維或 1536 維的語意向量。
- 一張圖片會被轉換為代表視覺特徵的高維向量。

這些向量的幾何位置，代表了資料之間的語意關係。當兩個向量在空間中距離越近，代表它們在語意上越相似。這也是語義搜尋（Semantic Search）或 **RAG (Retrieval-Augmented Generation)** 架構的核心。傳統資料庫無法直接進行這種「語意相似性排序」，pgvector 正是為了解決這個問題。

---

## pgvector 的核心能力

### 一、向量資料型別
pgvector 為 PostgreSQL 新增了 `vector(n)` 型別，用來儲存固定維度的數值陣列。
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  embedding vector(1536)
);
```

### 二、相似性度量方式
pgvector 內建支援多種常見方法來衡量向量相似度：
- **L2 距離**（Euclidean Distance）
- **Cosine 相似度**
- **內積**（Inner Product）

在 SQL 中可以這樣進行查詢：
```sql
SELECT id FROM documents ORDER BY embedding <-> '[0.1, 0.2, 0.3, ...]' LIMIT 5;
```
其中 `<->` 是距離運算符。

### 三、最近鄰搜尋（Nearest Neighbor Search）
當資料量達到數十萬甚至數百萬筆時，pgvector 支援近似最近鄰搜尋（ANN, Approximate Nearest Neighbor），並提供兩種主要索引結構：
- **HNSW**（Hierarchical Navigable Small World）
- **IVFFlat**（Inverted File with Flat Clustering）

---

## 為什麼 pgvector 會受到歡迎？

1.  **原生整合**：不需要額外部署獨立的向量資料庫，可以與現有的使用者、訂單資料進行 JOIN 查詢。
2.  **延續強大功能**：延續了 PostgreSQL 的 ACID 特性、備份、複寫與權限管理。
3.  **降低複雜度**：提供「一庫多用」的解法，減少額外基礎設施的維護成本。

---

## 常見應用場景

-   **語義搜尋**：根據自然語言查詢找出最相關的文章或段落。
-   **RAG 系統**：從知識庫中檢索相關內容後交給 LLM 生成答案。
-   **商品推薦**：根據使用者行為向量找出相似商品。
-   **圖像相似度搜尋**：透過圖片 embedding 比對相似圖片。

---

## 結語

pgvector 是一個為 PostgreSQL 打開 AI 世界大門的關鍵 Extension。它讓關係型資料庫不再只擅長精確查詢，也能處理高維向量與語意相似度排序。如果你希望讓資料庫同時承擔「結構化資料管理」與「向量相似搜尋」，pgvector 提供了一條穩定而實用的技術路徑。
