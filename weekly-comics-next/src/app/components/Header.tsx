"use client";

import Link from "next/link";
import { format, startOfWeek, endOfWeek } from "date-fns";

function getCurrentWeekRange() {
  const start = startOfWeek(new Date(), { weekStartsOn: 0 });
  const end = endOfWeek(new Date(), { weekStartsOn: 0 });

  const sameMonth = start.getMonth() === end.getMonth();

  const formattedStart = format(start, "MMMM do");
  const formattedEnd = sameMonth ? format(end, "do") : format(end, "MMMM do");

  return `${formattedStart} - ${formattedEnd}`;
}

export default function Header() {
  return (
    <header className="w-full text-center p-4">
        <h1 className="text-4xl font-bold text-white">
          <Link href="/">
            Weekly Comic Releases <span className="block text-sm font-normal text-teal-100">({getCurrentWeekRange()})</span>
          </Link>
        </h1>
    </header>
  );
}