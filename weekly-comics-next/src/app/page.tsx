import Link from "next/link";
import Image from "next/image";
import { Comic } from "@/app/types";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getComics(): Promise<Comic[]> {
  const res = await fetch(`${API_URL}/comics?limit=100`, {
    next: { revalidate: 60 }, // cache for 60s
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const comics = await getComics();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-6xl mx-auto p-6 flex-1 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Weekly Comic Releases</h1>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {comics.map((comic) => {
            const hasData = comic.image && comic.title && comic.price !== null;

            return (
              <Link
                key={comic.id}
                href={`/comics/${comic.id}`}
                className="group block border border-foreground/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                {hasData ? (
                  <>
                    <Image
                      src={comic.image!}
                      alt={comic.title!}
                      width={300}
                      height={450}
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-2">
                      <h2 className="text-sm font-medium group-hover:text-fuchsia-500">
                        {comic.title}
                      </h2>
                      <p className="text-xs text-muted">
                        ${comic.price!.toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Skeleton height={450} />
                    <div className="p-2">
                      <Skeleton count={2} />
                    </div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
