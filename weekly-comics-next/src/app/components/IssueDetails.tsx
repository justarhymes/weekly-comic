import { Comic } from "@/app/types";
import InfoRow from "./InfoRow";

interface IssueDetailsProps {
  comic: Comic;
}

export default function IssueDetails({
  comic
}: IssueDetailsProps) {
  return (
    <section>
      <h3 className="text-xl font-bold text-teal-700 mb-2">Issue Info</h3>
      <dl className="grid gap-1 grid-cols-[max-content]">
        {comic.release_date && ( 
          <InfoRow
            label="Release Date"
            value={new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            }).format(new Date(comic.release_date))}
          />
        )}
        {typeof comic.price === "number" && comic.price > 0 && (
          <InfoRow label="Price" value={`$${comic.price.toFixed(2)}`} />
        )}
        {comic.issue_number && <InfoRow label="Issue" value={`#${comic.issue_number}`} />}
        {comic.page_count && <InfoRow label="Pages" value={comic.page_count} />}
        {comic.rating && <InfoRow label="Rating" value={comic.rating} />}
        {comic.upc && <InfoRow label="UPC" value={comic.upc} />}
      </dl>
    </section>
  );
}