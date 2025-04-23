"use client";

import Link from "next/link";
import { format, startOfWeek, endOfWeek } from "date-fns";

function getCurrentWeekRange() {
  const start = startOfWeek(new Date(), { weekStartsOn: 0 });
  const end = endOfWeek(new Date(), { weekStartsOn: 0 });

  const formattedStart = format(start, "MMMM do");
  const formattedEnd = format(end, "do");

  return `${formattedStart} - ${formattedEnd}`;
}

export default function Header() {
  return (
    <header className="w-full border-b border-foreground/10 p-4 bg-background">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Weekly Comic Releases <span className="text-sm font-normal text-muted">({getCurrentWeekRange()})</span>
        </Link>
      </div>
    </header>
  );
}