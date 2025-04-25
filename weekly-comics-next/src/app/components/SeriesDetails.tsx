import InfoRow from "./InfoRow";

interface SeriesDetailsProps {
  series: {
    volume?: number;
    status?: string;
    start_year?: number;
    num_issues?: number;
  };
}

export default function SeriesDetails({ series }: SeriesDetailsProps) {
  return (
    <section>
      <h3 className="text-xl font-bold text-teal-700 mb-2">Series Info</h3>
      <dl className="grid gap-1 grid-cols-[max-content]">
        {series.volume && <InfoRow label="Volume" value={series.volume} />}
        {series.status && <InfoRow label="Status" value={series.status} />}
        {series.start_year && <InfoRow label="Year Began" value={series.start_year} />}
        {series.num_issues && <InfoRow label="Total Issues" value={series.num_issues} />}
      </dl>
    </section>
  );
}
