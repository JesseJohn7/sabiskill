"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  Download,
  Award,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  instructor: string;
  completionDate?: string;
  /** Optional override — if omitted the component fetches from Supabase */
  userName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d?: string) {
  return (
    d ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
}

function nameFromEmail(email: string) {
  const prefix = email.split("@")[0];
  return prefix
    .replace(/[._\-0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CertificateModal({
  isOpen,
  onClose,
  courseTitle,
  instructor,
  completionDate,
  userName: propUserName,
}: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userName, setUserName] = useState(propUserName || "");
  const [loading, setLoading] = useState(!propUserName);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const dateStr = formatDate(completionDate);
  const shareText = `🎓 I just completed "${courseTitle}" on LearnPath! Check it out 👇`;
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "https://learnpath.app";

  // ── Fetch username from Supabase auth ────────────────────────────────────
  useEffect(() => {
    if (!isOpen || propUserName) return;
    (async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const full =
            user.user_metadata?.full_name || user.user_metadata?.name || "";
          setUserName(
            full || (user.email ? nameFromEmail(user.email) : "Student")
          );
        }
      } catch {
        setUserName("Student");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, propUserName]);

  // ── Draw Canva-style certificate on hidden high-res canvas ───────────────
  const drawCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !userName) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1400;
    const H = 990;
    canvas.width = W;
    canvas.height = H;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0f2544");
    bg.addColorStop(0.55, "#0e3d52");
    bg.addColorStop(1, "#061a2e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Diagonal grid overlay
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    for (let x = -H; x < W + H; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + H, H);
      ctx.stroke();
    }
    ctx.restore();

    // Gold side bars
    const accentGrad = ctx.createLinearGradient(0, 0, 0, H);
    accentGrad.addColorStop(0, "#f5c842");
    accentGrad.addColorStop(0.5, "#f0a500");
    accentGrad.addColorStop(1, "#f5c842");
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, 16, H);
    ctx.fillRect(W - 16, 0, 16, H);

    // Gold top/bottom ribbons
    const ribbonGrad = ctx.createLinearGradient(0, 0, W, 0);
    ribbonGrad.addColorStop(0, "#f5c842");
    ribbonGrad.addColorStop(0.5, "#ffe680");
    ribbonGrad.addColorStop(1, "#f5c842");
    ctx.fillStyle = ribbonGrad;
    ctx.fillRect(0, 0, W, 10);
    ctx.fillRect(0, H - 10, W, 10);

    // Decorative circles top-right
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = "#f5c842";
    ctx.beginPath();
    ctx.arc(W - 100, 140, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.04;
    ctx.beginPath();
    ctx.arc(W - 60, 100, 290, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Decorative circle bottom-left
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = "#f5c842";
    ctx.beginPath();
    ctx.arc(100, H - 140, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── Award seal ───────────────────────────────────────────────────────────
    const sealX = 200;
    const sealY = H / 2;
    const sealR = 115;

    // spike ring
    for (let i = 0; i < 18; i++) {
      const angle = (i * Math.PI * 2) / 18 - Math.PI / 2;
      const ox = sealX + Math.cos(angle) * (sealR + 18);
      const oy = sealY + Math.sin(angle) * (sealR + 18);
      ctx.beginPath();
      ctx.arc(ox, oy, 13, 0, Math.PI * 2);
      const sg = ctx.createRadialGradient(ox, oy, 2, ox, oy, 13);
      sg.addColorStop(0, "#ffe680");
      sg.addColorStop(1, "#c8860a");
      ctx.fillStyle = sg;
      ctx.fill();
    }

    // main disk
    const diskGrad = ctx.createRadialGradient(sealX - 30, sealY - 30, 20, sealX, sealY, sealR);
    diskGrad.addColorStop(0, "#ffe680");
    diskGrad.addColorStop(0.6, "#f5c842");
    diskGrad.addColorStop(1, "#c8860a");
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
    ctx.fillStyle = diskGrad;
    ctx.fill();

    // inner dark circle
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR * 0.72, 0, Math.PI * 2);
    ctx.fillStyle = "#0f2544";
    ctx.fill();

    // star glyph
    ctx.fillStyle = "#f5c842";
    ctx.font = `bold ${Math.round(sealR * 0.88)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", sealX, sealY + 4);
    ctx.textBaseline = "alphabetic";

    // ── Certificate text (right of seal) ─────────────────────────────────────
    const textCx = (W + 360) / 2; // center of right zone

    // CERTIFICATE OF COMPLETION header
    ctx.fillStyle = "#f5c842";
    ctx.font = "bold 20px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "C E R T I F I C A T E   O F   C O M P L E T I O N",
      textCx,
      105
    );

    // thin rule
    ctx.strokeStyle = "#f5c842";
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(370, 124);
    ctx.lineTo(W - 70, 124);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // subtitle
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "italic 20px Georgia, serif";
    ctx.fillText("This is to certify that", textCx, 210);

    // Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 72px Georgia, serif";
    ctx.fillText(userName, textCx, 316);

    // name underline
    const nw = ctx.measureText(userName).width;
    ctx.strokeStyle = "#f5c842";
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(textCx - nw / 2, 336);
    ctx.lineTo(textCx + nw / 2, 336);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // body
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "20px Georgia, serif";
    ctx.fillText("has successfully completed the online course", textCx, 400);

    // Course title (word-wrap)
    ctx.fillStyle = "#f5c842";
    ctx.font = "bold 44px Georgia, serif";
    const maxTW = 860;
    const twords = courseTitle.split(" ");
    let tline = "";
    const tlines: string[] = [];
    for (const w of twords) {
      const test = tline + w + " ";
      if (ctx.measureText(test).width > maxTW && tline) {
        tlines.push(tline.trim());
        tline = w + " ";
      } else {
        tline = test;
      }
    }
    tlines.push(tline.trim());
    tlines.forEach((l, i) => ctx.fillText(l, textCx, 466 + i * 54));

    const afterCourse = 466 + tlines.length * 54;

    // ornament
    ctx.fillStyle = "#f5c842";
    ctx.globalAlpha = 0.65;
    ctx.font = "22px serif";
    ctx.fillText("✦  ✦  ✦", textCx, afterCourse + 52);
    ctx.globalAlpha = 1;

    // Date + Instructor
    const rowY = afterCourse + 130;
    const colL = textCx - 190;
    const colR = textCx + 190;

    [
      { x: colL, label: "DATE OF COMPLETION", value: dateStr },
      { x: colR, label: "INSTRUCTOR", value: instructor },
    ].forEach(({ x, label, value }) => {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.38)";
      ctx.font = "13px Georgia, serif";
      ctx.fillText(label, x, rowY);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 21px Georgia, serif";
      ctx.fillText(value, x, rowY + 34);

      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 130, rowY + 50);
      ctx.lineTo(x + 130, rowY + 50);
      ctx.stroke();
    });

    // Footer
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.font = "13px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "LearnPath Academy  •  learnpath.app  •  Issued with 🎓",
      W / 2,
      H - 38
    );
  }, [userName, courseTitle, instructor, dateStr]);

  useEffect(() => {
    if (isOpen && !loading && userName) drawCertificate();
  }, [isOpen, loading, userName, drawCertificate]);

  // ── Load jsPDF from CDN ───────────────────────────────────────────────────
  const ensureJsPDF = (): Promise<any> =>
    new Promise((resolve) => {
      if ((window as any).jspdf?.jsPDF)
        return resolve((window as any).jspdf.jsPDF);
      const s = document.createElement("script");
      s.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = () => resolve((window as any).jspdf.jsPDF);
      document.head.appendChild(s);
    });

  // ── Download PDF ──────────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      drawCertificate();
      const canvas = canvasRef.current!;
      const imgData = canvas.toDataURL("image/jpeg", 0.97);
      const jsPDF = await ensureJsPDF();
      const pw = canvas.width / 2;
      const ph = canvas.height / 2;
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [pw, ph],
      });
      pdf.addImage(imgData, "JPEG", 0, 0, pw, ph);
      pdf.save(`${courseTitle.replace(/\s+/g, "-")}-Certificate.pdf`);
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      setGenerating(false);
    }
  };

  // ── Social share helpers ──────────────────────────────────────────────────
  const shareTwitter = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  const shareLinkedIn = () =>
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  const shareFacebook = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  const copyLink = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl bg-[#0b1e38] border border-white/10 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                Achievement Unlocked
              </p>
              <p className="text-white font-black text-base leading-tight">
                Your Certificate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Certificate preview */}
        <div className="p-5 sm:p-6">
          {loading ? (
            <div className="aspect-[1400/990] rounded-2xl bg-white/5 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-2 ring-amber-400/25">
              {/* CSS replica of the canvas — scales naturally */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg,#0f2544 0%,#0e3d52 55%,#061a2e 100%)",
                  fontFamily: "Georgia,'Times New Roman',serif",
                  aspectRatio: "1400/990",
                }}
              >
                {/* Gold bars */}
                <div className="absolute left-0 top-0 bottom-0 w-[1.15%] bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300" />
                <div className="absolute right-0 top-0 bottom-0 w-[1.15%] bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300" />
                <div className="absolute top-0 left-0 right-0 h-[1%] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400" />
                <div className="absolute bottom-0 left-0 right-0 h-[1%] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400" />

                {/* Diagonal grid */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
                    backgroundSize: "34px 34px",
                  }}
                />

                {/* Decorative circles */}
                <div className="absolute -top-[10%] -right-[5%] w-[36%] aspect-square rounded-full bg-amber-400 opacity-[0.06]" />
                <div className="absolute -bottom-[10%] -left-[5%] w-[32%] aspect-square rounded-full bg-amber-400 opacity-[0.06]" />

                {/* Award seal */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: "4%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "clamp(70px,11vw,148px)",
                    height: "clamp(70px,11vw,148px)",
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 opacity-90" />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow:
                        "0 0 0 5px rgba(245,200,66,0.35),0 0 0 11px rgba(245,200,66,0.12)",
                    }}
                  />
                  <div className="absolute rounded-full bg-[#0f2544]" style={{ inset: "22%" }} />
                  <span
                    className="relative text-amber-400 font-bold select-none leading-none"
                    style={{ fontSize: "clamp(20px,3.8vw,48px)" }}
                  >
                    ★
                  </span>
                </div>

                {/* Text content */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{
                    paddingLeft: "20%",
                    paddingRight: "3%",
                    paddingTop: "5%",
                    paddingBottom: "5%",
                  }}
                >
                  <p
                    className="text-amber-400 font-bold tracking-[0.18em] uppercase mb-[1.8%]"
                    style={{ fontSize: "clamp(6px,1.2vw,15px)" }}
                  >
                    Certificate&nbsp;of&nbsp;Completion
                  </p>
                  <div className="w-full h-px bg-amber-400 opacity-30 mb-[2.5%]" />

                  <p
                    className="text-white/50 italic mb-[1.2%]"
                    style={{ fontSize: "clamp(6px,1vw,13px)" }}
                  >
                    This is to certify that
                  </p>

                  <p
                    className="text-white font-black leading-none mb-[1%]"
                    style={{ fontSize: "clamp(13px,3.6vw,52px)" }}
                  >
                    {userName || "…"}
                  </p>
                  <div
                    className="bg-amber-400 opacity-65 mb-[2.2%]"
                    style={{ height: 2, width: "clamp(50px,26%,300px)" }}
                  />

                  <p
                    className="text-white/55 mb-[1.2%]"
                    style={{ fontSize: "clamp(6px,1vw,13px)" }}
                  >
                    has successfully completed the online course
                  </p>

                  <p
                    className="text-amber-400 font-black leading-snug mb-[1.8%] px-4"
                    style={{ fontSize: "clamp(9px,2vw,27px)" }}
                  >
                    {courseTitle}
                  </p>

                  <p
                    className="text-amber-400 opacity-55 mb-[2.2%]"
                    style={{ fontSize: "clamp(7px,1.1vw,14px)" }}
                  >
                    ✦ &nbsp; ✦ &nbsp; ✦
                  </p>

                  <div className="flex w-full justify-around mt-auto">
                    {[
                      { label: "Date", value: dateStr },
                      { label: "Instructor", value: instructor },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="text-center border-t border-white/20 pt-2"
                        style={{ minWidth: "28%" }}
                      >
                        <p
                          className="text-white/38 uppercase tracking-widest"
                          style={{ fontSize: "clamp(4px,0.72vw,9px)" }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-white font-bold"
                          style={{ fontSize: "clamp(6px,1vw,13px)" }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 sm:px-6 pb-6 space-y-3">
          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={generating || loading}
            className="w-full flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-900 font-black py-4 rounded-2xl text-sm transition-all active:scale-[0.98] shadow-lg shadow-amber-400/20"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {generating ? "Generating PDF…" : "Download Certificate (PDF)"}
          </button>

          {/* Share toggle */}
          <button
            onClick={() => setShareOpen((p) => !p)}
            className="w-full flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all border border-white/10"
          >
            <Share2 className="w-4 h-4" />
            Share Your Achievement
          </button>

          {/* Share grid */}
          {shareOpen && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                {
                  label: "Twitter / X",
                  icon: <Twitter className="w-5 h-5 text-[#1d9bf0]" />,
                  color: "#1d9bf0",
                  action: shareTwitter,
                },
                {
                  label: "LinkedIn",
                  icon: <Linkedin className="w-5 h-5 text-[#0a66c2]" />,
                  color: "#0a66c2",
                  action: shareLinkedIn,
                },
                {
                  label: "Facebook",
                  icon: <Facebook className="w-5 h-5 text-[#1877f2]" />,
                  color: "#1877f2",
                  action: shareFacebook,
                },
                {
                  label: copied ? "Copied!" : "Copy Link",
                  icon: copied ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Link2 className="w-5 h-5 text-white/60" />
                  ),
                  color: copied ? "#10b981" : "transparent",
                  action: copyLink,
                },
              ].map(({ label, icon, color, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-1.5 bg-white/6 hover:bg-white/12 border border-white/10 text-white py-3.5 rounded-2xl text-xs font-semibold transition-all"
                  style={
                    color !== "transparent"
                      ? { borderColor: `${color}30` }
                      : {}
                  }
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden high-res canvas for PDF export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default CertificateModal;