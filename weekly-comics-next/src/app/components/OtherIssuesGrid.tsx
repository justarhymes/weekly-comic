"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/app/components/animations/sharedAnimations";

interface Comic {
  id: number;
  title: string;
  image: string;
  slug: string;
}

interface OtherIssuesGridProps {
  seriesName: string;
  seriesSlug: string;
  startYear: number;
  comicId: number;
}

export default function OtherIssuesGrid({ seriesName, seriesSlug, startYear, comicId }: OtherIssuesGridProps) {
  const [issues, setIssues] = useState<Comic[]>([]);

  useEffect(() => {
    let didCancel = false;

    async function fetchIssues() {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/comics/series/${encodeURIComponent(seriesSlug)}/${startYear}`);
      if (res.ok && !didCancel) {
        const data = await res.json();
        const filtered = data.filter((issue: Comic) => issue.id !== comicId);
        setIssues(filtered);
      }
    }

    fetchIssues();

    return () => {
      didCancel = true;
    };
  }, [seriesSlug, startYear, comicId]);

  if (issues.length === 0) return null;

  const limitedIssues = issues.slice(0, 4);
  const showMoreLink = issues.length > 4;

  return (
    <motion.section {...fadeUp(0.5)} className="mt-4 p-4 bg-teal-400">
      <h3 className="text-l font-bold text-teal-50 mb-2">More Issues in {seriesName}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {limitedIssues.map((issue) => (
          <Link key={issue.id} href={`/comics/${issue.slug}`} className="block group">
            <div className="relative w-full aspect-[2/3] overflow-hidden shadow-[3px_3px_0px_0px] shadow-rose-500">
              <Image
                src={issue.image}
                alt={issue.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <p className="mt-2 text-center text-sm text-rose-100 font-medium group-hover:text-rose-500 transition-colors">
              {issue.title}
            </p>
          </Link>
        ))}
      </div>
      {showMoreLink && (
        <div className="flex justify-end mt-4">
          <Link href={`/series/${seriesSlug}/${startYear}`} className="text-sm font-semibold text-rose-50 hover:underline">
            More Issues →
          </Link>
        </div>
      )}
    </motion.section>
  );
}
