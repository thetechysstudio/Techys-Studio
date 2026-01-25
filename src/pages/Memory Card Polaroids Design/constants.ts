import { PhotoData } from "./types";

const API_URL = "https://api.shop.drmcetit.com/api/cards/";
const BACKEND_URL = "https://api.shop.drmcetit.com";

/**
 * If you're running locally and want to avoid CORS for /media,
 * add a Vite proxy:
 *  server: { proxy: { "/media": { target: "https://api.shop.drmcetit.com", changeOrigin: true, secure: true } } }
 *
 * Then keep USE_MEDIA_PROXY_IN_DEV = true while on localhost.
 */
const USE_MEDIA_PROXY_IN_DEV = true;

type CardApiItem = {
  id: number;
  image: string | null;     // "/media/..." or full url
  title: string | null;
  subtile: string | null;   // backend key is "subtile"
  description: string | null;
  tagline: string | null;
  size: string | null;
};

const isLocalhost = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const normalizeImageUrl = (image: string | null) => {
  if (!image) return "https://picsum.photos/800/1000";

  // Already absolute
  if (image.startsWith("http://") || image.startsWith("https://")) {
    // If it's the same backend and we're on localhost, rewrite to /media/... to use Vite proxy
    if (
      USE_MEDIA_PROXY_IN_DEV &&
      isLocalhost() &&
      image.startsWith(`${BACKEND_URL}/media/`)
    ) {
      return image.replace(BACKEND_URL, ""); // => "/media/..."
    }
    return image;
  }

  // Relative from backend, typically "/media/..."
  if (image.startsWith("/media/")) {
    // On localhost, prefer proxy to avoid CORS
    if (USE_MEDIA_PROXY_IN_DEV && isLocalhost()) return image; // "/media/..."
    // In production build, use full backend URL
    return `${BACKEND_URL}${image}`;
  }

  // Any other relative path
  if (USE_MEDIA_PROXY_IN_DEV && isLocalhost()) return `/${image.replace(/^\/+/, "")}`;
  return `${BACKEND_URL}/${image.replace(/^\/+/, "")}`;
};

export const fetchPhotos = async (): Promise<PhotoData[]> => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(`Failed to fetch cards: ${res.status} ${res.statusText}`);
  }

  const data: CardApiItem[] = await res.json();

  return (data ?? []).map((item) => ({
    id: item.id,
    url: normalizeImageUrl(item.image),
    title: item.title ?? "",
    subtitle: item.subtile ?? "",       // API "subtile" -> UI "subtitle"
    description: item.description ?? "",
    tagline: item.tagline ?? "",
    size: item.size ?? "",
  }));
};

export const COLORS = {
  paper: "#fdfbf7",
  frame: "#ffffff",
  text: "#1a1a1a",
  accent: "#e63946",
};
