import type { Metadata } from "next";
import { Comic } from "@/app/types";
import SeriesPageClient from "./SeriesPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; year: string }>;
}): Promise<Metadata> {
  const { slug, year } = await params;

  return {
    title: `${slug.replace(/-/g, " ")} (${year}) | Weekly Comics`,
    description: `Browse all issues of ${slug.replace(/-/g, " ")} (${year}) released this year.`,
    openGraph: {
      title: `${slug.replace(/-/g, " ")} (${year}) | Weekly Comics`,
      description: `Browse all issues of ${slug.replace(/-/g, " ")} (${year}) released this year.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug.replace(/-/g, " ")} (${year}) | Weekly Comics`,
      description: `Browse all issues of ${slug.replace(/-/g, " ")} (${year}) released this year.`,
    },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string; year: string }>;
}) {
  const { slug, year } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${API_URL}/comics/series/${slug}/${year}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch series comics");
    }

    const comics: Comic[] = await res.json();
    const seriesName = comics[0]?.series?.name || slug.replace(/-/g, " ");

    return <SeriesPageClient comics={comics} seriesName={seriesName} year={year} />;
  } catch (error) {
    console.error("Error fetching series comics:", error);
    return <SeriesPageClient comics={[]} seriesName={slug.replace(/-/g, " ")} year={year} />;
  }
}
