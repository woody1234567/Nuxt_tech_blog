---
title: Docker 運作原理入門：建立屬於你的容器心智模型
description: 從實際問題出發，理解 Docker 為何誕生、Image 與 Container 的差異，以及 Docker Engine 如何讓應用程式在任何環境中穩定執行。
tags: [docker, container, devops, backend, linux]
category: web_dev
date: 2026-02-14
---

# Docker 運作原理入門：建立屬於你的容器心智模型

## 從「It works on my machine」開始說起

在正式理解 Docker 之前，我們先從一個幾乎所有工程師都遇過的情境開始。

假設你開發了一個 Node.js 專案，在自己的電腦上執行：

```bash
npm install
npm run dev
```

一切正常。但當同事把專案拉下來執行時，卻出現錯誤。原因可能包含：Node 版本不同、作業系統不同、套件版本不一致、缺少系統依賴、環境變數沒有設定等等。

這種情況最經典的一句話就是：

> **It works on my machine.**

問題的本質其實不在程式，而在「執行環境的不一致」。你的應用程式不只是程式碼，它還依賴整個運行環境：作業系統、Runtime、套件與設定。Docker 的誕生，就是為了解決這件事。

一句話理解 Docker：
> **Docker = 把「應用程式 + 執行環境」一起打包，確保在任何地方都能一致地執行。**

---

## 建立 Docker 的三個核心心智模型

要真正理解 Docker，其實只需要掌握三個核心概念：**Image**、**Container** 與 **Docker Engine**。這三者構成了 Docker 的基礎架構。

### 1. Image：應用程式的快照

Image（映像檔）可以理解成：**應用程式的完整快照**。它包含了應用程式運作所需的一切：
- 基礎作業系統（通常是 Linux）
- 程式語言 Runtime（Node、Python、Java 等）
- 套件依賴
- 應用程式程式碼
- 啟動指令

Image 有三個非常重要的特性：
- **Immutable（不可變的）**：一旦建立完成就不會被修改。
- **可重複使用**：一份 Image 可以啟動多個 Container。
- **版本化**：就像 Git commit 一樣。

### 2. Container：Image 的執行實例

如果說 Image 是快照，那 Container 就是：**Image 的「執行中的實例」**。你可以把它類比成：`Class → Object` 或 `Image → Container`。

當你執行 `docker run my-app`，Docker 會根據 Image 建立一個 Container 並啟動程式。Container 是一個獨立的執行環境，它擁有自己的檔案系統、網路空間與 Process 空間。

**注意：Container 並不是虛擬機 (VM)。**

---

## Container 與 VM 的本質差異

很多初學者會把 Docker 當成虛擬機，但兩者架構完全不同。

- **虛擬機 (VM)**：App + Guest OS + Hypervisor + Host OS。每個 VM 都需要一套完整的作業系統。
- **Container**：App + Container Runtime + Host OS。最大的差別在於：**Container 共用 Host OS 的 Kernel**。

這意味著：
- Container 啟動非常快（秒級）。
- 資源消耗極少。
- 整體非常輕量。

Docker 透過 Linux 核心提供的隔離技術（Namespaces 與 Cgroups），把 Process 放進隔離環境中執行。

---

## Docker Engine：背後的管理者

當我們在終端機輸入 `docker build` 或 `docker run` 時，其實是透過 Docker CLI 與 **Docker Engine** 溝通。

Docker Engine 負責：
- 建立與管理 Image。
- 啟動與停止 Container。
- 管理網路與磁碟（Volumes）。
- 處理環境隔離。

你可以把 Docker Engine 想成一個專門負責「容器管理」的小型作業系統。

---

## 從 Dockerfile 到 Container：完整運作流程

1.  **Step 1：撰寫 Dockerfile**
    這是建立 Image 的說明書。描述了要用什麼環境、複製什麼檔案、執行什麼安裝指令。
2.  **Step 2：建立 Image**
    執行 `docker build`。Docker 會下載基礎環境，建立**分層檔案系統（Layered Filesystem）**，最終產生 Image。
3.  **Step 3：啟動 Container**
    執行 `docker run`。Docker 根據 Image 建立隔離空間並啟動程式。

---

## 用一個比喻總結

- **Image = 食譜**
- **Container = 做出來的料理**
- **Docker Engine = 廚房**

一份食譜（Image）可以做出很多份料理（Container），而所有的動作都在廚房（Docker Engine）中完成。

---

## 一句話總結

> **Docker 用 Image 描述環境，用 Container 執行應用程式，並透過 Linux 隔離技術確保環境一致。**

當你掌握這個心智模型後，無論是 Docker Compose 還是 Kubernetes，都只是這套模型的延伸與規模化應用。

---

## 參考資料
- [Docker 官方文件：Image 與 Layer 機制說明](https://docs.docker.com/get-started/docker-concepts/building-images/)
- [Linux Namespaces 與 Cgroups 原理說明](https://man7.org/linux/man-pages/man7/namespaces.7.html)
