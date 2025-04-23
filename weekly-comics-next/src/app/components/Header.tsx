import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-emerald-700 text-white py-4 shadow">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-tight hover:opacity-90 transition">
            Weekly Comic Releases
          </h1>
        </Link>
      </div>
    </header>
  );
}
