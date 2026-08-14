import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "default" | "white";
}

export function BrandLogo({ className = "", variant = "default" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="Bravo México Inicio"
    >
      {/* Branded dark violet container for the complete white logo */}
      <div
        className={`${
          variant === "white"
            ? "bg-transparent p-0"
            : "bg-[#2E1739] px-[12px] py-[7px] rounded-[10px] shadow-xs"
        } flex items-center justify-center`}
      >
        <Image
          src="/50ac38d4-bravo-logo-blanco_105602x05601l00000o028.png"
          alt="Bravo México"
          width={112}
          height={32}
          className="object-contain w-[105px] sm:w-[112px] h-auto"
          priority
        />
      </div>
    </Link>
  );
}
