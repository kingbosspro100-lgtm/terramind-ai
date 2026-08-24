import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function CardHeader({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`mb-6 flex items-center justify-between ${className}`}
    >
      {children}
    </div>
  );
}