import Link from "next/link";
import { FiveStar, StarBurst, Heart, MiniCross } from "@/components/y2k-decorations";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-bg-surface min-h-dvh">

      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

        {/* 左上 */}
        <FiveStar size={52} className="absolute text-brand animate-float top-[6%] left-[5%]" style={{ animationDelay: "0s" } as React.CSSProperties} />
        <FiveStar size={28} className="absolute text-accent animate-float-alt top-[18%] left-[12%]" style={{ animationDelay: "0.5s" } as React.CSSProperties} />
        <StarBurst size={30} className="absolute text-content-primary animate-float-alt top-[30%] left-[4%]" style={{ animationDelay: "0.7s" } as React.CSSProperties} />
        <FiveStar size={20} className="absolute text-brand animate-float top-[42%] left-[8%]" style={{ animationDelay: "1.4s" } as React.CSSProperties} />

        {/* 上方中間 */}
        <MiniCross size={26} className="absolute text-accent animate-float top-[4%] left-[38%]" style={{ animationDelay: "1.1s" } as React.CSSProperties} />
        <FiveStar size={22} className="absolute text-brand animate-float-alt top-[10%] left-[55%]" style={{ animationDelay: "0.3s" } as React.CSSProperties} />
        <FiveStar size={16} className="absolute text-accent animate-float top-[20%] left-[46%]" style={{ animationDelay: "1.8s" } as React.CSSProperties} />

        {/* 右上 */}
        <Heart size={44} className="absolute text-brand animate-float-alt top-[6%] right-[7%]" style={{ animationDelay: "0.3s" } as React.CSSProperties} />
        <FiveStar size={34} className="absolute text-accent animate-float top-[14%] right-[16%]" style={{ animationDelay: "0.9s" } as React.CSSProperties} />
        <MiniCross size={22} className="absolute text-accent animate-float top-[24%] right-[5%]" style={{ animationDelay: "1.6s" } as React.CSSProperties} />
        <FiveStar size={20} className="absolute text-brand animate-float-alt top-[34%] right-[12%]" style={{ animationDelay: "0.6s" } as React.CSSProperties} />

        {/* 中右 */}
        <StarBurst size={48} className="absolute text-accent animate-float-alt top-[46%] right-[3%]" style={{ animationDelay: "0.9s" } as React.CSSProperties} />
        <FiveStar size={24} className="absolute text-brand animate-float top-[58%] right-[10%]" style={{ animationDelay: "1.2s" } as React.CSSProperties} />

        {/* 中左 */}
        <Heart size={32} className="absolute text-accent animate-float top-[52%] left-[3%]" style={{ animationDelay: "0.5s" } as React.CSSProperties} />
        <FiveStar size={18} className="absolute text-brand animate-float-alt top-[62%] left-[10%]" style={{ animationDelay: "2.1s" } as React.CSSProperties} />

        {/* 左下 */}
        <FiveStar size={44} className="absolute text-content-primary animate-float-alt bottom-[16%] left-[6%]" style={{ animationDelay: "1.3s" } as React.CSSProperties} />
        <FiveStar size={22} className="absolute text-accent animate-float bottom-[6%] left-[16%]" style={{ animationDelay: "0.8s" } as React.CSSProperties} />

        {/* 右下 */}
        <Heart size={38} className="absolute text-brand animate-float bottom-[14%] right-[7%]" style={{ animationDelay: "0.4s" } as React.CSSProperties} />
        <FiveStar size={28} className="absolute text-accent animate-float-alt bottom-[5%] right-[28%]" style={{ animationDelay: "2s" } as React.CSSProperties} />
        <FiveStar size={18} className="absolute text-brand animate-float bottom-[22%] right-[20%]" style={{ animationDelay: "1.5s" } as React.CSSProperties} />

        {/* 下方中間 */}
        <MiniCross size={20} className="absolute text-accent animate-float-alt bottom-[8%] left-[42%]" style={{ animationDelay: "1.0s" } as React.CSSProperties} />
        <FiveStar size={16} className="absolute text-brand animate-float bottom-[18%] left-[52%]" style={{ animationDelay: "0.2s" } as React.CSSProperties} />

      </div>

      {/* 主內容 */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        <h1 className="font-display text-display-hero text-content-primary leading-none tracking-widest">
          SNAP SNAP
        </h1>
        <p className="text-body-md text-content-secondary max-w-xs">
          Upload a photo, edit &amp; style it
        </p>
        <Link
          href="/editor"
          className="mt-2 inline-flex h-14 items-center justify-center rounded-full bg-brand px-10 text-label-lg font-body font-semibold text-content-on-brand transition-colors hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Start using Y2K Snap"
        >
          START
        </Link>
      </div>

    </main>
  );
}
