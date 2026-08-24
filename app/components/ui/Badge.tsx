import { ReactNode } from "react";

type Variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "ai"
  | "finance"
  | "stock"
  | "weather"
  | "default";

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default:
      "bg-slate-100 text-slate-700 border border-slate-200",

    success:
      "bg-emerald-100 text-emerald-700 border border-emerald-200",

    warning:
      "bg-amber-100 text-amber-700 border border-amber-200",

    danger:
      "bg-red-100 text-red-700 border border-red-200",

    info:
      "bg-sky-100 text-sky-700 border border-sky-200",

    ai:
      "bg-violet-100 text-violet-700 border border-violet-200",

    finance:
      "bg-green-100 text-green-700 border border-green-200",

    stock:
      "bg-orange-100 text-orange-700 border border-orange-200",

    weather:
      "bg-cyan-100 text-cyan-700 border border-cyan-200",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        tracking-wide
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}