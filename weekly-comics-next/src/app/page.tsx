"use client";

import { useEffect, useState, useCallback } from "react";
import { Comic } from "@/app/types";
import ComicCard from "@/app/components/ComicCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/comics?skip=${skip}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch comics");
      const newComics: Comic[] = await res.json();
      if (newComics.length === 0) {
        setHasMore(false);
      } else {
        setComics((prev) => {
          const combined = [...prev, ...newComics];
          const uniqueMap = new Map();
          for (const comic of combined) {
            const key = `${comic.metron_id}-${comic.issue_number}`;
            if (!uniqueMap.has(key)) uniqueMap.set(key, comic);
          }
          return Array.from(uniqueMap.values());
        });
        setSkip((prev) => prev + limit);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [skip]);

  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        fetchMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, fetchMore]);

  return (
    <main className="flex-1 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {comics.map((comic, index) => (
          <ComicCard 
            key={`${comic.metron_id}-${comic.issue_number}`} 
            comic={comic}
            priority={index < 4}
          />
        ))}
      </div>
      {loading && (
        <div className="mt-8 flex justify-center" aria-hidden>
          <div className="h-6 w-6 border-2 border-t-transparent border-foreground rounded-full animate-spin"></div>
        </div>
      )}
      <div role="status" aria-live="polite" className="sr-only">
        {loading ? "Loading more comics..." : !hasMore ? "No more comics to load." : ""}
      </div>
    </main>
  )
}
