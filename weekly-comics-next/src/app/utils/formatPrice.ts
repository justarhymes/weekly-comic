import { Comic } from "@/app/types";

export function formatPrice(comic: Comic): string {
  if (comic.title.toLowerCase().includes("free comic book day")) {
    return "FREE";
  }
  if (comic.price != null) {
    return `$${comic.price.toFixed(2)}`;
  }
  return "Price N/A";
}