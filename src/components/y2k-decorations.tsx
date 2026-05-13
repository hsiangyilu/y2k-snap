import React from "react";

type Props = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

export function StarBurst({ size = 40, className = "", strokeWidth = 2.5, style }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} style={style} aria-hidden="true">
      <line x1="20" y1="2"   x2="20" y2="38"  stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="2"  y1="20"  x2="38" y2="20"  stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="7"  y1="7"   x2="33" y2="33"  stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="33" y1="7"   x2="7"  y2="33"  stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function TriangleStar({ size = 40, className = "", strokeWidth = 2.5, style }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} style={style} aria-hidden="true">
      <polygon points="20,2 38,34 2,34"  stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="20,38 2,6 38,6"   stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Heart({ size = 40, className = "", strokeWidth = 2.5, style }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M20 35 C20 35 4 24 4 13.5 C4 8.5 8 5 13 5 C16.5 5 19 7.5 20 9.5 C21 7.5 23.5 5 27 5 C32 5 36 8.5 36 13.5 C36 24 20 35 20 35Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MiniCross({ size = 24, className = "", strokeWidth = 2, style }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <line x1="12" y1="2"  x2="12" y2="22" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="2"  y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="5"  y1="5"  x2="19" y2="19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="19" y1="5"  x2="5"  y2="19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
