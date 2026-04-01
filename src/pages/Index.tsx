import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import clayPot from "@/assets/clay-pot.png";
import potWin from "@/assets/pot-broken-win.png";
import potEmpty from "@/assets/pot-broken-empty.png";
import luvEsenceLogo from "@/assets/luvesence-logo.png";
import gameBg from "@/assets/game-bg.jpg";

const TOTAL_POTS = 5;
const MAX_PICKS_PER_TRY = 2;
const MAX_TRIES = 2;

const confettiEmojis = Array.from({ length: 15 }).map(() => "🌸");

const FloatingEmoji = ({ emoji, delay }: { emoji: string; delay: number }) => (
  <motion.span
    className="pointer-events-none fixed text-2xl z-[100]"
    initial={{ opacity: 1, y: 0, x: 0, scale: 0 }}
    animate={{
      opacity: [1, 1, 0],
      y: -400,
      x: (Math.random() - 0.5) * 400,
      rotate: Math.random() * 360,
      scale: [0, 1.2, 0.8]
    }}
    transition={{ duration: 2.5, delay, ease: "easeOut" }}
    style={{ left: "50%", top: "50%", marginLeft: "-12px", marginTop: "-12px", willChange: "transform, opacity" }}
  >
    {emoji}
  </motion.span>
);

const CursorBat = ({ isSwinging, isMobile, forceX, forceY }: { isSwinging: boolean, isMobile: boolean, forceX?: number, forceY?: number }) => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Zero-lag instantaneous spring for deterministic physics
  const springConfig = { damping: 25, stiffness: 1000, mass: 0.05 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isMobile) return;
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY, isMobile]);

  useEffect(() => {
    if (isMobile && forceX !== undefined && forceY !== undefined && isSwinging) {
      cursorX.set(forceX);
      cursorY.set(forceY);
    }
  }, [isMobile, forceX, forceY, isSwinging, cursorX, cursorY]);

  if (isMobile && !isSwinging) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[100] top-0 left-0"
      style={{ x: smoothX, y: smoothY }}
    >
      <motion.div
        className="origin-bottom-left"
        initial={{ rotate: 15, scale: isMobile ? 0.65 : 1 }}
        animate={{
          rotate: isSwinging ? 90 : 15,
          scale: isMobile ? 0.65 : 1
        }} // 75-degree arc
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        style={{ x: "-30%", y: "-90%" }}
      >
        <svg width="60" height="200" viewBox="0 0 60 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          <defs>
            <linearGradient id="batPink" x1="0" y1="0" x2="60" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFE4E1" />
              <stop offset="35%" stopColor="#FFB6C1" />
              <stop offset="70%" stopColor="#FF69B4" />
              <stop offset="100%" stopColor="#C71585" />
            </linearGradient>
            <linearGradient id="batGrip" x1="0" y1="150" x2="60" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF0F5" />
              <stop offset="100%" stopColor="#FFC0CB" />
            </linearGradient>
          </defs>
          <rect x="15" y="10" width="30" height="180" rx="15" fill="url(#batPink)" stroke="#FFF" strokeWidth="1.5" strokeOpacity="0.6" />
          <rect x="15" y="140" width="30" height="50" rx="15" fill="url(#batGrip)" />
          <rect x="13" y="145" width="34" height="4" fill="#FF1493" />
          <rect x="13" y="155" width="34" height="4" fill="#FF1493" />
          <rect x="13" y="165" width="34" height="4" fill="#FF1493" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

const PinkSplatterFragment = ({ index }: { index: number }) => {
  const angle = (index * 45 * Math.PI) / 180 + (Math.random() - 0.5);
  const distance = 80 + Math.random() * 80;
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        background: index % 2 === 0 ? "#FF1493" : "#FFc0cb",
        width: `${4 + Math.random() * 6}px`,
        height: `${4 + Math.random() * 6}px`,
        boxShadow: "0 0 10px rgba(255, 20, 147, 0.6)",
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance + 50,
        opacity: 0,
        scale: 0,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
};

// Flower particle for celebration
const CelebrationFlower = ({ index }: { index: number }) => {
  const angle = (index * 360 / 6) * Math.PI / 180 + Math.random();
  const distance = 80 + Math.random() * 60;
  return (
    <motion.div
      className="absolute text-xl sm:text-2xl"
      initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 80,
        scale: [0, 1.2, 1],
        opacity: [1, 1, 0],
        rotate: Math.random() * 360
      }}
      transition={{ duration: 1.8, ease: "easeOut" }}
    >
      🌸
    </motion.div>
  );
};

