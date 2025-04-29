"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Comic } from "@/app/types";
import ComicCard from "@/app/components/ComicCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEndOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() + (6 - day);
  const end = new Date(now.setDate(diff));
  end.setHours(23, 59, 59, 999);
  return end;
}

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [skip, setSkip] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [dotCount, setDotCount] = useState(0);
  const limit = 20;

  const skipRef = useRef(skip);
  const initialLoadingRef = useRef(initialLoading);

  useEffect(() => {
    skipRef.current = skip;
  }, [skip]);

  useEffect(() => {
    initialLoadingRef.current = initialLoading;
  }, [initialLoading]);

  const fetchMore = useCallback(async () => {
    if (initialLoadingRef.current) {
      setInitialLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const startOfWeek = getStartOfWeek();
      const endOfWeek = getEndOfWeek();

      const res = await fetch(
        `${API_URL}/comics?skip=${skipRef.current}&limit=${limit}&start_date=${startOfWeek.toISOString().slice(0, 10)}&end_date=${endOfWeek.toISOString().slice(0, 10)}`
      );
      if (!res.ok) throw new Error("Failed to fetch comics");
      const newComics: Comic[] = await res.json();

      newComics.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());

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
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loadingMore &&
        hasMore
      ) {
        fetchMore();
      }
    }, 150);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, fetchMore]);

  useEffect(() => {
    if (!initialLoading && !loadingMore) return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, [initialLoading, loadingMore]);

  return (
    <main className="flex-1 p-4 relative">
      {!initialLoading && comics.length === 0 && (
        <div className="text-center text-gray-500 text-lg mt-10">
          No comics released this week.
        </div>
      )}

      {initialLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center justify-center absolute top-0 right-0 left-0 h-full space-y-4"
          aria-hidden
        >
          <div
            className="h-12 w-12 border-4 border-t-transparent border-rose-500 rounded-full animate-spin"
            style={{ animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
          ></div>
          <motion.p
            className="text-rose-500 font-semibold text-lg animate-pulse"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Loading Comics{".".repeat(dotCount)}
          </motion.p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {comics.map((comic, index) => (
              <ComicCard
                key={`${comic.metron_id}-${comic.issue_number}`}
                comic={comic}
                priority={index < 4}
                index={index}
              />
            ))}
          </motion.div>
          {loadingMore && (
            <div className="flex justify-center items-center mt-8" aria-hidden>
              <div
                className="h-6 w-6 border-4 border-t-transparent border-rose-400 rounded-full animate-spin"
                style={{ animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
              ></div>
            </div>
          )}
        </>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {initialLoading || loadingMore ? "Loading more comics..." : !hasMore ? "No more comics to load." : ""}
      </div>
    </main>
  );
}
