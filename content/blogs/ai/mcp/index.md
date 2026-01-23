---

title: MCP（Model Context Protocol）是什麼？用「AI 的 USB-C」理解模型如何安全連接工具與資料
description: 一篇用實務角度講清楚 MCP 的概念、架構、核心能力與安全注意事項，幫助你快速判斷何時該用 MCP、怎麼開始用。
tags: [MCP, AI Agent, LLM, Tooling, Protocol]
---------------------------------------------

# MCP 是甚麼?

當你希望 AI 不只「回答問題」，而是能**讀檔、查資料庫、呼叫內部 API、操作開發工具**時，最常見的痛點是：每接一個工具就要做一套客製整合，長期會變成「模型 × 工具」的爆炸式組合（N×M）難以維護。MCP（Model Context Protocol）要解決的，就是把這件事標準化：用一個通用協議，讓 AI 應用能以一致方式連接外部工具與資料來源。這也是官方常用的比喻——把 MCP 想成「AI 的 USB-C 連接埠」。[1] [5]

![MCP USB-C][USB_analog]

*Source: [MCP: The Flip Side of the USB-C Analogy | by Peilun Li | Towards ](https://pub.towardsai.net/mcp-the-flip-side-of-the-usb-c-analogy-af98e07bdb30)*

[USB_analog]: USB_analog.png

## 一、MCP 的核心概念：把「上下文與能力」變成可插拔的服務

MCP 是一個開放標準／開放規格，用來定義 **LLM 應用（Client/Host）如何與外部系統（Server）交換上下文（context）與呼叫工具（tools）**。你可以把它理解成：AI 端只需要學會「講 MCP」，就能用同一種方式去連不同的資源（檔案、DB、SaaS、內網服務）。這讓工具整合不再綁定特定模型或單一平台，而是更接近「可插拔、可替換」的基礎設施。[1] [2]

## 二、為什麼 MCP 會變重要：從「寫死的工具函式」走向「可擴展的 Agent 生態」

過去你可能用過 function calling、plugins、各家 SDK 的 tool schema，但通常仍是**平台特定**：規格不同、權限模型不同、部署方式不同。MCP 的價值在於把「模型呼叫工具」的互動抽象成一致協議，並以**Server** 的型態把工具/資源包裝成可重用的能力。這使得同一個 MCP Server 可以同時提供給不同 AI 應用使用（IDE、Chat App、Agent Workflow），降低重工與維運成本。[2] [6]

## 三、MCP 的架構長什麼樣：Host / Client / Server

MCP 常見的角色分工是：

* **Host**：承載模型的應用（例如桌面版 AI、IDE、內部聊天系統），負責把使用者需求帶進來、顯示結果、管理安全邊界。
* **Client**：在 Host 內與 MCP Server 對話的元件，負責用 MCP 規格送出請求、接收回應。
* **Server**：你把「工具、資料、工作流程」封裝成 MCP Server，對外提供標準化介面（例如：讀 Git repo、查 Postgres、打 Jira/Slack、呼叫公司內部服務）。

整體是一種 client-host-server 的設計，重點是讓 AI 端與外部能力之間有清楚的邊界與會話（session）管理，同時保留安全控管的空間。[7] [3]

![MCP architecture][MCP_architecture]

*Source: [What is MCP? | by Workato](https://www.workato.com/the-connector/what-is-mcp/?utm_source=chatgpt.com)*

[MCP_architecture]: MCP_architecture.png

## 四、MCP 具體在「協議層」做了什麼：用 JSON-RPC 定義請求/回應

從協議角度看，MCP 以 **JSON-RPC 2.0** 作為底層訊息格式，讓 client 與 server 之間能用一致的方式送出方法呼叫、參數、回傳值與錯誤處理；並透過規格定義「有哪些能力種類」、「怎麼描述工具」、「怎麼傳資源」等語義層內容。[3] [2]

這件事的意義是：你不用每次都重新設計一套 API 介面給模型用，而是把工具能力用 MCP 的通用方式掛上去，模型/應用端用同樣的互動模式就能探索並呼叫它。[2] [3]

## 五、你會在 MCP 裡遇到的兩個關鍵詞：Tools 與 Resources

多數 MCP 的實作會把能力分成兩大類：

* **Tools**：可以被呼叫執行的動作（例如：`searchTickets`、`createPR`、`queryDB`）。
* **Resources**：可被讀取/瀏覽的上下文資源（例如：檔案、文件、資料表、專案資訊），用來讓模型「拿到足夠上下文」再做推理或呼叫工具。

這樣的切分很貼近真實需求：AI 要做事通常需要「先取得資訊（resources/context）→ 再執行動作（tools）」的閉環。[2] [5]

## 六、安全與風險：MCP 不是「接上就安全」，而是把風險變得更可管理

MCP 把外部系統接進 AI 的同時，也把風險帶進來：例如**提示注入（prompt injection）**、惡意/被竄改的 Server、過度授權導致資料外洩等。OpenAI 的 MCP 文件特別提醒：第三方 MCP Server 不由平台背書，應把它視為外部供應鏈，並用最小權限、審核來源、憑證管理與監控稽核來降低風險。[4]

另外，近期也出現「惡意 MCP Server 套件」被用來悄悄外傳資料的案例報導，凸顯 MCP 生態在成長期更需要建立：來源驗證、版本鎖定、權限分層與行為監控等基本功。[4] [8]

## 七、什麼時候你該用 MCP：三個很實務的判斷

如果你遇到以下情境，MCP 通常值得考慮：

第一，你的 AI 需要連很多工具/資料，而且來源會持續增加（DB、Git、內部 API、第三方 SaaS），你不想每次都重寫整合。[1] [2]

第二，你希望工具能力「可重用」：同一套工具同時給 IDE、Chat、Agent workflow 使用，而不是每個產品各做一份。[7] [5]

第三，你在意安全邊界：希望工具層跟模型層分離、權限與審計清楚，並能逐步擴大能力範圍，而不是一開始就把所有 API 暴露給模型。[7] [4]

## 八、小結：把 MCP 當成「AI 工具整合的底層協議」，先從可控的小場景開始

MCP 的本質不是「讓模型更聰明」，而是讓模型更容易、以更一致的方式取得上下文並安全地執行動作。當你把工具與資料以 MCP Server 封裝起來，你得到的是一種可擴展的整合方式：減少重工、降低耦合、也更利於治理與安全控管。[1][2][4]

如果你準備在自己的專案導入 MCP，建議從「低風險、可觀測、可回滾」的能力開始（例如只讀查詢、文件檢索、Dev 工具輔助），逐步擴到有狀態的寫入操作，會更符合真實團隊的落地節奏。[4][7]

---

## 參考資料

[[1]]:
Anthropic ｜〈Introducing the Model Context Protocol〉
[https://www.anthropic.com/news/model-context-protocol](https://www.anthropic.com/news/model-context-protocol)

[[2]]:
Model Context Protocol ｜〈Specification (Draft)〉
[https://modelcontextprotocol.io/specification/draft](https://modelcontextprotocol.io/specification/draft)

[[3]]:
Model Context Protocol ｜〈Architecture overview〉
[https://modelcontextprotocol.io/docs/learn/architecture](https://modelcontextprotocol.io/docs/learn/architecture)

[[4]]:
OpenAI ｜〈Building MCP servers for ChatGPT and API integrations〉
[https://platform.openai.com/docs/mcp](https://platform.openai.com/docs/mcp)

[[5]]:
Model Context Protocol ｜〈What is the Model Context Protocol (MCP)?〉
[https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)

[[6]]:
InfoQ ｜〈Anthropic Publishes Model Context Protocol Specification〉
[https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/](https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/)

[[7]]:
Model Context Protocol ｜〈Architecture (2025-06-18)〉
[https://modelcontextprotocol.io/specification/2025-06-18/architecture](https://modelcontextprotocol.io/specification/2025-06-18/architecture)

[[8]]:
ITPro ｜〈A malicious MCP server is silently stealing user emails〉
[https://www.itpro.com/security/a-malicious-mcp-server-is-silently-stealing-user-emails](https://www.itpro.com/security/a-malicious-mcp-server-is-silently-stealing-user-emails)

[1]: https://www.anthropic.com/news/model-context-protocol "Introducing the Model Context Protocol"
[2]: https://modelcontextprotocol.io/specification/draft "Specification (Draft)"
[3]: https://modelcontextprotocol.io/docs/learn/architecture "Architecture overview"
[4]: https://platform.openai.com/docs/mcp "Building MCP servers for ChatGPT and API integrations"
[5]: https://modelcontextprotocol.io/ "What is the Model Context Protocol (MCP)?"
[6]: https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/ "Anthropic Publishes Model Context Protocol Specification"
[7]: https://modelcontextprotocol.io/specification/2025-06-18/architecture "Architecture (2025-06-18)"
[8]: https://www.itpro.com/security/a-malicious-mcp-server-is-silently-stealing-user-emails "A malicious MCP server is silently stealing user emails"
