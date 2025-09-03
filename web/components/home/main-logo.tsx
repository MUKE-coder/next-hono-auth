import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MainLogoProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  href?: string;
  className?: string;
  priority?: boolean;
  showText?: boolean;
  text?: string;
  variant?: "default" | "compact" | "text-only";
}

export default function MainLogo({
  src = "/logo.png",
  alt = "Logo",
  width = 60,
  height = 60,
  href = "/",
  className = "",
  priority = false,
  showText = true,
  text = "Logo",
  variant = "default",
}: MainLogoProps) {
  const logoImage = (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );

  const logoContent = () => {
    switch (variant) {
      case "compact":
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">{logoImage}</div>
            {showText && (
              <span className="font-bold text-lg text-red-600">Logo</span>
            )}
          </div>
        );

      case "text-only":
        return (
          <div className="flex flex-col items-center">
            <span className="font-bold text-xl text-red-600">Logo</span>
            <span className="text-xs text-gray-600 text-center leading-tight">
              My Logo &<br />
              Goes Here
            </span>
          </div>
        );

      default:
        return (
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">{logoImage}</div>
            {showText && (
              <div className="flex flex-col">
                <span className="font-bold text-xl text-red-600 leading-tight">
                  {text}
                </span>
                <span className="text-xs text-gray-600 leading-tight">
                  My Beatuful Tagline here
                </span>
              </div>
            )}
          </div>
        );
    }
  };

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-sm transition-opacity duration-200"
        aria-label={`${alt} - Go to homepage`}
      >
        {logoContent()}
      </Link>
    );
  }

  return logoContent();
}
