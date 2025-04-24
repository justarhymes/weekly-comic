import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  return {
    title: `Comic #${id} | Weekly Comics`,
    description: `Details about comic ${id}`,
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
      <main className="px-8 py-12 max-w-6xl mx-auto">
        <Link href="/" className="text-rose-500 font-bold hover:underline inline-block">
          ← Back to comics
        </Link>

        <article>
          <header>
            <h1 className="text-3xl mt-5 font-bold mb-8">{comic.title}</h1>
          </header>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col w-full lg:w-1/3">
              {comic.image && (
                <img
                  src={comic.image}
                  alt={comic.title}
                  className="w-full rounded shadow mb-6"
                />
              )}
            </div>

            <div className="flex flex-col w-full lg:w-2/3">
              {series.name && (
                <h2 className="text-2xl font-bold">{series.name}</h2>
              )}

              <div className="flex flex-row gap-3 text-l mt-1 font-bold text-teal-400">
                {series.publisher && (
                  <span>{series.publisher}</span>
                )} |
                {series.type && (
                  <span>{series.type}</span>
                )} |
                {series.genre && (
                  <span>{series.genre}</span>
                )}
              </div>
              
              {comic.summary && (
                <div className="my-4">
                  <h2 className="sr-only">Summary</h2>
                  <p>{comic.summary}</p>
                </div>
              )}

              <dl className="grid gap-1 grid-cols-[max-content]">
                <dt className="text-teal-400 font-bold">Release Date:</dt>
                <dd className="m-0 col-start-2">
                  { new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(comic.release_date))}
                </dd>

                {typeof comic.price === "number" && comic.price > 0 && (
                  <>
                    <dt className="text-teal-400 font-bold">Price:</dt> 
                    <dd className="m-0 col-start-2">${comic.price.toFixed(2)}</dd>
                  </>
                )}

                {series.issue_number && (
                  <>
                    <dt className="text-teal-400 font-bold">Issue:</dt> 
                    <dd className="m-0 col-start-2">#{ series.issue_number }</dd>
                  </>
                )}

                {series.volume && (
                  <>
                    <dt className="text-teal-400 font-bold">Volume:</dt> 
                    <dd className="m-0 col-start-2">{series.volume}</dd>
                  </>
                )}

                {comic.page_count && (
                  <> 
                    <dt className="text-teal-400 font-bold">Pages:</dt> 
                    <dd className="m-0 col-start-2">{comic.page_count}</dd>
                  </>
                )}

                <dt className="text-teal-400 font-bold"></dt> 
                <dd className="m-0 col-start-2"></dd>

                {comic.rating && (
                  <>
                    <dt className="text-teal-400 font-bold">Rating:</dt> 
                    <dd className="m-0 col-start-2">{comic.rating}</dd>
                  </>
                )}
                
                {comic.upc && (
                  <>
                    <dt className="text-teal-400 font-bold">UPC:</dt> 
                    <dd className="m-0 col-start-2">{comic.upc}</dd>
                  </>
                )}
                
                {series.status && (
                  <>
                    <dt className="text-teal-400 font-bold">Status:</dt> 
                    <dd className="m-0 col-start-2">{series.status}</dd>
                  </>
                )}
                
                {series.start_year && (
                  <>
                    <dt className="text-teal-400 font-bold">Year Began:</dt> 
                    <dd className="m-0 col-start-2">{series.start_year}</dd>
                  </>
                )}
                
                {series.num_issues && (
                  <>
                    <dt className="text-teal-400 font-bold">Total Issues:</dt> 
                    <dd className="m-0 col-start-2">{series.num_issues}</dd>
                  </>
                )}
                
              </dl>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
