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
  ChevronRight,
  Star,
} from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  instructor: string;
  completionDate?: string;
  userName?: string;
  /**
   * Pass `true` ONLY when the course JUST finished for the first time.
   * This triggers the celebration popup, and the download button is locked
   * until the user closes it.
   *
   * Leave `false` (default) when opening from a "Get Certificate" button on
   * an already-completed course — the download is immediately available.
   */
  justCompleted?: boolean;
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
  return email
    .split("@")[0]
    .replace(/[._\-0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiBurst() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: ["#1a56db","#3b82f6","#60a5fa","#fbbf24","#34d399","#f472b6","#a78bfa"][i % 7],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    dur: `${0.9 + Math.random() * 0.7}s`,
    size: `${6 + Math.random() * 8}px`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(340px) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 2 === 0 ? "50%" : "2px",
            animation: `confetti-fall ${p.dur} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Completion Popup ─────────────────────────────────────────────────────────
function CompletionPopup({
  courseTitle,
  onClose,
}: {
  courseTitle: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes pop-in {
          0%   { transform: scale(0.7) translateY(30px); opacity: 0; }
          70%  { transform: scale(1.04) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.65); opacity: 0; }
        }
        @keyframes float-icon {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        .completion-card { animation: pop-in 0.5s cubic-bezier(.34,1.56,.64,1) both; font-family: 'Sora', sans-serif; }
        .pulse-ring       { animation: pulse-ring 1.4s ease-out infinite; }
        .float-icon       { animation: float-icon 2.4s ease-in-out infinite; }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="completion-card relative z-10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(145deg,#0f172a 0%,#1e3a5f 50%,#0f2d5c 100%)" }}
      >
        <ConfettiBurst />
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-300" />

        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="pulse-ring absolute inset-0 rounded-full border-4 border-blue-400" />
            <div className="pulse-ring absolute inset-0 rounded-full border-4 border-blue-400" style={{ animationDelay: "0.5s" }} />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/40">
              <span className="float-icon text-4xl">🎓</span>
            </div>
          </div>

          <div className="flex gap-1 mb-4">
            {[0,1,2,3,4].map((i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2">
            Course Complete!
          </p>
          <h2 className="text-white text-2xl font-extrabold leading-tight mb-2">
            Congratulations! 🎉
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-1">
            You've successfully completed
          </p>
          <p className="text-blue-300 font-bold text-base mb-6 px-4">
            "{courseTitle}"
          </p>
          <p className="text-white/40 text-xs mb-6">
            Your certificate is ready — close this to claim it.
          </p>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.97]"
            style={{ background: "linear-gradient(90deg,#1d4ed8,#3b82f6)" }}
          >
            Claim Your Certificate
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CertificateModal({
  isOpen,
  onClose,
  courseTitle,
  instructor,
  completionDate,
  userName: propUserName,
  justCompleted = false,
}: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userName, setUserName] = useState(propUserName || "");
  const [loading, setLoading] = useState(!propUserName);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  /**
   * `showPopup` — celebration popup visible only on justCompleted flow.
   * `certUnlocked` — controls whether the Download button is enabled.
   *   - true  when opened via "Get Certificate" (course already done)
   *   - false until user closes the popup (justCompleted flow)
   */
  const [showPopup, setShowPopup] = useState(false);
  const [certUnlocked, setCertUnlocked] = useState(true);

  // Sync state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      if (justCompleted) {
        setShowPopup(true);
        setCertUnlocked(false);
      } else {
        setShowPopup(false);
        setCertUnlocked(true);
      }
    }
  }, [isOpen, justCompleted]);

  function handlePopupClose() {
    setShowPopup(false);
    setCertUnlocked(true);
  }

  const dateStr = formatDate(completionDate);
  const shareText = `🎓 I just completed "${courseTitle}" on Sabiskill! Check it out 👇`;
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "https://sabiskill.com";

  // ── Fetch username ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || propUserName) return;
    (async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const full = user.user_metadata?.full_name || user.user_metadata?.name || "";
          setUserName(full || (user.email ? nameFromEmail(user.email) : "Student"));
        }
      } catch {
        setUserName("Student");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, propUserName]);

  // ── Draw certificate canvas ───────────────────────────────────────────────
  const drawCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !userName) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1400, H = 990;
    canvas.width = W;
    canvas.height = H;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Dot pattern
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let x = 30; x < W; x += 40) {
      for (let y = 30; y < H; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#1a56db";
        ctx.fill();
      }
    }
    ctx.restore();

    // Blue side bars
    const sideGrad = ctx.createLinearGradient(0, 0, 0, H);
    sideGrad.addColorStop(0, "#1d4ed8");
    sideGrad.addColorStop(0.5, "#3b82f6");
    sideGrad.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = sideGrad;
    ctx.fillRect(0, 0, 18, H);
    ctx.fillRect(W - 18, 0, 18, H);

    // Blue top/bottom bars
    const hGrad = ctx.createLinearGradient(0, 0, W, 0);
    hGrad.addColorStop(0, "#1d4ed8");
    hGrad.addColorStop(0.5, "#60a5fa");
    hGrad.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, W, 12);
    ctx.fillRect(0, H - 12, W, 12);

    // Inner border
    ctx.strokeStyle = "#dbeafe";
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 24, W - 64, H - 48);

    // Corner dots
    const corners: [number, number][] = [[42, 34],[W - 42, 34],[42, H - 34],[W - 42, H - 34]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
    });

    // Decorative circles
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath(); ctx.arc(W - 120, 120, 220, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.035;
    ctx.beginPath(); ctx.arc(W - 80, 80, 300, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.05;
    ctx.beginPath(); ctx.arc(120, H - 120, 200, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // ── SABISKILL brand (top-center) ──────────────────────────────────────
    const logoX = W / 2 - 210, logoY = 60, logoR = 28;
    const logoGrad = ctx.createRadialGradient(logoX, logoY + 4, 4, logoX, logoY, logoR);
    logoGrad.addColorStop(0, "#3b82f6");
    logoGrad.addColorStop(1, "#1d4ed8");
    ctx.beginPath(); ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
    ctx.fillStyle = logoGrad; ctx.fill();

    ctx.strokeStyle = "#fff"; ctx.lineWidth = 3.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(logoX, logoY + 4, 14, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(logoX, logoY + 4, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.beginPath(); ctx.arc(logoX, logoY + 4, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#1d4ed8"; ctx.fill();

    ctx.fillStyle = "#1d4ed8"; ctx.font = "bold 34px Georgia, serif"; ctx.textAlign = "left";
    ctx.fillText("SABISKILL", logoX + 38, logoY + 12);
    ctx.fillStyle = "#93c5fd"; ctx.font = "12px Georgia, serif";
    ctx.fillText("Skills for life. Certified.", logoX + 40, logoY + 30);

    // Separator line
    const sepY = 108;
    const sepGrad = ctx.createLinearGradient(40, sepY, W - 40, sepY);
    sepGrad.addColorStop(0, "transparent");
    sepGrad.addColorStop(0.15, "#bfdbfe");
    sepGrad.addColorStop(0.85, "#bfdbfe");
    sepGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = sepGrad; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(40, sepY); ctx.lineTo(W - 40, sepY); ctx.stroke();

    // ── Seal ─────────────────────────────────────────────────────────────
    const sealX = 215, sealY = H / 2 + 30, sealR = 110;
    for (let i = 0; i < 20; i++) {
      const a = (i * Math.PI * 2) / 20 - Math.PI / 2;
      const ox = sealX + Math.cos(a) * (sealR + 16);
      const oy = sealY + Math.sin(a) * (sealR + 16);
      const sg = ctx.createRadialGradient(ox, oy, 1, ox, oy, 11);
      sg.addColorStop(0, "#93c5fd"); sg.addColorStop(1, "#1d4ed8");
      ctx.beginPath(); ctx.arc(ox, oy, 11, 0, Math.PI * 2);
      ctx.fillStyle = sg; ctx.fill();
    }
    const diskGrad = ctx.createRadialGradient(sealX - 28, sealY - 28, 10, sealX, sealY, sealR);
    diskGrad.addColorStop(0, "#60a5fa"); diskGrad.addColorStop(0.6, "#2563eb"); diskGrad.addColorStop(1, "#1e3a8a");
    ctx.beginPath(); ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2); ctx.fillStyle = diskGrad; ctx.fill();
    ctx.beginPath(); ctx.arc(sealX, sealY, sealR * 0.78, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(sealX, sealY, sealR * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15,30,80,0.5)"; ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = `bold ${Math.round(sealR * 0.85)}px serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("★", sealX, sealY + 4);
    ctx.textBaseline = "alphabetic";

    // ── Certificate text ──────────────────────────────────────────────────
    const textCx = (W + 380) / 2;

    ctx.fillStyle = "#1d4ed8"; ctx.font = "bold 18px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("C E R T I F I C A T E   O F   C O M P L E T I O N", textCx, 152);
    ctx.strokeStyle = "#bfdbfe"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(390, 170); ctx.lineTo(W - 60, 170); ctx.stroke();

    ctx.fillStyle = "#64748b"; ctx.font = "italic 18px Georgia, serif";
    ctx.fillText("This is to certify that", textCx, 250);

    ctx.fillStyle = "#0f172a"; ctx.font = "bold 68px Georgia, serif";
    ctx.fillText(userName, textCx, 348);

    const nw = ctx.measureText(userName).width;
    const ugGrad = ctx.createLinearGradient(textCx - nw / 2, 0, textCx + nw / 2, 0);
    ugGrad.addColorStop(0, "#93c5fd"); ugGrad.addColorStop(0.5, "#2563eb"); ugGrad.addColorStop(1, "#93c5fd");
    ctx.strokeStyle = ugGrad; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(textCx - nw / 2, 368); ctx.lineTo(textCx + nw / 2, 368); ctx.stroke();

    ctx.fillStyle = "#475569"; ctx.font = "19px Georgia, serif";
    ctx.fillText("has successfully completed the online course", textCx, 430);

    ctx.fillStyle = "#1d4ed8"; ctx.font = "bold 42px Georgia, serif";
    const maxTW = 840;
    const words = courseTitle.split(" ");
    let line = ""; const lines: string[] = [];
    for (const w of words) {
      const test = line + w + " ";
      if (ctx.measureText(test).width > maxTW && line) { lines.push(line.trim()); line = w + " "; }
      else line = test;
    }
    lines.push(line.trim());
    lines.forEach((l, i) => ctx.fillText(l, textCx, 496 + i * 52));
    const afterCourse = 496 + lines.length * 52;

    ctx.fillStyle = "#3b82f6"; ctx.globalAlpha = 0.5; ctx.font = "20px serif";
    ctx.fillText("• • •", textCx, afterCourse + 50);
    ctx.globalAlpha = 1;

    const rowY = afterCourse + 125;
    [
      { x: textCx - 190, label: "DATE OF COMPLETION", value: dateStr },
      { x: textCx + 190, label: "INSTRUCTOR",         value: instructor },
    ].forEach(({ x, label, value }) => {
      ctx.textAlign = "center";
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px Georgia, serif"; ctx.fillText(label, x, rowY);
      ctx.fillStyle = "#0f172a"; ctx.font = "bold 20px Georgia, serif"; ctx.fillText(value, x, rowY + 32);
      ctx.strokeStyle = "#bfdbfe"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 120, rowY + 48); ctx.lineTo(x + 120, rowY + 48); ctx.stroke();
    });

    ctx.fillStyle = "#94a3b8"; ctx.font = "12px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("Sabiskill Academy  •  sabiskill.com  •  Issued with 🎓", W / 2, H - 36);
  }, [userName, courseTitle, instructor, dateStr]);

  useEffect(() => {
    if (isOpen && !loading && userName) drawCertificate();
  }, [isOpen, loading, userName, drawCertificate]);

  // ── PDF download ──────────────────────────────────────────────────────────
  const ensureJsPDF = (): Promise<any> =>
    new Promise((resolve) => {
      if ((window as any).jspdf?.jsPDF) return resolve((window as any).jspdf.jsPDF);
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = () => resolve((window as any).jspdf.jsPDF);
      document.head.appendChild(s);
    });

  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      drawCertificate();
      const canvas = canvasRef.current!;
      const imgData = canvas.toDataURL("image/jpeg", 0.97);
      const jsPDF = await ensureJsPDF();
      const pw = canvas.width / 2, ph = canvas.height / 2;
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [pw, ph] });
      pdf.addImage(imgData, "JPEG", 0, 0, pw, ph);
      pdf.save(`${courseTitle.replace(/\s+/g, "-")}-Certificate.pdf`);
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      setGenerating(false);
    }
  };

  // ── Share helpers ─────────────────────────────────────────────────────────
  const shareTwitter  = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  const shareLinkedIn = () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, "_blank");
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank");
  const copyLink = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!isOpen) return null;

  // Show celebration popup first (justCompleted flow only)
  if (showPopup) {
    return <CompletionPopup courseTitle={courseTitle} onClose={handlePopupClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .cert-modal { animation: slide-up 0.4s cubic-bezier(.22,1,.36,1) both; font-family: 'Sora', sans-serif; }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div
        className="cert-modal relative z-10 w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col border border-blue-200/20"
        style={{ background: "linear-gradient(160deg,#0a1628 0%,#0e2244 60%,#0a1a38 100%)" }}
      >
        <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-700/40">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Sabiskill</p>
              <p className="text-white font-extrabold text-base leading-tight">Your Certificate</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Certificate preview */}
        <div className="p-5 sm:p-6">
          {loading ? (
            <div className="aspect-[1400/990] rounded-2xl bg-white/5 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-2 ring-blue-400/30">
              <div
                className="relative w-full overflow-hidden bg-white"
                style={{ fontFamily: "Georgia,'Times New Roman',serif", aspectRatio: "1400/990" }}
              >
                {/* Bars */}
                <div className="absolute left-0 top-0 bottom-0 w-[1.3%] bg-gradient-to-b from-blue-700 via-blue-500 to-blue-700" />
                <div className="absolute right-0 top-0 bottom-0 w-[1.3%] bg-gradient-to-b from-blue-700 via-blue-500 to-blue-700" />
                <div className="absolute top-0 left-0 right-0 h-[1.2%] bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700" />
                <div className="absolute bottom-0 left-0 right-0 h-[1.2%] bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700" />
                {/* Dot pattern */}
                <div className="absolute inset-0 opacity-[0.035]"
                  style={{ backgroundImage: "radial-gradient(circle,#1d4ed8 1.5px,transparent 1.5px)", backgroundSize: "28px 28px" }} />
                {/* Inner border */}
                <div className="absolute border border-blue-100 rounded" style={{ inset: "3%" }} />
                {/* Deco circles */}
                <div className="absolute -top-[8%] -right-[4%] w-[30%] aspect-square rounded-full bg-blue-500 opacity-[0.05]" />
                <div className="absolute -bottom-[8%] -left-[4%] w-[28%] aspect-square rounded-full bg-blue-500 opacity-[0.05]" />

                {/* Brand */}
                <div className="absolute top-[4%] left-0 right-0 flex items-center justify-center gap-2">
                  <div className="w-[4.5%] aspect-square rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold" style={{ fontSize: "clamp(5px,1.2vw,14px)" }}>S</span>
                  </div>
                  <div>
                    <p className="text-blue-700 font-black leading-none" style={{ fontSize: "clamp(7px,1.6vw,20px)" }}>SABISKILL</p>
                    <p className="text-blue-300 leading-none" style={{ fontSize: "clamp(4px,0.7vw,9px)" }}>Skills for life. Certified.</p>
                  </div>
                </div>
                <div className="absolute bg-blue-100" style={{ top: "14%", left: "4%", right: "4%", height: "1px" }} />

                {/* Seal */}
                <div className="absolute flex items-center justify-center"
                  style={{ left: "4.5%", top: "54%", transform: "translateY(-50%)", width: "clamp(60px,10vw,130px)", height: "clamp(60px,10vw,130px)" }}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-800" />
                  <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 4px rgba(59,130,246,0.25),0 0 0 9px rgba(59,130,246,0.1)" }} />
                  <div className="absolute rounded-full bg-blue-900/50" style={{ inset: "22%" }} />
                  <span className="relative text-white font-bold leading-none" style={{ fontSize: "clamp(18px,3.5vw,44px)" }}>★</span>
                </div>

                {/* Text content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{ paddingLeft: "21%", paddingRight: "3%", paddingTop: "16%", paddingBottom: "7%" }}>
                  <p className="text-blue-700 font-bold tracking-[0.2em] uppercase mb-[1.5%]" style={{ fontSize: "clamp(5px,1vw,12px)" }}>
                    Certificate of Completion
                  </p>
                  <div className="w-full h-px bg-blue-100 mb-[2%]" />
                  <p className="text-slate-500 italic mb-[1%]" style={{ fontSize: "clamp(5px,0.9vw,11px)" }}>This is to certify that</p>
                  <p className="text-slate-900 font-black leading-none mb-[0.8%]" style={{ fontSize: "clamp(12px,3.4vw,50px)" }}>
                    {userName || "…"}
                  </p>
                  <div className="mb-[2%]" style={{ height: 2, width: "clamp(40px,22%,260px)", background: "linear-gradient(90deg,#93c5fd,#2563eb,#93c5fd)" }} />
                  <p className="text-slate-500 mb-[1%]" style={{ fontSize: "clamp(5px,0.85vw,10px)" }}>
                    has successfully completed the online course
                  </p>
                  <p className="text-blue-700 font-black leading-snug mb-[1.5%] px-4" style={{ fontSize: "clamp(8px,1.8vw,24px)" }}>
                    {courseTitle}
                  </p>
                  <p className="text-blue-400 opacity-55 mb-[2%]" style={{ fontSize: "clamp(6px,1vw,12px)" }}>• • •</p>
                  <div className="flex w-full justify-around mt-auto">
                    {[{ label: "Date", value: dateStr }, { label: "Instructor", value: instructor }].map(({ label, value }) => (
                      <div key={label} className="text-center border-t border-blue-100 pt-2" style={{ minWidth: "28%" }}>
                        <p className="text-slate-400 uppercase tracking-widest" style={{ fontSize: "clamp(3px,0.6vw,8px)" }}>{label}</p>
                        <p className="text-slate-800 font-bold" style={{ fontSize: "clamp(5px,0.9vw,11px)" }}>{value}</p>
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
          <button
            onClick={handleDownloadPDF}
            disabled={generating || loading || !certUnlocked}
            className="w-full flex items-center justify-center gap-2.5 font-black py-4 rounded-2xl text-sm transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{ background: certUnlocked ? "linear-gradient(90deg,#1d4ed8,#3b82f6)" : "linear-gradient(90deg,#374151,#4b5563)" }}
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {generating ? "Generating PDF…" : "Download Certificate (PDF)"}
          </button>

          <button
            onClick={() => setShareOpen((p) => !p)}
            className="w-full flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all border border-white/10"
          >
            <Share2 className="w-4 h-4" />
            Share Your Achievement
          </button>

          {shareOpen && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: "Twitter / X", icon: <Twitter className="w-5 h-5 text-[#1d9bf0]" />, color: "#1d9bf0", action: shareTwitter },
                { label: "LinkedIn",   icon: <Linkedin className="w-5 h-5 text-[#0a66c2]" />, color: "#0a66c2", action: shareLinkedIn },
                { label: "Facebook",  icon: <Facebook className="w-5 h-5 text-[#1877f2]" />, color: "#1877f2", action: shareFacebook },
                {
                  label: copied ? "Copied!" : "Copy Link",
                  icon: copied
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    : <Link2 className="w-5 h-5 text-white/60" />,
                  color: copied ? "#10b981" : "transparent",
                  action: copyLink,
                },
              ].map(({ label, icon, color, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-1.5 bg-white/6 hover:bg-white/12 border border-white/10 text-white py-3.5 rounded-2xl text-xs font-semibold transition-all"
                  style={color !== "transparent" ? { borderColor: `${color}30` } : {}}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default CertificateModal;