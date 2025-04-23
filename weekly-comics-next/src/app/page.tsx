"use client";

import { useEffect, useState } from "react";
import { Comic } from "@/app/types";
import ComicCard from "@/app/components/ComicCard";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const limit = 20;

  useEffect(() => {
    fetchMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [loading, hasMore]);

  async function fetchMore() {
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {comics.map((comic) => (
            <ComicCard key={`${comic.metron_id}-${comic.issue_number}`} comic={comic} />
          ))}
        </div>
        {loading && (
          <div className="mt-8 flex justify-center" aria-hidden>
            <div className="h-6 w-6 border-2 border-t-transparent border-foreground rounded-full animate-spin"></div>
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {loading ? "Loading more comics..." : !hasMore ? "No more comics to load." : ""}
        </p>
      </main>
      <Footer />
    </div>
  );
}
