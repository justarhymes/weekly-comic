import { Comic } from "@/app/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default async function ComicPage({ params }: { params: { id: string } }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const res = await fetch(`${API_URL}/comics/${params.id}`);
  if (!res.ok) return notFound();

  const comic: Comic = await res.json();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-sm text-blue-500 hover:underline">← Back to comics</Link>
        </div>
        <div className="mb-4">
          {comic.image && (
            <img
              src={comic.image}
              alt={comic.title}
              className="w-full rounded-lg shadow-md mb-4"
            />
          )}
          <h1 className="text-2xl font-bold mb-2">{comic.title}</h1>
          {comic.price && <p className="text-lg">${comic.price.toFixed(2)}</p>}
          {comic.summary && <p className="mt-4 text-sm text-gray-700">{comic.summary}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
