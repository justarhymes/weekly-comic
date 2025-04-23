import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Comic } from "@/app/types";

interface ComicCardProps {
  comic: Comic;
}

export default function ComicCard({ comic }: ComicCardProps) {
  const hasData = comic && comic.title && comic.price !== null;

  return (
    <div className="border border-foreground/10 rounded-lg overflow-hidden shadow-sm">
      {hasData ? (
        <Link href={`/comics/${comic.id}`}>
          <div>
            {comic.image ? (
              <Image
                src={comic.image}
                alt={comic.title}
                width={300}
                height={450}
                className="w-full h-auto object-cover"
              />
            ) : (
              <Skeleton height={450} />
            )}
            <div className="p-2">
              <h3 className="font-semibold text-sm line-clamp-2">
                {comic.title}
              </h3>
              { comic.price ? (
                <p className="text-xs text-gray-500">${comic.price?.toFixed(2)}</p>
              ) : "" }
            </div>
          </div>
        </Link>
      ) : (
        <>
          <Skeleton height={450} />
          <div className="p-2">
            <Skeleton count={2} />
          </div>
        </>
      )}
    </div>
  );
}