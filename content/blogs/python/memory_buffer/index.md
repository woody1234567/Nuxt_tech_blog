# 如何在 FastAPI 中調用記憶體 Buffer 回傳圖片?(附 python+matplotlib+fastapi 實例)

在使用 FastAPI 建立資料視覺化 API 時，一個常見的需求是：**即時產生圖表，並直接回傳給前端顯示**。許多初學者會直覺地將圖存成檔案，再讀取檔案回傳，但在實際的後端服務環境中，這種做法往往會帶來效能與併發上的風險。

本文將以一段實際常見的程式碼為例，說明 **Matplotlib 圖片為什麼應該直接寫入記憶體（memory buffer），而不是存成實體檔案**，並解釋這種寫法在 FastAPI 中的正確定位。

---

## 用 FastAPI 動態產生並回傳 sin 函數視覺化圖表（完整實例）

在這個小節中，我們將實作一個簡單但「設計正確」的範例：**透過 FastAPI 接收 sin 函數參數，並即時回傳對應的圖表圖片**。

這個範例不會將圖片存成檔案，而是直接在記憶體中產生並回傳，符合實際 production 環境的寫法。

---

### 一、API 想解決什麼問題？

我們希望做到以下幾件事：

使用者可以透過 URL 傳入參數，例如振幅與頻率，FastAPI 接收到參數後即時計算對應的 sin 函數，使用 Matplotlib 畫出圖形，最後將圖片直接回傳給瀏覽器顯示。

整個流程中，不產生任何實體檔案，也不留下伺服器狀態。

---

### 二、完整 FastAPI 實作範例

以下是一個 **可以直接執行的最小完整範例（MVP）**，你可以存成 `main.py` 使用。

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import numpy as np
import matplotlib.pyplot as plt
import io

app = FastAPI(title="Sine Function Visualization API")


@app.get("/sin")
def plot_sin(
    amplitude: float = 1.0,
    frequency: float = 1.0
):
    # Generate x range
    x = np.linspace(0, 2 * np.pi, 400)
    y = amplitude * np.sin(frequency * x)

    # Create figure
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(x, y)
    ax.set_title(f"y = {amplitude} · sin({frequency}x)")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.grid(True)

    # Export image to memory buffer
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="image/png"
    )
```

---

### 三、這段程式碼在做什麼？

當 `/sin` API 被呼叫時，FastAPI 會先自動解析 URL 中的 `amplitude` 與 `frequency` 參數，並轉換為 Python 的 `float` 型別。

接著使用 NumPy 產生連續的 x 軸數值，並計算對應的 sin 函數結果。Matplotlib 只負責一件事：**把數學結果轉成圖形**。

真正關鍵的地方在於，圖片並沒有被存成檔案，而是透過 `io.BytesIO()` 直接寫進記憶體。FastAPI 最後將這個記憶體中的位元組資料，當作一個串流回傳給使用者。

---

### 五、啟動與測試方式

在專案目錄中執行：

```bash
uvicorn main:app --reload
```

接著打開瀏覽器，測試不同參數組合，例如：

```
http://127.0.0.1:8000/sin
http://127.0.0.1:8000/sin?amplitude=2
http://127.0.0.1:8000/sin?amplitude=0.5&frequency=3
```

你會發現，每次請求都會即時產生一張新的 sin 函數圖。

## 調用記憶體 Buffer 的方式

### 一、從需求出發：FastAPI 要的是什麼？

FastAPI 在回傳圖片時，通常會搭配 `StreamingResponse` 使用。這類 response 並不在乎圖片是從哪裡來的，它只關心一件事：**是否能取得一個可讀取的 binary stream**。

也就是說，只要你能提供一個「像檔案一樣可以被讀取的位元組來源」，FastAPI 就能把它當成 HTTP 回應送給瀏覽器。這個來源可以是實體檔案，也可以是存在於記憶體中的資料流。

---

### 二、把圖畫在記憶體裡，而不是硬碟上

以下是一段典型的寫法：

```python
buf = io.BytesIO()
plt.tight_layout()
plt.savefig(buf, format="png")
plt.close(fig)
buf.seek(0)
```

這段程式的核心概念很單純：**Matplotlib 把畫好的圖直接輸出成 PNG 位元組，並存進 RAM，而不是寫成 `.png` 檔案**。

`io.BytesIO()` 建立了一個存在於記憶體中的位元組容器，它的行為和檔案非常像，可以被寫入、讀取、移動指標位置，但完全不會碰到磁碟。對後端服務而言，這代表一次 request 就對應一份暫時性的資料，不會留下任何痕跡。

當 `plt.savefig()` 將圖片寫入這個 buffer 時，Matplotlib 其實並不知道自己不是在寫檔案，它只負責把圖轉成 PNG 格式並輸出。這正是 `BytesIO` 的強大之處。

---

### 三、為什麼一定要把圖關掉？

在 API 環境中，`plt.close(fig)` 這一行非常關鍵。

FastAPI 是一個長時間運作的 server，每一次 request 都可能產生一張新的圖。如果沒有明確關閉 figure，Matplotlib 內部的物件會不斷累積，最終導致記憶體用量失控，甚至出現 OOM（Out Of Memory）錯誤。

因此，這種寫法並不是「寫好看而已」，而是**符合 server 等級的資源管理方式**。

---

### 四、為什麼還需要 `seek(0)`？

當圖片資料被寫入 `BytesIO` 後，讀取指標會停留在資料的結尾。如果此時直接交給 FastAPI 回傳，實際讀取到的會是「空資料」。

透過 `buf.seek(0)`，我們明確地將指標移回開頭，確保後續讀取時能從 PNG 的第一個位元組開始。這個動作在檔案操作中非常常見，但在記憶體 buffer 中也同樣重要。

---

### 五、如果改用實體檔案，問題會在哪？

將圖片先存成檔案再回傳，在教學範例中或許可行，但在實際部署環境會帶來不少隱憂。當多個使用者同時請求 API 時，檔名衝突、寫入競爭、權限限制與磁碟 I/O 成本，都會讓系統變得脆弱且難以維護。

相較之下，使用記憶體 buffer 的方式是**無狀態（stateless）且併發安全的**，也更符合容器化部署與雲端環境的設計哲學。

---

### 六、這種寫法在業界的實際定位

直接將圖像寫入記憶體並透過 API 回傳，是目前資料視覺化服務的標準模式之一。無論是科學計算 API、機器學習推論結果的圖像輸出，或是天文、光譜等領域的即時繪圖服務，都大量採用這樣的設計。

它的核心優勢在於：**高效、乾淨、不依賴檔案系統**，同時也讓 API 本身保持單純。

---

## 小結：一句話理解這個模式

Matplotlib 負責把圖畫好並轉成位元組資料，而 FastAPI 則直接把這些存在 RAM 裡的資料當成 HTTP 回應送出去。整個過程沒有落地檔案，也不留下任何狀態。

這正是後端 API 在處理「即時產生內容」時，最理想的一種實作方式。
