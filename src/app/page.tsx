import Link from "next/link";
import { StarBurst, TriangleStar, Heart, MiniCross } from "@/components/y2k-decorations";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-bg-surface min-h-dvh">

      {/* Y2K 裝飾物 */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

        {/* 左上 */}
        <TriangleStar
          size={60}
          className="absolute text-brand animate-float top-[10%] left-[6%]"
          style={{ animationDelay: "0s" } as React.CSSProperties}
        />
        <StarBurst
          size={34}
          className="absolute text-content-primary animate-float-alt top-[32%] left-[4%]"
          style={{ animationDelay: "0.7s" } as React.CSSProperties}
        />

        {/* 上方中間 */}
        <MiniCross
          size={28}
          className="absolute text-accent animate-float top-[5%] left-[44%]"
          style={{ animationDelay: "1.1s" } as React.CSSProperties}
        />

        {/* 右上 */}
        <Heart
          size={50}
          className="absolute text-brand animate-float-alt top-[7%] right-[8%]"
          style={{ animationDelay: "0.3s" } as React.CSSProperties}
        />
        <MiniCross
          size={26}
          className="absolute text-accent animate-float top-[22%] right-[6%]"
          style={{ animationDelay: "1.6s" } as React.CSSProperties}
        />

        {/* 中右 */}
        <StarBurst
          size={54}
          className="absolute text-accent animate-float-alt top-[46%] right-[4%]"
          style={{ animationDelay: "0.9s" } as React.CSSProperties}
        />

        {/* 中左 */}
        <Heart
          size={36}
          className="absolute text-accent animate-float top-[54%] left-[4%]"
          style={{ animationDelay: "0.5s" } as React.CSSProperties}
        />

        {/* 左下 */}
        <TriangleStar
          size={46}
          className="absolute text-content-primary animate-float-alt bottom-[14%] left-[7%]"
          style={{ animationDelay: "1.3s" } as React.CSSProperties}
        />

        {/* 右下 */}
        <Heart
          size={42}
          className="absolute text-brand animate-float bottom-[12%] right-[8%]"
          style={{ animationDelay: "0.4s" } as React.CSSProperties}
        />
        <StarBurst
          size={30}
          className="absolute text-accent animate-float-alt bottom-[7%] right-[30%]"
          style={{ animationDelay: "2s" } as React.CSSProperties}
        />

      </div>

      {/* 主內容 */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        <h1 className="font-display text-display-hero text-content-primary leading-none tracking-widest">
          SNAP SNAP
        </h1>
        <p className="text-body-md text-content-secondary max-w-xs">
          上傳照片，編輯排版
        </p>
        <Link
          href="/editor"
          className="mt-2 inline-flex h-14 items-center justify-center rounded-full bg-brand px-10 text-label-lg font-body font-semibold text-content-on-brand transition-colors hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="開始使用 Y2K Snap"
        >
          START
        </Link>
      </div>

    </main>
  );
}
