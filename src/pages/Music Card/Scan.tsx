import { useEffect, useRef, useState } from "react";

const TARGET_W = 320;
const TARGET_H = 240;

const WARMUP_MS = 800;
const COLOR_TOL = 140;      // forgiving
const MIN_WAVE_RATIO = 0.006;

const REQUIRED_READS = 2;   // only need 2 same reads
const WAVE_HEX = "#00DC50"; // wave color used in generated code

// ✅ Map decoded IDs to URLs
const ID_TO_URL: Record<string, string> = {
  "0504": "https://google.com",
  "C3D4": "https://open.spotify.com/track/xxxx",
};

export default function ScanWaveEasy() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);

  const lastIdRef = useRef<string>("");
  const sameCountRef = useRef(0);

  const [status, setStatus] = useState("Tap to start camera");
  const [running, setRunning] = useState(false);

  useEffect(() => () => stop(), []);

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    sameCountRef.current = 0;
    lastIdRef.current = "";
    setRunning(false);

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const start = async () => {
    try {
      stop();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;

      await new Promise<void>((r) => (video.onloadedmetadata = () => r()));
      await video.play();

      startedAtRef.current = Date.now();
      setRunning(true);
      setStatus("Scanning…");
      loop();
    } catch {
      setStatus("Camera permission denied / not available");
    }
  };

  const loop = () => {
    intervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      if (!video.videoWidth || !video.videoHeight) return;

      if (Date.now() - startedAtRef.current < WARMUP_MS) {
        setStatus("Stabilizing…");
        return;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = TARGET_W;
      canvas.height = TARGET_H;

      // center crop then resize (for stable processing)
      const srcW = video.videoWidth, srcH = video.videoHeight;
      const crop = Math.min(srcW, srcH);
      const sx = (srcW - crop) / 2;
      const sy = (srcH - crop) / 2;
      ctx.drawImage(video, sx, sy, crop, crop, 0, 0, TARGET_W, TARGET_H);

      const frame = ctx.getImageData(0, 0, TARGET_W, TARGET_H);
      const waveRgb = hexToRgb(WAVE_HEX);

      // Find wave band
      const band = findWaveBand(frame, waveRgb, COLOR_TOL);
      if (!band) {
        sameCountRef.current = 0;
        setStatus("Show wave code inside box…");
        return;
      }

      const roi = ctx.getImageData(0, band.y0, TARGET_W, band.h);
      const ratio = waveColorRatio(roi, waveRgb, COLOR_TOL);
      if (ratio < MIN_WAVE_RATIO) {
        sameCountRef.current = 0;
        setStatus("Move closer…");
        return;
      }

      // Decode ID
      const id = decodeWaveId(roi, waveRgb, COLOR_TOL);
      if (!id) {
        sameCountRef.current = 0;
        setStatus("Hold steady…");
        return;
      }

      // Require repeated same ID
      if (id === lastIdRef.current) {
        sameCountRef.current += 1;
      } else {
        lastIdRef.current = id;
        sameCountRef.current = 1;
      }

      setStatus(`Found ID: ${id} (${sameCountRef.current}/${REQUIRED_READS})`);

      if (sameCountRef.current >= REQUIRED_READS) {
        const url = ID_TO_URL[id];
        if (!url) {
          setStatus(`Unknown code: ${id}`);
          sameCountRef.current = 0;
          return;
        }
        setStatus("Opening…");
        stop();
        window.location.href = url;
      }
    }, 180);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-xl font-semibold mb-4">Scan Wave Code</h1>

      <div className="relative rounded-xl overflow-hidden border border-zinc-700">
        <video ref={videoRef} className="w-[320px] h-[420px] object-cover" playsInline muted />
        <div className="absolute inset-0 border-2 border-green-500 rounded-xl pointer-events-none" />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={start}
          className="px-4 py-2 bg-green-500 text-black rounded-lg font-medium"
          disabled={running}
        >
          {running ? "Running…" : "Start Camera"}
        </button>

        <button
          onClick={() => {
            stop();
            setStatus("Stopped. Tap to start camera");
          }}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium border border-zinc-700"
          disabled={!running}
        >
          Stop
        </button>
      </div>

      <p className="mt-3 text-green-400 text-sm text-center">{status}</p>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

/* -------- decoding helpers -------- */

function hexToRgb(hex: string): [number, number, number] {
  let s = hex.trim().replace("#", "");
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

function waveColorRatio(img: ImageData, waveRgb: [number, number, number], tol: number) {
  const { data } = img;
  let hits = 0;
  const total = data.length / 4;
  const [wr, wg, wb] = waveRgb;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const dist = Math.abs(r - wr) + Math.abs(g - wg) + Math.abs(b - wb);
    if (dist < tol) hits++;
  }
  return hits / total;
}

function findWaveBand(frame: ImageData, waveRgb: [number, number, number], tol: number) {
  const { width, height, data } = frame;
  const [wr, wg, wb] = waveRgb;
  const counts = new Array<number>(height).fill(0);

  for (let y = 0; y < height; y++) {
    let c = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const dist = Math.abs(r - wr) + Math.abs(g - wg) + Math.abs(b - wb);
      if (dist < tol) c++;
    }
    counts[y] = c;
  }

  const maxRow = Math.max(...counts);
  if (maxRow < width * 0.006) return null;

  const thr = maxRow * 0.45;
  let y0 = -1, y1 = -1;
  for (let y = 0; y < height; y++) {
    if (counts[y] >= thr) {
      if (y0 === -1) y0 = y;
      y1 = y;
    }
  }
  if (y0 === -1) return null;

  y0 = Math.max(0, y0 - 6);
  y1 = Math.min(height - 1, y1 + 6);
  const h = y1 - y0 + 1;
  if (h < 18) return null;

  return { y0, h };
}

/**
 * Decode a 4-hex ID from 16 bars:
 * - We sample 16 evenly spaced x positions.
 * - For each x, estimate bar height by finding wave pixels from top/bottom.
 * - Tall = 1, Short = 0 (threshold by median height).
 */
function decodeWaveId(roi: ImageData, waveRgb: [number, number, number], tol: number): string | null {
  const { width, height, data } = roi;
  const [wr, wg, wb] = waveRgb;

  // sample 16 positions across width (skip margins)
  const bits = 16;
  const margin = Math.floor(width * 0.08);
  const usable = width - margin * 2;
  const heights: number[] = [];

  for (let i = 0; i < bits; i++) {
    const x = margin + Math.floor((i + 0.5) * (usable / bits));

    // find top-most and bottom-most wave pixel at this x
    let top = -1, bottom = -1;

    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const dist = Math.abs(r - wr) + Math.abs(g - wg) + Math.abs(b - wb);
      if (dist < tol) {
        top = y;
        break;
      }
    }

    for (let y = height - 1; y >= 0; y--) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const dist = Math.abs(r - wr) + Math.abs(g - wg) + Math.abs(b - wb);
      if (dist < tol) {
        bottom = y;
        break;
      }
    }

    if (top === -1 || bottom === -1) return null;
    heights.push(bottom - top);
  }

  // decide tall/short by median
  const sorted = [...heights].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const bitArr = heights.map((h) => (h >= median ? 1 : 0));

  // convert 16 bits -> 4 hex chars
  let hex = "";
  for (let i = 0; i < 16; i += 4) {
    const nibble = (bitArr[i] << 3) | (bitArr[i + 1] << 2) | (bitArr[i + 2] << 1) | bitArr[i + 3];
    hex += nibble.toString(16).toUpperCase();
  }
  return hex;
}
