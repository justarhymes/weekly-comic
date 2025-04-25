interface InfoRowProps {
  label: string;
  value?: string | number | null;
  hiddenIfEmpty?: boolean;
}

export default function InfoRow({ label, value, hiddenIfEmpty = true }: InfoRowProps) {
  if (hiddenIfEmpty && !value) return null;

  return (
    <>
      <dt className="text-teal-400 font-bold">{label}:</dt>
      <dd className="m-0 col-start-2">{value}</dd>
    </>
  );
}
