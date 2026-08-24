import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className,
  ...props
}: Props) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3",
        "text-slate-900 placeholder:text-slate-400",
        "outline-none transition-all duration-300",
        "focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
        className
      )}
    />
  );
}