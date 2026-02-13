---
title: YAML 配置是什麼？為什麼現代開發都在用它
description: 從基礎語法到實際應用，帶你理解 YAML configuration 的核心概念，以及為什麼 Docker、Kubernetes、GitHub Actions 都選擇它。
tags: [yaml, configuration, devops, docker, kubernetes]
category: web_dev
date: 2026-02-13
---

# YAML 配置是什麼？為什麼現代開發都在用它

在現代網站與雲端應用中，幾乎每個系統都需要「設定檔」。例如伺服器要跑在哪個 port、資料庫帳號密碼是什麼、CI/CD 要怎麼執行流程等等。這些內容不屬於程式邏輯，而是「系統運作規則」。

所謂的 **YAML 配置（YAML configuration）**，就是使用 YAML 這種格式來撰寫設定檔。它的核心目的其實非常單純：

> **用「人類容易閱讀」的方式描述系統設定，而不是寫程式碼。**

YAML 本身是一種資料表示格式（data serialization format），全名是 **YAML Ain’t Markup Language**。它不是程式語言，而是一種用來描述資料結構的格式，特別適合用在設定檔。

在實務上，YAML 常見於以下情境：
- 系統設定（config）
- 部署設定
- CI/CD 流程
- 容器編排
- 靜態網站生成器設定
- 前端工具設定（如 Nuxt、Vite、ESLint 等）

換句話說：YAML 的用途是「告訴系統怎麼運作」，而不是寫業務邏輯。

---

## 一個最基本的 YAML 設定範例

我們先看一個最簡單的例子。假設有一個網站的伺服器與資料庫設定：

```yaml
server:
  port: 3000
  host: localhost

database:
  user: root
  password: secret
```

這段 YAML 的意思是：系統有兩個設定區塊，`server` 與 `database`，底下分別有對應的屬性。如果用 JSON 表示，會長這樣：

```json
{
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "database": {
    "user": "root",
    "password": "secret"
  }
}
```

兩者的結構完全相同，但 YAML 沒有大量的大括號與引號，看起來更像一般文件。它的關鍵特徵是：**用「縮排」表示階層結構，而不是用大括號。** 這也是 YAML 可讀性高的原因。

---

## YAML 的核心語法其實非常簡單

很多人第一次看到 YAML 會覺得很神祕，但實際上只需要掌握三種基本結構。

### 1. Key-Value 結構
```yaml
name: Woody
age: 30
```
這和 JSON 的 `"name": "Woody"` 本質上是一樣的。

### 2. 巢狀結構（用縮排表示層級）
```yaml
server:
  port: 3000
```
這裡要特別注意，YAML 對縮排非常敏感，而且**必須使用空格，不能使用 Tab**。縮排錯誤會直接導致解析失敗。

### 3. 陣列
```yaml
languages:
  - JavaScript
  - Python
  - Go
```
每個 `-` 代表陣列中的一個元素。這種寫法在描述流程或步驟時非常自然。

---

## 什麼叫做 YAML Configuration？

當一個系統使用 YAML 作為設定檔格式時，我們就稱它為 YAML configuration。例如常見的檔名：
- `docker-compose.yml`
- `kubernetes.yaml`
- `github-actions.yml`
- `config.yaml`

這些檔案都不是程式碼，而是描述系統如何運作的文件。它們會被對應的工具讀取，然後依照內容去建立服務、啟動流程或設定環境。

---

## 為什麼現代系統大量使用 YAML？

這是理解 YAML 流行的關鍵。

1. **可讀性高**：相比 JSON，YAML 寫法更接近自然語言結構。當設定變複雜時，這種差異會更加明顯。
2. **支援註解**：YAML 可以加入註解（使用 `#`）。JSON 並不支援註解，這對於需要團隊協作與維護的設定檔來說非常重要。
3. **適合描述階層與流程**：例如部署流程中的步驟，用 YAML 表示非常自然。

---

## DevOps 生態系為什麼幾乎都選 YAML？

在現代雲端開發環境中，YAML 幾乎已經成為設定檔的事實標準。像 Docker Compose, Kubernetes, GitHub Actions, GitLab CI, Ansible 等工具都使用 YAML。當整個 DevOps 生態系都採用同一種格式時，學習與維護成本就會降低，這也讓 YAML 成為跨平台設定的共同語言。

### 一個真實例子：GitHub Actions 的 YAML
我們看一段實際的 CI 設定：

```yaml
name: CI
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm install
      - run: npm test
```

這段設定其實在說：**每當有 push 事件發生時，在 Ubuntu 環境中執行 npm install 與 npm test。** 整個自動化流程完全由 YAML 描述，系統只負責讀取並執行。

---

## YAML 的心智模型

學習 YAML 不需要背誦複雜語法，只需要建立一個清楚的心智模型：
> **YAML 就是設定檔版本的 JSON，但更好讀。**

它不是程式語言，不負責計算，也不負責邏輯判斷。它只負責：
- 描述設定
- 描述資料結構
- 描述執行流程

當你在使用 Nuxt、Docker、Kubernetes 或 CI/CD 工具時，其實就是在透過 YAML 告訴系統：「請按照這份說明書運作。」理解這一點之後，你會發現 YAML 不再只是格式問題，而是整個現代開發流程中的基礎語言。
