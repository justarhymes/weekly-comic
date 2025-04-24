export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="max-w-4xl mx-auto py-4 px-6 text-sm text-teal-400 flex justify-between items-center">
        <p>
          Data from{' '}
          <a
            href="https://metron.cloud"
            className="text-rose-500 font-bold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Metron
          </a>
        </p>
        <p>
          Built by{' '}
          <a
            href="https://www.webdeveloperdude.com"
            className="text-rose-500 font-bold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            justarhymes
          </a>
        </p>
      </div>
    </footer>
  );
}
