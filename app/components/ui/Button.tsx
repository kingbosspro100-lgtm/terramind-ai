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
      ? "bg-gradient-gemini text-white shadow-lg shadow-brand-purple/20 hover:brightness-110"
      : "border border-white/15 bg-white/5 text-slate-100 backdrop-blur-md hover:bg-white/10";

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