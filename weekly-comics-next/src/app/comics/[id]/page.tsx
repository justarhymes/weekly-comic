import type { Metadata } from "next";
import Link from "next/link";
import ComicImage from "@/app/components/ComicImage";
import ComicSummary from "@/app/components/ComicSummary";
import SeriesMeta from "@/app/components/SeriesMeta";
import SeriesDetails from "@/app/components/SeriesDetails";
import IssueDetails from "@/app/components/IssueDetails";
import ComicSchema from "@/app/components/ComicSchema";


export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const res = await fetch(`${API_URL}/comics/${id}`, { cache: "no-store" });
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

export default async function ComicPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const res = await fetch(`${API_URL}/comics/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch comic ${id}: ${res.statusText}`);
  }

  const comic = await res.json();
  const series = comic.series || {};

  return (
    <>
      <ComicSchema comic={comic} />
      <main className="px-8 py-12 max-w-6xl mx-auto">
        <Link href="/" className="text-rose-500 font-bold hover:underline inline-block">
          ← Back to comics
        </Link>

        <article>
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
            <div className="flex flex-col w-full lg:w-1/3">
              <ComicImage 
                src={comic.image} 
                blurDataURL={comic.blur_data_url}
                alt={`${comic.title}`} 
              />
            </div>

            <div className="flex flex-col w-full lg:w-2/3">
              {series.name && (
                <h2 className="text-2xl font-bold">{series.name}</h2>
              )}

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

            </div>
          </div>
        </article>
      </main>
    </>
  );
}
