import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";
import { Comic } from "@/app/types";
import { formatPrice } from "@/app/utils/formatPrice";

interface ComicCardProps {
  comic: Comic;
  priority?: boolean;
  index: number;
}

export default function ComicCard({ comic, priority = false, index = 0 }: ComicCardProps) {
  const hasData = comic && comic.title && comic.image;
  const titleId = `comic-${comic.id}`;
  const priceId = `comic-price-${comic.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.05,
      }}
    >
      {hasData ? (
        <Link 
          href={`/comics/${comic.slug}`}
          aria-labelledby={titleId}
          aria-describedby={priceId}
          className="focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500 block"
          title={`View details for ${comic.title}`}
        >
          <article className="group transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
            {comic.image ? (
              <Image
                src={comic.image}
                alt={`Cover of ${comic.title}` || "Comic Cover"}
                width={300}
                height={450}
                className="w-full h-auto object-cover transition duration-200 group-hover:opacity-90"
                placeholder={comic.blur_data_url ? "blur" : "empty"}
                blurDataURL={comic.blur_data_url}
                priority={priority}
              />
            ) : (
              <Skeleton height={450} />
            )}
            <div className="bg-rose-500 p-2 transition-colors duration-200 group-hover:bg-rose-400">
              <h3 
                id={titleId}
                className="font-semibold text-sm line-clamp-1 text-white group-hover:text-rose-950 transition-colors duration-200"
              >
                {comic.title}
              </h3>
              <p 
                id={priceId}
                className="text-rose-950 font-bold"
              >
                {formatPrice(comic)}
              </p>
            </div>
          </article>
        </Link>
      ) : (
        <>
          <Skeleton height={450} />
          <div className="p-2">
            <Skeleton count={2} />
          </div>
        </>
      )}
    </motion.div>
  );
}
