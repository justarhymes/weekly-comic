export default function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-gray-200 dark:border-gray-800 mt-8">
      <div className="max-w-4xl mx-auto py-4 px-6 text-sm flex justify-between items-center">
        <p>
          Data from{' '}
          <a
            href="https://metron.cloud"
            className="text-fuchsia-500 hover:underline"
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
            className="text-fuchsia-500 hover:underline"
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
