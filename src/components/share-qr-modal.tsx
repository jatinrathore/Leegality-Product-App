import { useEffect, useRef, useCallback, useState } from "react";
import {
  Xmark,
  Download,
  Printer,
  Copy,
  Check,
  ShareAndroid,
  QrCode,
} from "iconoir-react";
import { formatCurrency, formatDate, getAvailabilityStyle, copyToClipboard } from "../lib/utils";
import { Badge } from "./ui/badge";
import type { Product } from "../api/resources/product/types";

/* ─── QR URL Generator ─── */
function buildQRUrl(data: string, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=1a1a2e&bgcolor=ffffff&data=${encodeURIComponent(data)}&format=png&ecc=M&qzone=2`;
}

/* ─── Async image loader with CORS ─── */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src + (src.includes("?") ? "&" : "?") + "_t=" + Date.now();
  });
}

/* ─── Wrap text onto canvas ─── */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

/* ─── Canvas card download ─── */
async function downloadCardPNG(product: Product, productUrl: string) {
  const dpr = 2;
  const W = 420;
  let H = 640;

  const canvas = document.createElement("canvas");
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  await document.fonts.ready;

  // ── Background ──
  ctx.fillStyle = "#ffffff";
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 14);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, W, H);
  }

  // ── Top accent bar ──
  ctx.fillStyle = "#4f46e5";
  ctx.fillRect(0, 0, W, 5);

  // ── Header area ──
  ctx.fillStyle = "#f5f3ff";
  ctx.fillRect(0, 5, W, 64);

  // Logo wordmark
  ctx.font = "bold 17px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "#4f46e5";
  ctx.fillText("Shop", 24, 46);
  const sw = ctx.measureText("Shop").width;
  ctx.fillStyle = "#312e81";
  ctx.fillText("Hub", 24 + sw, 46);

  // Generated date in header
  const genDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  ctx.font = "11px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.textAlign = "right";
  ctx.fillText(genDate, W - 24, 46);

  // ── Category badge ──
  let y = 90;
  if (product.category) {
    const badgeText = product.category.toUpperCase();
    ctx.font = "bold 9px Inter, system-ui, sans-serif";
    const bW = ctx.measureText(badgeText).width + 16;
    ctx.fillStyle = "#eef2ff";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(24, y - 12, bW, 18, 9);
    else ctx.rect(24, y - 12, bW, 18);
    ctx.fill();
    ctx.fillStyle = "#4f46e5";
    ctx.textAlign = "left";
    ctx.fillText(badgeText, 32, y);
    y += 26;
  }

  // ── Product title ──
  ctx.font = "bold 19px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "left";
  y = wrapText(ctx, product.title, 24, y, W - 48, 25);

  // ── Brand ──
  if (product.brand) {
    ctx.font = "13px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("by " + product.brand, 24, y);
    y += 22;
  }

  // ── Divider ──
  y += 6;
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, y);
  ctx.lineTo(W - 24, y);
  ctx.stroke();
  y += 16;

  // ── Info table ──
  const rows: [string, string][] = [
    ["SKU", product.sku || "—"],
    ["Status", product.availabilityStatus || "—"],
    ["Price", formatCurrency(product.price)],
  ];
  if (product.meta?.updatedAt) {
    rows.push(["Updated", formatDate(product.meta.updatedAt)]);
  }

  for (const [label, value] of rows) {
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.textAlign = "left";
    ctx.fillText(label, 24, y);

    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#374151";
    ctx.textAlign = "right";
    ctx.fillText(value, W - 24, y);
    y += 21;
  }

  // ── Divider ──
  y += 6;
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, y);
  ctx.lineTo(W - 24, y);
  ctx.stroke();
  y += 18;

  // ── QR Code ──
  const qrSize = 168;
  const qrX = (W - qrSize) / 2;
  const qrY = y;

  try {
    const qrImg = await loadImage(buildQRUrl(productUrl, 220));
    // QR border card
    ctx.fillStyle = "#fafafa";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 10);
      ctx.fill();
    }
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 10);
      ctx.stroke();
    }
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  } catch {
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("QR Code", W / 2, qrY + qrSize / 2);
  }

  y = qrY + qrSize + 20;

  // Caption
  ctx.fillStyle = "#9ca3af";
  ctx.font = "11px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scan to view this product", W / 2, y);
  y += 22;

  // ── Footer divider ──
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, y);
  ctx.lineTo(W - 24, y);
  ctx.stroke();
  y += 16;

  // Footer
  ctx.font = "bold 11px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#4f46e5";
  ctx.textAlign = "left";
  ctx.fillText("ShopHub", 24, y);

  ctx.font = "11px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.textAlign = "right";
  ctx.fillText("shophub.app", W - 24, y);

  // Resize canvas to actual content height
  H = y + 28;
  const final = document.createElement("canvas");
  final.width = W * dpr;
  final.height = H * dpr;
  const fCtx = final.getContext("2d")!;
  fCtx.drawImage(canvas, 0, 0);

  // Download
  return new Promise<void>((resolve) => {
    final.toBlob((blob) => {
      if (!blob) { resolve(); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `${product.title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
      a.href = url;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, "image/png");
  });
}

