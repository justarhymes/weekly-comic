// src/app/comics/[id]/page.tsx

import { Comic } from "@/app/types";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ComicPage({ params }: PageProps) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comics/${params.id}`);
  if (!res.ok) {
    throw new Error("Comic not found");
  }

  const comic: Comic = await res.json();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {comic.image ? (
            <Image
              src={comic.image}
              alt={comic.title}
              width={500}
              height={750}
              className="w-full h-auto object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-[750px] bg-gray-200 rounded-xl" />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-4">{comic.title}</h1>
            <p className="text-sm text-gray-500 mb-1">{comic.series_name}</p>
            <p className="text-lg font-semibold text-emerald-600 mb-4">${comic.price?.toFixed(2)}</p>
            <div className="space-y-2 text-sm">
              {comic.summary && <p>{comic.summary}</p>}
              {comic.publisher && <p><strong>Publisher:</strong> {comic.publisher}</p>}
              {comic.release_date && <p><strong>Release Date:</strong> {comic.release_date}</p>}
              {comic.issue_number && <p><strong>Issue #:</strong> {comic.issue_number}</p>}
              {comic.upc && <p><strong>UPC:</strong> {comic.upc}</p>}
              {comic.distributor_sku && <p><strong>SKU:</strong> {comic.distributor_sku}</p>}
              {comic.rating && <p><strong>Rating:</strong> {comic.rating}</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
