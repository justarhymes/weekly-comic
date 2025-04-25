import Head from "next/head";
import { Comic } from "@/app/types";

export default function ComicSchema({ comic }: { comic: Comic }) {
  const series = comic.series || {};
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ComicIssue",
    name: comic.title,
    datePublished: comic.release_date,
    image: comic.image,
    description: comic.summary,
    publisher: series.publisher && {
      "@type": "Organization",
      name: series.publisher,
    },
    isPartOf: {
      "@type": "ComicSeries",
      name: series.name,
      startDate: series.start_year,
      numberOfIssues: series.num_issues,
    },
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Head>
  );
}