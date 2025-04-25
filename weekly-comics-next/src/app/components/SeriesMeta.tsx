interface SeriesMetaProps {
  publisher?: string;
  type?: string;
  genre?: string | string[];
  screenReaderOnly?: boolean;
}

export default function SeriesMeta({
  publisher,
  type,
  genre,
  screenReaderOnly = false,
}: SeriesMetaProps) {
  const items = [publisher, type, Array.isArray(genre) ? genre.join(" / ") : genre].filter(Boolean);

  if (items.length === 0) return null;

  const content = items.map((item, idx) => (
    <span key={idx}>
      {item}
      {idx < items.length - 1 && " | "}
    </span>
  ));

  return (
    <div
      className={screenReaderOnly ? "sr-only" : "flex flex-wrap gap-x-2 text-l mt-1 font-bold text-teal-400"}
      aria-hidden={!screenReaderOnly}
    >
      {content}
    </div>
  );
}