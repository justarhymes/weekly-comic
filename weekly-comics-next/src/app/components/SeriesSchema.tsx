import Head from "next/head";
import { Comic } from "@/app/types";

export default function SeriesSchema({ series }: { series: Comic["series"] }) {
  if (!series) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ComicSeries",
    name: series.name,
    startDate: series.start_year ? String(series.start_year) : undefined,
    genre: Array.isArray(series.genre) ? series.genre : [series.genre],
    publisher: series.publisher && {
      "@type": "Organization",
      name: series.publisher,
    },
    numberOfIssues: series.num_issues,
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Head>
  );
}
