# AI 開發工具對照表 — gstack × Impeccable

> 最後更新：2026-06-16（gstack 0.8.2 / Impeccable 0.8.x）
> 兩個工具都快速迭代，版本落差超過一個月就建議對照官方 repo 更新。

---

## 概覽

| 工具 | 作者 | 定位 | 類比 |
|------|------|------|------|
| **gstack** | Garry Tan | 完整開發流程指揮中心 | Figma 的 plugin 生態 + Notion 的 project hub |
| **Impeccable** | Paul Bakaus | 設計品質稽核 + AI slop 偵測 | Figma 的 Lint 外掛 + Zeplin 的 token checker |

---

## Impeccable

### 安裝

```bash
# 新版（推薦）：為你的工具編譯的專屬版本
npx impeccable install

# 舊版（仍可用，但裝通用版）
npx skills add pbakaus/impeccable
```

### 初始化設定

```bash
# 新版：/impeccable init
# 會寫出 PRODUCT.md（產品脈絡）並提供 DESIGN.md 模板
/impeccable init

# 舊版（已棄用）
/teach-impeccable   # ← 用 .impeccable.md，現在改成 PRODUCT.md
```

### 指令語法（重要改動）

舊版的 `/polish`、`/audit` 是獨立指令；**新版全部走 `/impeccable <skill>`**。

| 舊指令 | 新指令 | 功能 |
|--------|--------|------|
| `/audit` | `/impeccable audit` | 全面稽核：間距、對比、結構 |
| `/polish` | `/impeccable polish` | 細節打磨：視覺、文案 |
| `/critique` | `/impeccable critique` | 設計評論：策略層批評 |

**釘選常用指令（捷徑）：**

```bash
# 把 audit 釘成 /audit 快捷鍵（類比 Figma 設快捷鍵）
/impeccable pin audit
```

釘選後直接打 `/audit` 就會觸發 `/impeccable audit`。

### Detector CLI（新功能）

```bash
# 掃資料夾
npx impeccable detect ./src

# 掃 HTML 檔
npx impeccable detect index.html

# 掃網址
npx impeccable detect https://your-staging-url.vercel.app
```

內建 41 條規則，自動抓兩類問題：

- **AI slop**：側邊框、紫漸層、bounce easing、暗光暈
- **設計問題**：行長過長、padding 過擠、觸控目標太小

可掛進 CI pipeline，Y2K Snap 用來抓「AI 味」非常適合。

### Chrome Extension

安裝後可以在任何網頁（staging / 競品）直接疊 detector overlay，不用跑指令。

---

## gstack

### 安裝

```bash
npx skills add garry/gstack
```

### 階段流程（設計師類比）

```
構思 → 規格 → 計劃 → 開發 → 品質 → 發佈
```

| 階段 | 指令 | 類比 |
|------|------|------|
| 構思 | `/office-hours` | 像找設計 mentor 討論方向 |
| 規格 | `/spec` | 像 Figma 開一個新 Frame 定邊界 |
| 計劃 | `/autoplan` | 像 Notion project 自動展開 sprint |
| 開發 | `/context-restore` | 像 Figma 的版本歷史，接回中斷點 |
| 品質 | `/qa` `/design-review` | 像 Figma 的 Inspect + 跑在 staging |
| 發佈 | `/ship` | 像 Figma → Handoff，自動帶文件 |

### 指令完整清單

#### 構思 / 規格

```bash
/office-hours       # 顧問對話：討論方向、評估可行性
/spec               # 把模糊想法分 5 階段變精確規格
                    #  → 開 GitHub issue，可選擇直接 spawn agent 在新 worktree
```

#### 計劃

```bash
/autoplan           # 自動跑 CEO → design → eng review 完整流程
                    #  → 只把需要品味判斷的決策丟給你拍板
/plan               # 手動規劃（不含自動 review）
```

#### 開發

```bash
/context-restore    # 讀回上一台機器 / 上一個 session 的進度
/investigate        # 深挖指定模組（會自動 freeze 正在查的模組）
```

#### 品質

```bash
/qa                 # 品質檢查（現在一律開瀏覽器）
/design-review      # 設計 review（舊名 /qa-design-review）
```

#### 發佈

```bash
/ship               # 發佈流程（現在自動跑 /document-release，不用手動更新文件）
/document-generate  # 從零生成文件（補 /document-release 的洞）
/document-release   # 更新 release notes
```

#### GBrain（跨 session 長期記憶）

```bash
/setup-gbrain       # 初始化：選存儲方式、設 remote repo、設 policy
/sync-gbrain        # 同步記憶庫到 remote
```

類比：像 Figma 的 team library，但存的是「這個專案的決策與教訓」。越用越懂你的 codebase pattern 和踩過的坑。

#### 瀏覽器連線

```bash
/open-gstack-browser    # 開啟 gstack 瀏覽器（舊名 /connect-chrome）
```

### 指令重新命名對照（舊 → 新）

| 舊指令 | 新指令 | 備注 |
|--------|--------|------|
| `/qa-design-review` | `/design-review` | |
| `/connect-chrome` | `/open-gstack-browser` | |

### 行為改變（同名但行為不同）

| 指令 | 舊行為 | 新行為 |
|------|--------|--------|
| `/qa` | 不一定開瀏覽器 | 現在一律開瀏覽器 |
| `/ship` | 手動更新文件 | 自動跑 `/document-release` |
| `/investigate` | 一般查詢 | 自動 freeze 正在查的模組 |

### 對 Y2K Snap 用不到的指令

可略過：`/plan-devex-review`、`/devex-review`（開發者體驗）、`/ios-qa` 等 iOS 系列、`/pair-agent`（跨 AI 協作）。

---

## y2k-snap 推薦工作流

```bash
# 開新功能
/spec                   # 想清楚再動手
/autoplan               # 讓 AI 跑一遍 review，只問你品味判斷

# 開發中
/context-restore        # 換機器 / 隔天接續
/investigate            # 卡住時深挖

# 上線前
/qa                     # 開瀏覽器跑品質檢查
/impeccable audit       # 設計稽核
npx impeccable detect ./src    # 掃 AI slop

# 發佈
/ship                   # 自動帶文件
/sync-gbrain            # 把這次的經驗存進記憶庫
```

---

## Impeccable 對 Y2K Snap 的應用提示

這個專案刻意跳脫「AI 味」設計（見 PRODUCT.md anti-references），Impeccable detector 的 41 條規則正好當守門員：

- 抓側邊框 → Y2K Snap 的邊框是相機邊框特效，不是 AI 的 card shadow
- 抓紫漸層 → 我們的 `accent.default #9B5DFF` 是純色，不是漸層
- 抓 bounce easing → 動畫用電子感的 linear 或 ease-out，不用 spring

建議把 `npx impeccable detect ./src` 掛進 PR checklist 或 CI。
