type FetchArgs = Parameters<typeof fetch>;
type FetchReturn = ReturnType<typeof fetch>;

const defaultHeaders = new Headers();

defaultHeaders.set(
  "User-Agent",
  "prices.bocchi.pink - @euquerococada on Discord",
);

export function apiFetch<T>(url: string | URL, options?: RequestInit) {
  return fetch(url, { ...options, headers: defaultHeaders });
}

const osrsBaseUrl = "prices.runescape.wiki/api/v1/osrs";
const osrsLatestUrl = `${osrsBaseUrl}/latest`;

export function getMapping() {
  apiFetch(`osrsBaseUrl`);
}
