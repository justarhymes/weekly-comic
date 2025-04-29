import Image from "next/image";

interface ComicImageProps {
  src?: string;
  alt: string;
  blurDataURL?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function ComicImage({
  src,
  alt,
  blurDataURL,
  className = "",
  width = 600,
  height = 900,
}: ComicImageProps) {
  if (!src) return null;

  return (
    <figure className="w-full">
      <Image
        src={src}
        alt={alt || "Comic Cover"}
        width={width}
        height={height}
        className={`w-full h-auto object-cover shadow-[5px_5px_0px_0px] shadow-teal-400 ${className}`}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        priority
      />
    </figure>
  );
}
