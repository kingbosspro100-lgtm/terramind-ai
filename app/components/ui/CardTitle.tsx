import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function CardTitle({
  children,
  className = "",
}: Props) {
  return (
    <h2
      className={`text-2xl font-bold tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
}