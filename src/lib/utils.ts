/**
 * Format a number as USD currency string.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Calculate the original price before a discount.
 */
export function getOriginalPrice(price: number, discountPct: number): number {
  if (!discountPct) return price;
  return price / (1 - discountPct / 100);
}

/**
 * Format an ISO date string into a human-readable form.
 * e.g. "April 30, 2025"
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

/**
 * Return Tailwind color classes for a given availability status.
 */
export function getAvailabilityStyle(status: string): {
  dot: string;
  text: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case "In Stock":
      return {
        dot: "bg-green-500",
        text: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    case "Low Stock":
      return {
        dot: "bg-amber-500",
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    case "Out of Stock":
      return {
        dot: "bg-red-500",
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    default:
      return {
        dot: "bg-gray-400",
        text: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
  }
}

/**
 * Extract up to 2 uppercase initials from a full name.
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Truncate a string to a maximum length, appending "…".
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Highlight matching substrings in a string with a <mark> wrapper.
 * Returns an array of {text, highlight} segments.
 */
export function getHighlightSegments(
  text: string,
  query: string,
): { text: string; highlight: boolean }[] {
  if (!query.trim()) return [{ text, highlight: false }];
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part) => ({
    text: part,
    highlight: regex.test(part),
  }));
}

/**
 * Deterministic color for reviewer avatar based on initials.
 */
const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-cyan-100 text-cyan-700",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Copy text to clipboard and return a promise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
