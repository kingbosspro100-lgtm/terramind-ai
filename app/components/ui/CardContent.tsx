import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function CardContent({
  children,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}