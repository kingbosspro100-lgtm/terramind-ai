import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function CardFooter({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`mt-8 flex items-center justify-between ${className}`}
    >
      {children}
    </div>
  );
}