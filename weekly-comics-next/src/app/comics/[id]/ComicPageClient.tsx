"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeIn } from "@/app/components/animations/sharedAnimations";
import ComicImage from "@/app/components/ComicImage";
import ComicSummary from "@/app/components/ComicSummary";
import SeriesMeta from "@/app/components/SeriesMeta";
import SeriesDetails from "@/app/components/SeriesDetails";
import IssueDetails from "@/app/components/IssueDetails";
import ComicSchema from "@/app/components/ComicSchema";
import Link from "next/link";

export default function ComicPageClient({ comic }: { comic: any }) {
  const series = comic.series || {};

  return (
    <>
      <ComicSchema comic={comic} />
      <motion.main className="px-8 py-12 max-w-6xl mx-auto" {...fadeIn()}>
        <Link href="/" className="text-rose-500 font-bold hover:underline inline-block">
          ← Back to comics
        </Link>

        <motion.article {...fadeUp(0.1)}>
          <header>
            <h1 className="text-3xl mt-5 font-bold mb-8">{comic.title}</h1>
            <SeriesMeta 
              publisher={series.publisher} 
              type={series.type} 
              genre={series.genre} 
              screenReaderOnly 
            />
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div className="flex flex-col w-full lg:w-1/3" {...fadeUp(0.2)}>
              <ComicImage 
                src={comic.image} 
                blurDataURL={comic.blur_data_url}
                alt={`${comic.title}`} 
              />
            </motion.div>

            <motion.div className="flex flex-col w-full lg:w-2/3" {...fadeUp(0.3)}>
              {series.name && <h2 className="text-2xl font-bold">{series.name}</h2>}
              <SeriesMeta 
                publisher={series.publisher} 
                type={series.type} 
                genre={series.genre} 
              />
              <ComicSummary summary={comic.summary} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <IssueDetails comic={comic} />
                <SeriesDetails series={series} />
              </div>
            </motion.div>
          </div>
        </motion.article>
      </motion.main>
    </>
  );
}