/* ─── Main Modal Component ─── */
type Props = {
  product: Product;
  productUrl: string;
  onClose: () => void;
};

export function ShareQRModal({ product, productUrl, onClose }: Props) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const qrUrl = buildQRUrl(productUrl, 220);
  const availStyle = getAvailabilityStyle(product.availabilityStatus);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Close with animation
  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  // ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleCopyLink = async () => {
    await copyToClipboard(productUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadCardPNG(product, productUrl);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=500,height=700");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${product.title} — ShopHub QR</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', sans-serif; background: #fff; display: flex; justify-content: center; align-items: flex-start; padding: 32px; }
            .card { width: 380px; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; }
            .top-bar { height: 5px; background: #4f46e5; }
            .header { background: #f5f3ff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 16px; font-weight: 700; color: #4f46e5; }
            .date { font-size: 11px; color: #9ca3af; }
            .body { padding: 20px 24px; }
            .badge { display: inline-block; background: #eef2ff; color: #4f46e5; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
            .title { font-size: 18px; font-weight: 700; color: #111827; line-height: 1.3; margin-bottom: 4px; }
            .brand { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
            .divider { height: 1px; background: #e5e7eb; margin: 12px 0; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .info-label { font-size: 11px; color: #9ca3af; }
            .info-value { font-size: 12px; font-weight: 500; color: #374151; }
            .qr-section { text-align: center; padding: 16px 0 8px; }
            .qr-img { width: 160px; height: 160px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px; background: #fafafa; }
            .qr-caption { font-size: 11px; color: #9ca3af; margin-top: 10px; }
            .footer { display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #e5e7eb; }
            .footer-brand { font-size: 11px; font-weight: 700; color: #4f46e5; }
            .footer-url { font-size: 11px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="top-bar"></div>
            <div class="header">
              <span class="logo">ShopHub</span>
              <span class="date">${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div class="body">
              ${product.category ? `<span class="badge">${product.category}</span>` : ""}
              <div class="title">${product.title}</div>
              ${product.brand ? `<div class="brand">by ${product.brand}</div>` : ""}
              <div class="divider"></div>
              <div class="info-row"><span class="info-label">SKU</span><span class="info-value">${product.sku || "—"}</span></div>
              <div class="info-row"><span class="info-label">Status</span><span class="info-value">${product.availabilityStatus || "—"}</span></div>
              <div class="info-row"><span class="info-label">Price</span><span class="info-value">${formatCurrency(product.price)}</span></div>
              ${product.meta?.updatedAt ? `<div class="info-row"><span class="info-label">Updated</span><span class="info-value">${formatDate(product.meta.updatedAt)}</span></div>` : ""}
              <div class="divider"></div>
              <div class="qr-section">
                <img class="qr-img" src="${qrUrl}" alt="QR Code"/>
                <div class="qr-caption">Scan to view this product</div>
              </div>
              <div class="divider"></div>
              <div class="footer">
                <span class="footer-brand">ShopHub</span>
                <span class="footer-url">shophub.app</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on ShopHub`,
          url: productUrl,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      await handleCopyLink();
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-250 ${
        visible ? "bg-black/40 backdrop-blur-sm" : "bg-black/0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${product.title}`}
    >
      <div
        className={`w-full max-w-lg transition-all duration-250 ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        {/* Modal card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

          {/* ── Modal header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <QrCode width={16} height={16} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Share Product</h2>
                <p className="text-xs text-gray-400">Download, print, or share a QR card</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close dialog"
            >
              <Xmark width={16} height={16} />
            </button>
          </div>

          {/* ── Share card preview ── */}
          <div className="px-6 pt-5 pb-4">
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">

              {/* Top accent */}
              <div className="h-1.5 bg-indigo-600" />

              {/* Card header */}
              <div className="bg-indigo-50 px-5 py-3.5 flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-700">ShopHub</span>
                <span className="text-xs text-gray-400">
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {/* Card body */}
              <div className="px-5 py-4 bg-white">
                {/* Category + title */}
                <div className="mb-3">
                  {product.category && (
                    <Badge variant="accent" size="sm" className="mb-2 capitalize">
                      {product.category}
                    </Badge>
                  )}
                  {product.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="muted" size="sm" className="mb-2 ml-1">
                      #{tag}
                    </Badge>
                  ))}
                  <h3 className="text-base font-bold text-gray-900 leading-snug mt-1">
                    {product.title}
                  </h3>
                  {product.brand && (
                    <p className="text-xs text-gray-400 mt-0.5">by {product.brand}</p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-3" />

                {/* Info rows */}
                <div className="space-y-1.5 mb-3">
                  {[
                    { label: "SKU", value: product.sku || "—" },
                    { label: "Price", value: formatCurrency(product.price) },
                    { label: "Status", value: product.availabilityStatus },
                    ...(product.meta?.updatedAt
                      ? [{ label: "Updated", value: formatDate(product.meta.updatedAt) }]
                      : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span
                        className={`text-xs font-medium ${
                          label === "Status"
                            ? availStyle.text
                            : "text-gray-700"
                        }`}
                      >
                        {label === "Status" && (
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${availStyle.dot}`}
                          />
                        )}
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-4" />

                {/* QR Code */}
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <img
                      src={qrUrl}
                      alt="QR code for this product"
                      className="w-36 h-36 object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-400">Scan to view this product</p>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600">ShopHub</span>
                <span className="text-xs text-gray-400">shophub.app</span>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="px-6 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <span className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download
                  width={18}
                  height={18}
                  className="text-gray-500 group-hover:text-indigo-600 transition-colors"
                />
              )}
              <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700 transition-colors">
                {downloading ? "Saving…" : "Download"}
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <Printer
                width={18}
                height={18}
                className="text-gray-500 group-hover:text-indigo-600 transition-colors"
              />
              <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700 transition-colors">
                Print
              </span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              {linkCopied ? (
                <Check
                  width={18}
                  height={18}
                  className="text-green-500"
                />
              ) : (
                <Copy
                  width={18}
                  height={18}
                  className="text-gray-500 group-hover:text-indigo-600 transition-colors"
                />
              )}
              <span
                className={`text-xs font-medium transition-colors ${
                  linkCopied
                    ? "text-green-600"
                    : "text-gray-600 group-hover:text-indigo-700"
                }`}
              >
                {linkCopied ? "Copied!" : "Copy link"}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <ShareAndroid
                width={18}
                height={18}
                className="text-gray-500 group-hover:text-indigo-600 transition-colors"
              />
              <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700 transition-colors">
                {hasNativeShare ? "Share" : "Copy link"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
