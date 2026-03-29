"use client";

import { Image as IKImage } from "@imagekit/next";
import NextImage from "next/image";

interface IKProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  transformation?: Array<Record<string, string | number>>;
}

/**
 * Renders product images using ImageKit when the URL is from ImageKit,
 * falls back to next/image for other sources (e.g. local /public images).
 */
export default function IKProductImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
  transformation,
}: IKProductImageProps) {
  const isImageKit = src?.includes("imagekit.io");

  if (isImageKit) {
    // For fill mode, we still need width/height for IK transformations
    // but the container handles actual sizing
    if (fill) {
      return (
        <div className="relative w-full h-full">
          <IKImage
            src={src}
            alt={alt}
            fill={true}
            className={className}
            priority={priority}
            sizes={sizes}
            transformation={transformation || [{ quality: "80", f: "auto" }]}
          />
        </div>
      );
    }

    return (
      <IKImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
        transformation={transformation || [{ quality: "80", f: "auto" }]}
      />
    );
  }

  // Fallback to next/image for non-ImageKit URLs
  if (fill) {
    return (
      <NextImage
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width || 300}
      height={height || 300}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
