# 換電腦接續開發 — 完整步驟

照順序做，從上到下。

---

## 1. 裝基礎工具（新電腦如果沒有）

```bash
# Homebrew（如果沒裝）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# gh CLI（開 PR 用）
brew install gh
gh auth login          # 選 GitHub.com → HTTPS → Yes → Login with a web browser

# Node.js（專案需要）
brew install node
```

---

## 2. 拉專案程式

```bash
git clone https://github.com/hsiangyilu/y2k-snap.git
cd y2k-snap
git checkout feat/filter-panel-empty-state   # 接續開發的分支（PR #2）
npm install                                   # 會裝回 heic2any 等套件
npm run dev                                    # 確認跑得起來
```

---

## 3. 恢復跨機記憶（關鍵）

```bash
# 3a. 從舊電腦把這個檔案傳到新電腦的 home 目錄
#     （AirDrop / 雲端 / scp 都行）
~/.gstack-brain-remote.txt

# 3b. 在新電腦跑（clone brain repo、拉回所有 context-save 進度）
gstack-brain-restore
```

Brain repo：`https://github.com/hsiangyilu/gstack-brain.git`（私人）

---

## 4. 在新電腦重建 gbrain

```bash
/setup-gbrain
```

選一樣的設定：
- 路徑 → **本機 + GitHub 同步（PGLite）**
- remote → `https://github.com/hsiangyilu/gstack-brain.git`
- y2k-snap repo policy → **read-write**
- 同步範圍 → **artifacts-only**

> gbrain 本身是每台機器各自的本機庫，所以新機要重跑一次 `/setup-gbrain`。
> 記憶內容已透過步驟 3 的 git 同步過去。

---

## 5. 接續開發

跟 Claude Code 說 `/context-restore`，它會讀回上一台機器存的進度，立刻接上。

---

## 懶人版（新電腦已有 Homebrew + gh + node）

```bash
# 1. 傳 ~/.gstack-brain-remote.txt 過去，然後：
gstack-brain-restore
# 2. 拉程式
git clone https://github.com/hsiangyilu/y2k-snap.git && cd y2k-snap
git checkout feat/filter-panel-empty-state && npm install && npm run dev
# 3. 重建本機 gbrain
/setup-gbrain
# 4. 跟 Claude Code 說 /context-restore
```

---

## 專案常用指令

| 指令 | 作用 |
|------|------|
| `npm run dev` | 啟動開發伺服器（http://localhost:3000） |
| `npm run build` | production build |
| `npm run lint` | ESLint 檢查 |
| `npx tsc --noEmit` | TypeScript 型別檢查 |
