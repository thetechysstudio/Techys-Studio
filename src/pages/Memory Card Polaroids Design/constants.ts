import { PhotoData } from "./types";

const API_URL = "https://api.shop.drmcetit.com/api/cards/";
const BACKEND_URL = "https://api.shop.drmcetit.com";

type CardApiItem = {
  id: number;
  image: string | null;
  title: string | null;
  subtile: string | null;
  description: string | null;
  tagline: string | null;
  size: string | null;
};

const isLocalhost = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const USE_MEDIA_PROXY_IN_DEV = isLocalhost();

const normalizeImageUrl = (image: string | null) => {
  if (!image) return "https://picsum.photos/800/1000";

  // absolute url
  if (image.startsWith("http://") || image.startsWith("https://")) {
    // if localhost + same backend media, convert to "/media/..." (needs Vite proxy)
    if (USE_MEDIA_PROXY_IN_DEV && image.startsWith(`${BACKEND_URL}/media/`)) {
      return image.replace(BACKEND_URL, "");
    }
    return image;
  }

  // "/media/..."
  if (image.startsWith("/media/")) {
    if (USE_MEDIA_PROXY_IN_DEV) return image; // localhost via proxy
    return `${BACKEND_URL}${image}`;          // production direct
  }

  // other relative
  const cleaned = image.replace(/^\/+/, "");
  if (USE_MEDIA_PROXY_IN_DEV) return `/${cleaned}`;
  return `${BACKEND_URL}/${cleaned}`;
};

export const fetchPhotos = async (): Promise<PhotoData[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to fetch cards: ${res.status} ${res.statusText}`);

  const data: CardApiItem[] = await res.json();

  return (data ?? []).map((item) => ({
    id: item.id,
    url: normalizeImageUrl(item.image),
    title: item.title ?? "",
    subtitle: item.subtile ?? "",
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
