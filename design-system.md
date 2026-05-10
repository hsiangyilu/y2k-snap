# Y2K Snap — Design System

> 懷舊 × 電子感 × 夢幻。為 Gen Z 打造的 Y2K 風格照片編輯 App。

---

## 品牌定調

| 屬性 | 定義 |
|------|------|
| 個性關鍵字 | 懷舊、電子感、夢幻 |
| 使用情境 | 拍完馬上編輯發 IG，快速、衝動、即時 |
| 視覺方向 | 銀色金屬 × 螢光酸性，Y2K 雜誌美學 |
| 背景基調 | 復古印刷感（#F0F0F0 淺灰底） |

---

## Color Tokens

### 使用原則

- **永遠用 Semantic token，不要直接用 Primitive 色碼**
- 改品牌色時只需更新 Primitive 層，Semantic 層自動跟著變
- Hard-code 色碼（如 `#B8FF3C`）視為違規，Code Review 會擋掉

### Brand

| Token | Hex | 用途 |
|-------|-----|------|
| `brand.primary` | `#B8FF3C` | 主要按鈕、CTA、active 狀態 |
| `brand.primary-hover` | `#A3FC11` | hover 狀態 |
| `brand.primary-active` | `#87DA05` | pressed 狀態 |

**Usage：** 主要行動按鈕、重點 highlight、進度條
**Don't：** 不要用在大面積背景、不要用在小於 12px 的文字

### Accent

| Token | Hex | 用途 |
|-------|-----|------|
| `accent.default` | `#9B5DFF` | 輔助按鈕、標籤、連結 |
| `accent.hover` | `#8639FD` | hover 狀態 |
| `accent.active` | `#7215FA` | pressed 狀態 |

**Usage：** 次要操作、decorative 元素、選中狀態的 border
**Don't：** 不要和 `brand.primary` 同時出現在同一個元件上

### Background

| Token | Hex | 用途 |
|-------|-----|------|
| `background.base` | `#F0F0F0` | 頁面底層背景 |
| `background.surface` | `#FFFFFF` | 卡片、Modal、浮層 |
| `background.overlay` | `rgba(10,10,10,0.6)` | 全螢幕遮罩 |

### Text

| Token | Hex | 用途 |
|-------|-----|------|
| `text.primary` | `#0A0A0A` | 主要內文、標題 |
| `text.secondary` | `#4A4A4A` | 次要說明、placeholder |
| `text.on-brand` | `#0A0A0A` | 螢光綠按鈕上的文字 |
| `text.on-accent` | `#FFFFFF` | 紫色按鈕上的文字 |
| `text.disabled` | `#858585` | 禁用狀態文字 |

### Border

| Token | Hex | 用途 |
|-------|-----|------|
| `border.default` | `#C2C2C2` | 一般分隔線、input 邊框 |
| `border.strong` | `#858585` | 強調邊框、focus ring |
| `border.brand` | `#B8FF3C` | 品牌強調邊框 |
| `border.accent` | `#9B5DFF` | 輔色強調邊框 |

### Feedback

| Token | Hex | 用途 | 注意 |
|-------|-----|------|------|
| `feedback.success` | `#A3FC11` | 成功狀態 | 黑字 on 此色 |
| `feedback.error` | `#FF3C6B` | 錯誤狀態 | 小字 contrast 3.8:1，接受 tradeoff |
| `feedback.warning` | `#FFD600` | 警告狀態 | 黑字 on 此色 |

---

## Typography Tokens

### 字型配對

| 角色 | 字型 | 用途 |
|------|------|------|
| Display | **Bebas Neue** | 標題、大字、衝擊性文案 |
| Body | **DM Sans** | 正文、說明、UI 標籤 |

### Scale

| Token | 字型 | Size | Line Height | 用途 |
|-------|------|------|-------------|------|
| `display/hero` | Bebas Neue | 89.76px | 1.05 | 首頁大標、Splash |
| `display/xl` | Bebas Neue | 67.34px | 1.05 | 功能區主標題 |
| `heading/lg` | Bebas Neue | 50.52px | 1.15 | 頁面標題 |
| `heading/md` | Bebas Neue | 37.9px | 1.15 | 區塊標題 |
| `heading/sm` | Bebas Neue | 28.43px | 1.15 | 卡片標題 |
| `label/lg` | DM Sans Medium | 21.33px | 1.5 | 導覽列、按鈕文字 |
| `body/md` | DM Sans Regular | 16px | 1.5 | 正文基準 |
| `body/sm` | DM Sans Regular | 12px | 1.5 | 說明文字 |
| `caption` | DM Sans Regular | 9px | 1.4 | 時間戳、meta |

### 使用原則

**Usage：**
- Bebas Neue 全大寫使用，不要用在超過 3 行的段落
- DM Sans 負責所有可讀性要求高的地方

**Don't：**
- 不要混用兩種 display 字型
- 不要在 `caption` 尺寸用 Bebas Neue
- 不要把 `body/md` 以下的 token 用在 CTA 按鈕

---

## Design Rationale

### 為什麼選螢光黃綠作為 Primary？
Y2K 美學的核心是「過度」——螢光色在 2000 年代是科技感和未來感的象徵。`#B8FF3C` 在淺灰底上有強烈的視覺衝擊，同時對比度達到 AAA，不犧牲可讀性。

### 為什麼背景用淺灰而非黑色？
使用情境是「拍完馬上發 IG」——用戶在明亮環境下使用的機率高。淺灰背景呼應 Y2K 雜誌印刷感，螢光色在淺底上比在黑底上更有「走出螢幕」的立體感。黑底方案保留給 dark mode 或特定功能頁面（如相機取景器）。

### 為什麼 feedback.error 接受較低 contrast？
`#FF3C6B` 的電子粉紅是 Y2K 色彩語言的一部分，替換成更深的紅色會破壞整體色彩系統的一致性。我們的 error state 通常伴隨 icon 和文字說明，不依賴單一顏色傳達資訊，符合 WCAG 的「不以顏色作為唯一信息載體」原則。

### 為什麼 Display 用 Bebas Neue？
Y2K 雜誌美學的核心字型特徵是 condensed、全大寫、高衝擊力。Bebas Neue 是這個方向最乾淨、最易用的選擇，且完全免費。配合 DM Sans 的中性現代感，形成明確的視覺層次。

---

## 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0 | 2026-05 | 初始版本：色彩系統 + 字型系統建立 |
