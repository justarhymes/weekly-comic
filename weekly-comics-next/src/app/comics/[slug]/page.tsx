import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComicPageClient from "./ComicPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const res = await fetch(`${API_URL}/comics/${slug}`, { cache: "no-store" });
  const comic = await res.json();

  return {
    title: `${comic.title} | Weekly Comics`,
    description: comic.summary?.slice(0, 150) || `Details for ${comic.title}`,
    openGraph: {
      title: comic.title,
      description: comic.summary?.slice(0, 150),
      images: comic.image ? [{ url: comic.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: comic.title,
      description: comic.summary?.slice(0, 150),
      images: comic.image ? [comic.image] : undefined,
    },
  };
}

export default async function ComicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const res = await fetch(`${API_URL}/comics/${slug}`, { cache: "no-store" });

  if (res.status === 404) {
    return notFound();
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch comic ${slug}: ${res.statusText}`);
  }

  const comic = await res.json();
  return <ComicPageClient comic={comic} />;
}
