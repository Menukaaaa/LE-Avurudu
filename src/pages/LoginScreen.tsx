import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import luvEsenceLogo from "@/assets/luvesence-logo.png";

const API_URL = "https://script.google.com/macros/s/AKfycby2yGXvPWb_UufEUkwbntqlm7dvpSZDi2wpJuQ6vfzWR3RdjWl8fTyvq49OkXYme04f/exec";

// ── Decorative floating petals (background) ───────────────────────────────────
const petals = [
  { emoji: "🌸", x: 8, y: 15, dur: 6 },
  { emoji: "🪷", x: 85, y: 10, dur: 7.5 },
  { emoji: "🌺", x: 70, y: 70, dur: 5.5 },
  { emoji: "🌸", x: 5, y: 72, dur: 8 },
  { emoji: "🪷", x: 45, y: 90, dur: 6.5 },
  { emoji: "🌺", x: 92, y: 45, dur: 7 },
  { emoji: "🌸", x: 25, y: 25, dur: 6.2 },
  { emoji: "🪷", x: 75, y: 40, dur: 7.1 },
  { emoji: "🌺", x: 15, y: 85, dur: 5.8 },
  { emoji: "🌸", x: 55, y: 15, dur: 6.8 },
  { emoji: "🪷", x: 35, y: 65, dur: 7.3 },
  { emoji: "🌺", x: 82, y: 85, dur: 6.1 },
  { emoji: "🌸", x: 18, y: 45, dur: 7.8 },
  { emoji: "🪷", x: 62, y: 48, dur: 5.9 },
  { emoji: "🌺", x: 40, y: 22, dur: 8.2 },
];

interface LoginScreenProps {
  onSuccess: (phone: string) => void;
}

type ApiState = "idle" | "loading" | "denied";

export const LoginScreen = ({ onSuccess }: LoginScreenProps) => {
  const [phone, setPhone] = useState("");
  const [apiState, setApiState] = useState<ApiState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);
  const [fading, setFading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async () => {
    const strippedPhone = phone.replace(/\D/g, "");
    if (!strippedPhone) {
      setErrorMsg("Please enter a valid phone number.");
      setApiState("denied");
      triggerShake();
      inputRef.current?.focus();
      return;
    }

    setApiState("loading");
    setErrorMsg("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        redirect: "follow",
        body: JSON.stringify({ action: "verify", phone: strippedPhone }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.allowed === true) {
        setFading(true);
        setTimeout(() => onSuccess(strippedPhone), 700);
      } else {
        setErrorMsg("Attempts exhausted.");
        setApiState("denied");
        triggerShake();
      }
    } catch (err) {
      console.error("The browser blocked the Apps Script response (Likely CORS):", err);
      setErrorMsg("Connection failed. (Check CORS or 'Anyone' access)");
      setApiState("denied");
      triggerShake();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden p-4"
      style={{
        background: "linear-gradient(135deg, #FFD1DC 0%, #FFF8F0 40%, #FFF8F0 70%, #FFD1DC 100%)",
      }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.65, ease: "easeInOut" }}
    >
      {/* ── Soft vignette overlay ───────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(255,105,180,0.12) 100%)",
        }}
      />

      {/* ── Pink dot pattern ────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,105,180,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Floating petals ─────────────────────────────────────────────── */}
      {petals.map(({ emoji, x, y, dur }, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute text-xl select-none opacity-30"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ y: [0, -14, 0], rotate: [0, 18, -18, 0], opacity: [0.18, 0.38, 0.18] }}
          transition={{ repeat: Infinity, duration: dur, delay: i * 0.6 }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* ── Main Card ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 1, y: 48, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
        className="relative z-10 w-full max-w-sm"
      >
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-[2.5rem] px-8 py-9 flex flex-col items-center gap-7 backdrop-blur-3xl"
          style={{
            background: "linear-gradient(145deg, rgba(255, 230, 240, 0.96) 0%, rgba(255, 192, 203, 0.96) 50%, rgba(255, 182, 193, 0.90) 100%)",
            border: "1.5px solid rgba(255, 105, 180, 0.4)",
            boxShadow: "0 24px 64px rgba(255, 20, 147, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Inner shimmer overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, transparent 55%, rgba(255,182,193,0.12) 100%)",
            }}
          />

          {/* ── LuvEsence Logo Pill ────────────────────────────────────────── */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            className="relative z-10 rounded-full px-14 py-4 flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255, 20, 147, 0.8) 0%, rgba(255, 105, 180, 0.55) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1.5px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 12px 48px rgba(255, 20, 147, 0.45), inset 0 0 15px rgba(255, 255, 255, 0.35)",
            }}
          >
            <img
              src={luvEsenceLogo}
              alt="LuvEsence"
              className="h-20 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]"
            />
          </motion.div>

          {/* ── Heading ───────────────────────────────────────────────────── */}
          <div className="relative z-10 text-center space-y-1">
            <h1
              className="text-3xl font-extrabold tracking-wide py-2 leading-relaxed"
              style={{
                background: "linear-gradient(90deg, #FF1493 0%, #db2777 50%, #FF69B4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.04em",
              }}
            >
              කණාමුට්ටිය
            </h1>
            <p
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "#db2777", letterSpacing: "0.18em" }}
            >
              Avurudu Challenge
            </p>
            <p className="text-xs mt-1" style={{ color: "#831843", opacity: 0.72 }}>
              Enter your phone number to begin
            </p>
          </div>

          {/* ── Phone Input ───────────────────────────────────────────────── */}
          <div className="relative z-10 w-full">
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.45)",
                border: "1px solid rgba(255, 105, 180, 0.25)",
                boxShadow: "0 2px 10px rgba(255, 20, 147, 0.05), inset 0 0 8px rgba(255,255,255,0.8)",
              }}
            >
              {/* Phone icon */}
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="url(#phonePink)"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <defs>
                  <linearGradient id="phonePink" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFB6C1" />
                    <stop offset="100%" stopColor="#FF1493" />
                  </linearGradient>
                </defs>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>

              <input
                ref={inputRef}
                type="tel"
                placeholder="07X XXX XXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (apiState === "denied") setApiState("idle");
                }}
                onKeyDown={handleKey}
                disabled={apiState === "loading"}
                className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:opacity-50"
                style={{ color: "#3a2e1e" }}
              />
            </div>
          </div>

          {/* ── Error message tooltip ─────────────────────────────────────── */}
          <AnimatePresence>
            {apiState === "denied" && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 w-full"
              >
                <div
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-center"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255, 105, 180, 0.4)",
                    color: "#be185d",
                  }}
                >
                  <p>✦ {errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CTA Button ────────────────────────────────────────────────── */}
          <motion.button
            onClick={handleSubmit}
            disabled={apiState === "loading"}
            whileHover={apiState !== "loading" ? { scale: 1.04, y: -1 } : {}}
            whileTap={apiState !== "loading" ? { scale: 0.96 } : {}}
            className="relative z-10 w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold tracking-widest uppercase transition-all disabled:cursor-not-allowed backdrop-blur-md"
            style={{
              background: "linear-gradient(135deg, rgba(255, 20, 147, 0.7) 0%, rgba(255, 105, 180, 0.5) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.2)",
              letterSpacing: "0.14em",
              boxShadow: "0 4px 18px rgba(255, 20, 147, 0.3)",
            }}
          >
            {/* Shimmer sweep during loading */}
            {apiState === "loading" && (
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%)",
                }}
                animate={{ x: ["-120%", "220%"] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
              />
            )}
            {apiState === "loading" ? "VERIFYING…" : "BEGIN"}
          </motion.button>

        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginScreen;
