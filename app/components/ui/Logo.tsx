import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({
  width = 40,
  height = 40,
}: LogoProps) {
  return (
    <Image
  src="/icon.png"
      alt="TerraMind AI"
      width={width}
      height={height}
      priority
      style={{
        width: "auto",
        height: "auto",
      }}
    />
  );
}