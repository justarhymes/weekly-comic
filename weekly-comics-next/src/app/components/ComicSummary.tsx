interface ComicSummaryProps {
  summary?: string;
}

export default function ComicSummary({ summary }: ComicSummaryProps) {
  if (!summary) return null;

  return (
    <section className="my-4">
      <h2 className="sr-only">Summary</h2>
      <p>{summary}</p>
    </section>
  );
}
