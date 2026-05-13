import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({
  width = 40,
  height = 40,
  className = '',
}: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Gen-Tech logo"
      width={width}
      height={height}
      className={`logo-img ${className}`}
      priority
    />
  );
}
