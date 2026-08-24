import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: "primary" | "outline";
}

export default function Button({
  children,
  leftIcon,
  rightIcon,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const styles =
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold transition ${styles} ${className}`}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}