const Sparkle = ({ index }: { index: number }) => {
  const angle = (index * 360 / 12) * Math.PI / 180;
  const distance = 40 + Math.random() * 80;
  return (
    <motion.div
      className="absolute h-2 w-2 rounded-full"
      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0]
      }}
      transition={{ duration: 1.2, delay: Math.random() * 0.5, ease: "easeOut" }}
      style={{
        background: index % 2 === 0 ? "#FF1493" : "#FFB6C1",
        boxShadow: "0 0 10px #FF1493",
        willChange: "transform, opacity"
      }}
    />
  );
};

const VictoryPot = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <Sparkle key={`sp-${i}`} index={i} />
        ))}
      </div>
      <motion.img
        src={potWin}
        alt="Victory Pot"
        className="h-[200px] w-[200px] sm:h-44 sm:w-44 object-contain scale-[0.75] sm:scale-75 drop-shadow-[0_0_50px_rgba(255,105,180,0.8)] relative z-10 flex-shrink-0"
        style={{ x: 15, y: 10 }} // Offset fine-tuned to align perfectly with the rope
        initial={{ filter: "brightness(1) saturate(1)" }}
        animate={{ filter: ["brightness(1) saturate(1)", "brightness(1.8) saturate(1.8)", "brightness(1) saturate(1)"] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
};

interface IndexProps {
  phone: string;
}

const API_URL = "https://script.google.com/macros/s/AKfycby2yGXvPWb_UufEUkwbntqlm7dvpSZDi2wpJuQ6vfzWR3RdjWl8fTyvq49OkXYme04f/exec";

const Index = ({ phone }: IndexProps) => {
  const [currentTry, setCurrentTry] = useState(1);
  const [picksThisTry, setPicksThisTry] = useState(0);
  const [revealedPots, setRevealedPots] = useState<Set<number>>(new Set());
  const [won, setWon] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pendingNextTry, setPendingNextTry] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountCodesList, setDiscountCodesList] = useState<string[]>([]);
  const [winRevealIndex, setWinRevealIndex] = useState<number | null>(null);

  // Deterministic Logic based on phone
  const safePhoneNum = parseInt(phone.replace(/\D/g, '').slice(-3)) || 0;
  const winningPot = safePhoneNum % TOTAL_POTS;

  const [isSwinging, setIsSwinging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStrikePos, setMobileStrikePos] = useState({ x: 0, y: 0 });

  const gameOver = won !== null;
  const canRetry = pendingNextTry && currentTry < MAX_TRIES;
  const finalLoss = won === false;
  const showModal = gameOver || finalLoss || canRetry;

  // Cursor Management
  useEffect(() => {
    if (isMobile) {
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.cursor = showModal ? 'auto' : 'none';
    }
  }, [showModal, isMobile]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1c-BJMLAUPVN3vJ9K7uesj0Z980aX7T4ujCveGFzTn2g/Sheet1")
      .then(res => res.json())
      .then(data => {
        const codes: string[] = [];
        if (Array.isArray(data) && data.length > 0) {
          const firstRow = data[0];
          const keys = Object.keys(firstRow);
          if (keys.length > 0) {
            const key = keys[0];
            const isProbablyCode = key.length > 3 && key.toLowerCase() !== "code" && key.toLowerCase() !== "discount code";
            if (isProbablyCode) codes.push(key);
            data.forEach((row: any) => {
              const val = Object.values(row)[0];
              if (val && String(val).trim().length > 0) codes.push(String(val));
            });
          }
        }
        setDiscountCodesList(codes);
      })
      .catch(err => console.error("OpenSheet Error:", err));
  }, []);

  const handlePick = useCallback(
    (index: number, e: React.MouseEvent | React.TouchEvent) => {
      const isRevealed = revealedPots.has(index);
      if (showModal || isRevealed || pendingNextTry || apiLoading) return;

      if ("touches" in e) {
        setMobileStrikePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }

      setIsSwinging(true);
      setTimeout(() => setIsSwinging(false), 200);

      const impactDelay = isMobile ? 80 : 120;

      // Impact Timing
      setTimeout(() => {
        // Prioritize reveal state for instant visual feedback
        setRevealedPots((prev) => {
          const next = new Set(prev);
          next.add(index);
          return next;
        });

        const nextPicks = picksThisTry + 1;
        setPicksThisTry(nextPicks);

        if (index === winningPot) {
          setApiLoading(true);

          let assignedCode = "AVURUDU2026";
          if (discountCodesList.length > 0) {
            const codeIndex = safePhoneNum % discountCodesList.length;
            assignedCode = discountCodesList[codeIndex];
          }

          // Immediately show celebration
          setWinRevealIndex(index);
          setShowConfetti(true);

          // Force a minimum base delay for celebratory feel before showing the modal
          const winStartTime = Date.now();

          fetch(API_URL, {
            method: "POST",
            mode: "cors",
            redirect: "follow",
            body: JSON.stringify({ action: "win", phone, code: assignedCode }),
          }).finally(() => {
            const elapsedTime = Date.now() - winStartTime;
            const targetDelay = isMobile ? 300 : 1000;
            const remainingDelay = Math.max(0, targetDelay - elapsedTime);

            setTimeout(() => {
              setDiscountCode(assignedCode);
              setApiLoading(false);
              setWon(true);
            }, remainingDelay);
          });
        } else if (nextPicks >= MAX_PICKS_PER_TRY) {
          if (currentTry >= MAX_TRIES) {
            setTimeout(() => setWon(false), 900);
          } else {
            setTimeout(() => setPendingNextTry(true), 1200);
          }
        }
      }, impactDelay);
    },
    [revealedPots, showModal, pendingNextTry, apiLoading, isSwinging, picksThisTry, winningPot, safePhoneNum, discountCodesList, phone, currentTry]
  );

  const startNextTry = () => {
    setCurrentTry(prev => prev + 1);
    setPicksThisTry(0);
    setRevealedPots(new Set());
    setPendingNextTry(false);
    setWinRevealIndex(null);
  };

  return (
    <>
      <style>{`
        @keyframes pendulum {
          0% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
          100% { transform: rotate(-3deg); }
        }
      `}</style>
      {!showModal && (
        <CursorBat isSwinging={isSwinging} isMobile={isMobile} forceX={mobileStrikePos.x} forceY={mobileStrikePos.y} />
      )}

      <motion.div
        className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden p-6 transition-colors duration-700"
        style={{
          background: "transparent",
        }}
      >
        <div
          className="fixed inset-0 pointer-events-none z-[-1]"
          style={{
            backgroundImage: `url(${gameBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 pointer-events-none bg-pink-100/30 z-[-1]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,rgba(255,20,147,0.12)_100%)] mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(255,105,180,0.5) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <motion.div
          className="fixed top-0 z-[70] w-full flex justify-center px-4 pt-4 pb-3"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
        >
          {/* Top Branding Pill */}
          <div
            className="flex items-center gap-5 rounded-full px-8 py-4"
            style={{
              background: "linear-gradient(135deg, rgba(255, 20, 147, 0.98) 0%, rgba(255, 105, 180, 0.98) 25%, rgba(255, 255, 255, 1) 60%, rgba(255, 255, 255, 1) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.85)",
              boxShadow: "0 8px 32px rgba(255, 20, 147, 0.2), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
            }}
          >
            <img src={luvEsenceLogo} alt="LuvEsence" className="h-10 sm:h-14 w-auto object-contain flex-shrink-0" style={{ filter: "drop-shadow(0 0 10px rgba(255,20,147,0.3))" }} />
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-[rgba(255,105,180,0.5)] to-transparent flex-shrink-0" />
            <div className="flex flex-col items-start leading-none">
              <span
                className="text-2xl sm:text-3xl font-black tracking-widest leading-tight py-1"
                style={{
                  background: "linear-gradient(90deg, #FF1493 0%, #db2777 50%, #FF69B4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                කණාමුට්ටිය
              </span>
              <span className="text-[10px] font-bold tracking-[0.35em] text-[#db2777] uppercase mt-0.5">
                Avurudu Challenge
              </span>
            </div>
          </div>
        </motion.div>

        {/* Centered Try Pill & Mobile Strike Hint */}
        {!gameOver && !canRetry && (
          <motion.div
            className="fixed left-0 right-0 bottom-10 flex flex-col items-center gap-3 z-[60] pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isMobile && !apiLoading && (
              <motion.div
                className="rounded-full border border-white/30 bg-white/40 px-5 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase text-[#FF1493] backdrop-blur-xl shadow-lg border-pink-200/50"
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1, 0.98] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Tap to Strike ✦
              </motion.div>
            )}
            <div className="rounded-full border border-[#FF1493]/30 bg-white/50 px-8 py-2.5 text-sm font-bold backdrop-blur-2xl shadow-[0_4px_24px_rgba(255,20,147,0.25)] text-black">
              Try <span className="text-[#FF1493] px-1 text-base">{currentTry}</span> of {MAX_TRIES}
            </div>
          </motion.div>
        )}

        <div className="z-10 flex flex-nowrap justify-center gap-2 sm:gap-6 w-full max-w-5xl px-4 pt-16">
          {Array.from({ length: TOTAL_POTS }).map((_, i) => {
            const isRevealed = revealedPots.has(i);
            const isWin = i === winningPot && isRevealed;
            const isLoss = i !== winningPot && isRevealed;
            const isInteractable = !isRevealed && !gameOver && !canRetry && !apiLoading;
            const isVictoryPot = winRevealIndex === i;

            return (
              <motion.div
                key={`${currentTry}-${i}`}
                className="relative basis-[18%] sm:basis-[16%]"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                style={{ willChange: "transform, opacity" }}
              >
                <div
                  className="w-full h-full flex justify-center"
                  style={{
                    transformOrigin: "50% -300px",
                    animation: `pendulum 4s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <motion.button
                    disabled={!isInteractable}
                    className={`group relative flex flex-col items-center justify-center transition-all duration-500
                      ${!isInteractable && !isRevealed ? "opacity-30 grayscale saturate-0" : ""}
                    `}
                    whileHover={isInteractable ? { scale: 1.05, y: 5 } : {}}
                    whileTap={isInteractable ? { scale: 0.95 } : {}}
                  >
                    {/* Invisible Strike Range: Allows the whole bat body to hit the pot without shifting UI */}
                    {isInteractable && (
                      <div
                        className="absolute inset-x-[-25px] top-[-150px] bottom-[-30px] z-[60] cursor-none"
                        onMouseDown={(e) => handlePick(i, e)}
                        onTouchStart={(e) => handlePick(i, e)}
                      />
                    )}
                    <div className={`relative ${isRevealed ? '' : 'drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] transition-all duration-300'}`}>
                      {/* Golden rope — fail-safe positioning dropping behind the pot */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none bottom-[32%] sm:bottom-[20%]"
                        style={{
                          top: "-1000px",
                          width: "5px",
                          background: "repeating-linear-gradient(180deg, #BF953F 0px, #FCF6BA 3px, #AA771C 6px)",
                          boxShadow: "inset 1px 0 2px rgba(255,255,255,0.4), inset -1px 0 2px rgba(0,0,0,0.3)",
                          zIndex: -1,
                        }}
                      />

                      <div className={`
                        ${isLoss ? 'translate-y-[20px] sm:translate-y-[10px]' :
                          (isWin || isVictoryPot) ? 'translate-x-[5px] translate-y-[23px] sm:translate-x-[8px] sm:translate-y-[12px]' :
                            'translate-y-[15px] sm:translate-y-0'}
                      `}>
                        {isRevealed && !isWin && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                            {Array.from({ length: 12 }).map((_, idx) => (
                              <PinkSplatterFragment key={idx} index={idx} />
                            ))}
                          </div>
                        )}

                        {isVictoryPot && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                            {Array.from({ length: 12 }).map((_, idx) => (
                              <Sparkle key={`sp-${idx}`} index={idx} />
                            ))}
                          </div>
                        )}

                        <img
                          src={isVictoryPot ? potWin : (isRevealed ? (isWin ? potWin : potEmpty) : clayPot)}
                          alt="Pot"
                          className="relative z-10 h-[200px] w-[200px] sm:h-44 sm:w-44 object-contain flex-shrink-0"
                        />
                      </div>
                    </div>

                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* UI Overlays */}
        <AnimatePresence>
          {canRetry && (
            <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-pink-100/30 backdrop-blur-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                className="flex flex-col items-center gap-5 text-center p-10 rounded-[2.5rem] max-w-[90%] sm:max-w-sm"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(255,230,240,0.88) 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1.5px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 20px 60px rgba(255,20,147,0.18), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
                }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="text-5xl mb-1">🏺</div>
                <p className="text-2xl font-black text-[#FF1493] uppercase tracking-widest">
                  Missed!
                </p>
                <p className="text-sm font-semibold text-[#be185d]/80 max-w-[220px] leading-relaxed">
                  That was an empty pot. You have one final chance to find the treasure!
                </p>
                <motion.button
                  onClick={startNextTry}
                  className="mt-2 px-12 py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)",
                    boxShadow: "0 6px 24px rgba(255,20,147,0.4)",
                    color: "#fff",
                    textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255,20,147,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Strike Again ✦
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {won === true && (
            <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-pink-100/30 backdrop-blur-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                className="flex flex-col items-center gap-5 text-center p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] max-w-[92%] sm:max-w-sm relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,225,240,0.90) 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1.5px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 24px 64px rgba(255,20,147,0.2), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
                }}
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
              >
                {/* Decorative glow blob */}
                <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #FF1493, transparent 70%)" }} />

                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF1493] to-[#FF69B4] shadow-[0_0_30px_rgba(255,20,147,0.5)] mb-1">
                  <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <p className="text-5xl sm:text-6xl font-black tracking-tighter" style={{ background: "linear-gradient(90deg, #FF1493, #FF69B4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", textShadow: "none" }}>
                  VICTORY!
                </p>

                <div className="w-full rounded-[2rem] overflow-hidden border-2 border-[#FF1493]/30" style={{ background: "rgba(255, 220, 240, 0.98)", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(255, 20, 147, 0.35)" }}>
                  {/* Header Section */}
                  <div className="w-full bg-gradient-to-r from-pink-100/40 via-pink-100/60 to-pink-100/40 border-b border-pink-100/80 py-3 px-4 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF1493]">
                      You've won a 15% discount
                    </p>
                  </div>

                  {/* Content Body */}
                  <div className="w-full p-5 sm:p-6 flex flex-col items-center">
                    {discountCode && (
                      <div className="w-full rounded-2xl p-4 text-center mb-4 transition-transform hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)", boxShadow: "0 8px 32px rgba(255,20,147,0.25)" }}>
                        <p className="text-[9px] font-bold text-white/70 mb-0.5 tracking-widest uppercase">Redeem Code</p>
                        <p className="text-lg sm:text-xl font-black text-white tracking-wide drop-shadow-sm break-all">{discountCode}</p>
                      </div>
                    )}

                    <div className="h-px w-1/2 bg-gradient-to-r from-transparent via-pink-200/50 to-transparent mb-4" />

                    <p className="text-[10px] font-bold text-[#be185d]/70 leading-relaxed text-center px-4">
                      Sent to <span className="text-[#FF1493] font-black">{phone}</span> via SMS!
                    </p>
                  </div>
                </div>

                <p className="text-xl sm:text-2xl font-black" style={{ background: "linear-gradient(90deg, #FF1493 0%, #db2777 50%, #FF69B4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  සුභ අලුත් අවුරුද්දක් වේවා!
                </p>
                <a href="https://luvesence.com/" className="text-[10px] uppercase font-black tracking-[0.2em] text-[#db2777]/60 border-b border-[#db2777]/30 pb-0.5 hover:text-[#FF1493] hover:border-[#FF1493] transition-colors">
                  Return to Website →
                </a>
              </motion.div>
            </motion.div>
          )}

          {finalLoss && (
            <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-pink-100/30 backdrop-blur-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                className="flex flex-col items-center gap-5 text-center p-10 rounded-[2.5rem] sm:rounded-[3.5rem] max-w-[92%] sm:max-w-sm relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,225,240,0.90) 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1.5px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 24px 64px rgba(255,20,147,0.15), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
                }}
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
              >
                {/* Decorative glow blob */}
                <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #FF69B4, transparent 70%)" }} />

                <div className="text-5xl">🍂</div>
                <p className="text-3xl sm:text-4xl font-black text-[#be185d] uppercase tracking-tighter">Better Luck Next Time</p>
                <p className="text-sm font-semibold text-[#db2777]/70 leading-relaxed max-w-[200px]">
                  No attempts remaining :C
                </p>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(255,105,180,0.4)] to-transparent" />

                <p className="text-xl sm:text-2xl font-black" style={{ background: "linear-gradient(90deg, #FF1493 0%, #db2777 50%, #FF69B4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  සුභ අලුත් අවුරුද්දක් වේවා!
                </p>
                <a href="https://luvesence.com/" className="text-[10px] uppercase font-black tracking-[0.2em] text-[#db2777]/60 border-b border-[#db2777]/30 pb-0.5 hover:text-[#FF1493] hover:border-[#FF1493] transition-colors">
                  Return to Website →
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showConfetti &&
          confettiEmojis.map((emoji, i) => (
            <FloatingEmoji key={i} emoji={emoji} delay={i * 0.1} />
          ))}
      </motion.div>
    </>
  );
};

export default Index;
