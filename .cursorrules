# y2k-snap

## Project overview
照片編輯排版工具

## Tech stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deploy:** Vercel

## Code conventions
- 元件用 PascalCase 命名（例如 UserCard, NavBar）
- 檔案用 kebab-case 命名（例如 user-card.tsx）
- 功能模組放在 src/features/ 下
- 共用元件放在 src/components/
- 工具函式放在 src/lib/
- 使用 Tailwind utility classes，不寫自定義 CSS
- 中文註解，英文變數名

## Project structure
```
src/
├── app/                    # Next.js 頁面
│   ├── page.tsx            # 首頁
│   └── layout.tsx          # 全域 layout
├── features/               # 功能模組
├── components/             # 共用 UI 元件
├── assets/                 # 靜態素材
└── lib/                    # 工具函式
```

## Key behaviors
- 所有互動元素需要有 hover 和 focus 狀態
- 頁面切換使用 Next.js Link 元件
- 表單送出要有 loading 和 error 狀態
- Mobile-first 設計

## Do NOT
- 不要用 inline style，全部用 Tailwind
- 不要安裝不必要的套件，保持 dependencies 精簡
- 不要把 API key 寫在程式碼裡
- 不要忽略 TypeScript 的型別錯誤
- 不要用 alert() 或 confirm()，用自定義 Modal

## Quality standards
- Lighthouse 分數 > 90
- 元件要有基本的無障礙標籤（aria-label）

## References
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
