---
title: 如何使用 uv 取代 pip：改善 Python 專案的開發流程
description: 介紹 uv 及其基礎指令 (init, add, sync)，幫助初學者理解如何利用 uv 進行高效且穩定的 Python 環境與套件管理。
tags: [uv, python, pip, package-management, environment-management]
category: python
date: 2026-02-03
---

在學 Python 的過程中，很多人都會遇到一個共同的痛點：
**「套件裝了，但專案卻很容易壞掉」**，或是
**「我這台電腦可以跑，你那台卻不行」**。

`uv` 正是為了解決這類問題而誕生的一套工具。
這篇文章會用「初學者友善」的方式，帶你理解三個最常用、也最重要的指令：

> **`uv init` → `uv add` → `uv sync`**

你可以把它們想成一條完整又安全的 Python 專案流程。

---

## 一、`uv init`：建立一個正式的 Python 專案

當你第一次進入一個資料夾，想要「開始寫一個 Python 專案」時，第一步就是：

```bash
uv init
```

這個指令的目的很單純：
👉 **告訴 uv：「這裡是一個 Python 專案」**

執行後，uv 會幫你做幾件基礎但很重要的事：

- 建立 Python 專案的基本結構
- 產生一個 `pyproject.toml` 檔案
- 設定專案名稱、Python 版本等基本資訊

你可以把它理解成 Python 世界裡的：

```bash
git init
```

差別只在於，`git init` 是在初始化版本控制，
而 `uv init` 是在初始化 **Python 專案本身**。

從這一步開始，uv 才知道你接下來做的套件安裝、環境管理，**都是屬於同一個專案的行為**。

---

## 二、`uv add`：安裝套件，並且記錄在專案中

當你需要使用第三方套件時（例如 AI、爬蟲、工具庫），就會用到：

```bash
uv add deepagents tavily-python
```

這一行其實同時完成了兩件事。

### 1️⃣ 安裝套件到目前環境

uv 會幫你下載並安裝：

- `deepagents`
- `tavily-python`

這一點看起來跟 `pip install` 很像，但真正的差別在下一步。

### 2️⃣ 把套件「寫進專案設定」

uv 會自動更新 `pyproject.toml`，清楚記錄：

```toml
[project]
dependencies = [
  "deepagents",
  "tavily-python"
]
```

這代表一個非常重要的概念：

> **這不是「我現在裝了什麼」，而是「這個專案需要什麼」**

和傳統的：

```bash
pip install 套件名稱
```

相比，`uv add` 更像是一種「宣告」。
未來不管是：

- 你自己換電腦
- 其他人 clone 你的專案
- 專案丟到 CI / Server 上跑

只要有這份宣告，環境就可以被正確重建。

---

## 三、`uv sync`：讓實際環境與專案設定一致

當專案的依賴都寫在 `pyproject.toml` 之後，接下來最關鍵的一步是：

```bash
uv sync
```

這個指令的工作是：

👉 **讓目前的 Python 環境，完全「照著專案設定來」**

uv 會檢查：

- 專案宣告需要哪些套件
- 實際環境現在裝了哪些套件

然後自動幫你處理以下狀況：

- 少裝的套件 → 補上
- 版本不對的套件 → 調整
- 多裝、但專案沒用到的套件 → 移除

你可以把 `uv sync` 想成 Python 版的：

```bash
npm install
poetry install
```

差別在於，uv 的速度更快，而且結果是 **可重現的**，不容易出現「環境歪掉」的問題。

---

## 四、把三個指令串起來的完整理解方式

如果用一句話來記：

```text
uv init   → 建立專案
uv add    → 宣告專案需要的套件
uv sync   → 讓環境照宣告執行
```

或是用流程來想：

```text
我開始一個 Python 專案
↓
告訴 uv 這是專案（uv init）
↓
告訴專案需要哪些套件（uv add）
↓
讓電腦環境完全照規格來（uv sync）
```

只要記住這個順序，uv 的使用邏輯其實非常單純。

---

## 五、為什麼現在很多 AI 專案都選擇 uv？

在 AI、Agent、自動化專案中，環境穩定性非常重要，而 uv 特別適合這類場景：

- 安裝與同步速度快
- 不容易出現「在我電腦可以跑」的問題
- 依賴關係清楚，適合自動化工具操作
- 可以鎖定版本，避免套件更新導致專案爆炸
