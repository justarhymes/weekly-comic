import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Comic } from "@/app/types";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getComic(id: string): Promise<Comic | null> {
  try {
    const res = await fetch(`${API_URL}/comics/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/comics?limit=1000`);
  const comics: Comic[] = await res.json();
  return comics.map((comic) => ({ id: comic.id.toString() }));
}

export default async function ComicPage({ params }: { params: { id: string } }) {
  const comic = await getComic(params.id);
  if (!comic) return notFound();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto p-6 flex-1">
        <Link href="/" className="text-sm hover:underline text-fuchsia-500">
          ← Back to comics
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-2">{comic.title}</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {comic.image && (
            <Image
              src={comic.image}
              alt={comic.title}
              width={300}
              height={450}
              className="rounded-lg shadow-md"
            />
          )}

          <div className="flex-1 space-y-2">
            {comic.summary && <p className="text-lg leading-relaxed">{comic.summary}</p>}

            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              {comic.release_date && (
                <div>
                  <span className="font-semibold">Release Date:</span> {comic.release_date}
                </div>
              )}
              {comic.publisher && (
                <div>
                  <span className="font-semibold">Publisher:</span> {comic.publisher}
                </div>
              )}
              {comic.price && (
                <div>
                  <span className="font-semibold">Price:</span> ${comic.price.toFixed(2)}
                </div>
              )}
              {comic.rating && (
                <div>
                  <span className="font-semibold">Rating:</span> {comic.rating}
                </div>
              )}
              {comic.series_name && (
                <div>
                  <span className="font-semibold">Series:</span> {comic.series_name}
                </div>
              )}
              {comic.upc && (
                <div>
                  <span className="font-semibold">UPC:</span> {comic.upc}
                </div>
              )}
              {comic.distributor_sku && (
                <div>
                  <span className="font-semibold">SKU:</span> {comic.distributor_sku}
                </div>
              )}
              {comic.comicvine_id && (
                <div>
                  <span className="font-semibold">Comicvine ID:</span> {comic.comicvine_id}
                </div>
              )}
              {comic.metron_id && (
                <div>
                  <span className="font-semibold">Metron ID:</span> {comic.metron_id}
                </div>
              )}
              {comic.gcd_id && (
                <div>
                  <span className="font-semibold">GCD ID:</span> {comic.gcd_id}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
