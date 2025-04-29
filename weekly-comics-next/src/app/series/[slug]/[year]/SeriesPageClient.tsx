"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/app/components/animations/sharedAnimations";
import { Comic } from "@/app/types";
import ComicCard from "@/app/components/ComicCard";
import SeriesMeta from "@/app/components/SeriesMeta";
import SeriesSchema from "@/app/components/SeriesSchema";

interface SeriesPageClientProps {
  comics: Comic[];
  seriesName: string;
  year: string;
}

export default function SeriesPageClient({ comics, seriesName, year }: SeriesPageClientProps) {
  const series = comics[0]?.series;

  return (
    <motion.main className="max-w-6xl mx-auto p-4" {...fadeIn()}>
      {series && <SeriesSchema series={series} />}

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{seriesName} ({year})</h1>
        {series && (
          <SeriesMeta
            publisher={series.publisher}
            type={series.type}
            genre={series.genre}
          />
        )}
      </header>

      {comics.length === 0 ? (
        <p className="text-gray-500 text-center">No comics found for this series.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {comics.map((comic, index) => (
            <ComicCard key={`${comic.metron_id}-${comic.issue_number}`} comic={comic} index={index} />
          ))}
        </div>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {comics.length === 0 ? "No comics available." : "Comics loaded."}
      </div>
    </motion.main>
  );
}
