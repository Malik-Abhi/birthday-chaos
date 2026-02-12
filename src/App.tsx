import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

// ---------------- TYPES ----------------
type Card = {
  id: number;
  hasGift: boolean;
};

export default function App() {
  const { width, height } = useWindowSize();
  const reduceMotion = useReducedMotion();
  const totalCards = 6;
  const stageOrder: Array<"button" | "shuffle" | "cards" | "win"> = [
    "button",
    "shuffle",
    "cards",
    "win",
  ];

  const images = [
    "/memories/photo1.jpg",
    "/memories/photo2.jpg",
    "/memories/photo3.jpg",
    "/memories/photo4.jpg",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openNote, setOpenNote] = useState(false);

  const [stage, setStage] = useState<"button" | "shuffle" | "cards" | "win">(
    "button"
  );

  const [checked, setChecked] = useState(false);
  const [btnX, setBtnX] = useState(0);
  const [wrongCard, setWrongCard] = useState<Card[]>([]);

  const [revealGift, setRevealGift] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [partyMode, setPartyMode] = useState(true);
  const [funMessageIndex, setFunMessageIndex] = useState(0);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [luckyCharm, setLuckyCharm] = useState("🍀");
  const openNoteHeight = width < 640 ? 620 : 460;
  const confettiPieces = width < 640 ? 360 : 700;
  const burstPieces = width < 640 ? 140 : 260;
  const funMessages = useMemo(
    () => [
      "Level up the vibe. Pick your lucky card.",
      "Party energy detected. Keep going.",
      "This birthday quest is officially chaotic.",
      "One card away from legendary luck.",
      "Confetti is waiting for the win.",
    ],
    []
  );
  const complimentMessages = useMemo(
    () => [
      "You bring main-character energy to every room.",
      "Your smile could start a celebration by itself.",
      "Today looks better because you are in it.",
      "You make people feel lucky to know you.",
      "Certified icon behavior.",
      "Chaos level: fun. Vibe level: elite.",
    ],
    []
  );
  const charmSet = ["🍀", "🌟", "🧿", "🎲", "🦄", "💎", "🪩"];

  const themes = {
    classic: {
      paper: "bg-[radial-gradient(circle_at_top,#fff8dc,#f5deb3)]",
      border: "border-yellow-700",
      rod: "bg-yellow-700",
      text: "text-yellow-900",
      subText: "text-yellow-800/70",
    },
    romantic: {
      paper: "bg-[radial-gradient(circle_at_top,#ffe4e6,#fecdd3)]",
      border: "border-rose-500",
      rod: "bg-rose-500",
      text: "text-rose-900",
      subText: "text-rose-800/70",
    },
    royal: {
      paper: "bg-[radial-gradient(circle_at_top,#ede9fe,#ddd6fe)]",
      border: "border-indigo-600",
      rod: "bg-indigo-600",
      text: "text-indigo-900",
      subText: "text-indigo-800/70",
    },
  };

  const theme = themes.romantic; // classic | romantic | royal

  const stageCopy = useMemo(
    () => ({
      button: {
        title: "Birthday Quest",
        subtitle: "Catch the button or surrender to unlock the surprise",
      },
      shuffle: {
        title: "Watch Closely",
        subtitle: "Memorize where the gift appears before cards get shuffled",
      },
      cards: {
        title: "Pick A Card",
        subtitle: "Only one card hides the gift",
      },
      win: {
        title: "Happy Birthday",
        subtitle: "You found the gift",
      },
    }),
    []
  );

  // ---------------- INIT 6 CARDS ----------------
  const initCards = () => {
    const giftIndex = Math.floor(Math.random() * totalCards);
    setCards(
      Array.from({ length: totalCards }).map((_, i) => ({
        id: i,
        hasGift: i === giftIndex,
      }))
    );
  };

  const resetGame = () => {
    setIsModalOpen(false);
    setActiveIndex(0);
    setOpenNote(false);
    setChecked(false);
    setBtnX(0);
    setWrongCard([]);
    setRevealGift(true);
    setCards([]);
    setShowConfetti(false);
    setStatusMessage(null);
    setFunMessageIndex(0);
    setCompliment(null);
    setLuckyCharm("🍀");
    setStage("button");
  };

  // ---------------- SHUFFLE LOGIC ----------------
  useEffect(() => {
    if (stage === "shuffle") {
      initCards();
      setRevealGift(true);

      // Show gift position first
      const revealTimeout = setTimeout(() => {
        setRevealGift(false);

        let count = 0;
        const interval = setInterval(() => {
          setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
          count++;

          if (count === 6) {
            clearInterval(interval);
            setStage("cards");
          }
        }, 650); // ⬅️ slower shuffle
      }, 1800);

      return () => clearTimeout(revealTimeout);
    }
  }, [stage]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onEscClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };
    window.addEventListener("keydown", onEscClose);
    return () => window.removeEventListener("keydown", onEscClose);
  }, [images.length, isModalOpen]);

  useEffect(() => {
    if (!partyMode || (stage !== "cards" && stage !== "win")) return;
    const ticker = setInterval(() => {
      setFunMessageIndex((current) => (current + 1) % funMessages.length);
    }, 2200);
    return () => clearInterval(ticker);
  }, [funMessages.length, partyMode, stage]);

  // ---------------- PICK CARD ----------------
  const pickCard = (card: Card) => {
    if (wrongCard.some((previousCard) => previousCard.id === card.id)) return;

    if (card.hasGift) {
      setStage("win");
      setShowConfetti(true);
      setStatusMessage("Perfect pick. You found it.");
      setTimeout(() => setShowConfetti(false), 15000);
    } else {
      setWrongCard((previousState) => [...previousState, card]);
      setStatusMessage("Not this one. Try another card.");
    }
  };

  const attemptsUsed = wrongCard.length;
  const cardsRemaining = Math.max(totalCards - attemptsUsed, 1);
  const nextPickOdds = Math.round((1 / cardsRemaining) * 100);
  const stageProgress = ((stageOrder.indexOf(stage) + 1) / stageOrder.length) * 100;
  const triggerPartyBurst = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4500);
  };
  const revealCompliment = () => {
    const randomMessage =
      complimentMessages[Math.floor(Math.random() * complimentMessages.length)];
    setCompliment(randomMessage);
    setTimeout(() => setCompliment(null), 2800);
  };
  const rerollCharm = () => {
    const randomCharm = charmSet[Math.floor(Math.random() * charmSet.length)];
    setLuckyCharm(randomCharm);
  };
  const winBadge =
    attemptsUsed === 0
      ? "Legendary Luck"
      : attemptsUsed <= 2
        ? "Sharp Memory"
        : "Persistent Winner";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_10%,#4b1d5e_0%,#1f163f_35%,#0b1224_100%)] px-3 py-6 sm:px-5 sm:py-10">
      {!reduceMotion &&
        Array.from({ length: 8 }).map((_, sparkIndex) => (
          <motion.span
            key={`spark-${sparkIndex}`}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white/35"
            initial={{
              x: Math.random() * Math.max(width || 1200, 1200),
              y: (height || 900) + Math.random() * 160,
              opacity: 0,
            }}
            animate={{
              y: -120,
              opacity: [0, 0.65, 0],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 7 + sparkIndex * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: sparkIndex * 0.7,
            }}
          />
        ))}

      {/* Glow blobs */}
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 35, -15, 0], y: [0, -15, 20, 0], scale: [1, 1.1, 0.95, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 -top-20 h-[280px] w-[280px] rounded-full bg-pink-500/30 blur-[110px] sm:-left-40 sm:-top-40 sm:h-[420px] sm:w-[420px] sm:blur-[140px]"
      />
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -25, 20, 0], y: [0, 25, -15, 0], scale: [1, 0.95, 1.1, 1] }
        }
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-28 -right-24 h-[260px] w-[260px] rounded-full bg-purple-500/35 blur-[110px] sm:-bottom-[120px] sm:-right-[120px] sm:h-[380px] sm:w-[380px] sm:blur-[140px]"
      />

      {showConfetti && (
        <>
          <Confetti
            width={width}
            height={height}
            numberOfPieces={confettiPieces}
            gravity={0.22}
            recycle={false}
          />
          <Confetti
            width={width}
            height={height}
            numberOfPieces={burstPieces}
            gravity={0.1}
            recycle={false}
            wind={0.02}
            colors={["#fef08a", "#f9a8d4", "#c4b5fd", "#86efac", "#93c5fd"]}
          />
        </>
      )}

      {stage === "win" && !reduceMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, idx) => (
            <motion.span
              key={`celebrate-${idx}`}
              className="absolute text-xl sm:text-2xl"
              initial={{
                x: Math.random() * Math.max(width || 1200, 1200),
                y: (height || 900) + Math.random() * 120,
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 0],
                rotate: [0, Math.random() > 0.5 ? 220 : -220],
              }}
              transition={{
                duration: 4 + Math.random() * 2.4,
                repeat: Infinity,
                ease: "linear",
                delay: idx * 0.22,
              }}
            >
              {["✨", "🎉", "💖", "🎊"][idx % 4]}
            </motion.span>
          ))}
          {Array.from({ length: 10 }).map((_, idx) => (
            <motion.span
              key={`streamer-${idx}`}
              className="absolute h-14 w-1.5 rounded-full bg-gradient-to-b from-yellow-200 to-pink-400 opacity-70"
              initial={{
                x: Math.random() * Math.max(width || 1200, 1200),
                y: -30,
                rotate: Math.random() * 40 - 20,
              }}
              animate={{ y: (height || 900) + 60, rotate: [0, -10, 10, 0] }}
              transition={{
                duration: 2.8 + Math.random() * 1.8,
                repeat: Infinity,
                ease: "linear",
                delay: idx * 0.18,
              }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, idx) => (
            <motion.span
              key={`balloon-${idx}`}
              className="absolute h-12 w-10 rounded-[60%_60%_55%_55%] bg-gradient-to-b from-pink-300 to-fuchsia-500 opacity-65"
              initial={{
                x: Math.random() * Math.max(width || 1200, 1200),
                y: (height || 900) + Math.random() * 180,
              }}
              animate={{ y: -120, x: [0, -12, 10, 0] }}
              transition={{
                duration: 6.5 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 my-2 w-full max-w-6xl rounded-[2rem] border border-white/20 bg-white/[0.08] p-4 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:my-6 sm:p-8 md:p-10 lg:p-12"
      >
        <div className="mb-5 rounded-2xl border border-white/15 bg-white/5 p-3 sm:mb-7">
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-white/70 sm:text-xs">
            <span>Quest Progress</span>
            <div className="flex items-center gap-2">
              <span>
                Step {stageOrder.indexOf(stage) + 1}/{stageOrder.length}
              </span>
              <button
                onClick={() => setPartyMode((current) => !current)}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold normal-case transition sm:text-xs ${
                  partyMode
                    ? "border-pink-300/70 bg-pink-400/20 text-pink-100"
                    : "border-white/30 bg-white/10 text-white/75"
                }`}
              >
                {partyMode ? "Party On" : "Party Off"}
              </button>
            </div>
          </div>
          <div className="mb-2 flex items-center justify-center gap-2 text-[11px] sm:text-xs">
            <span className="rounded-full border border-yellow-200/45 bg-yellow-300/15 px-3 py-1 text-yellow-100">
              Lucky Charm {luckyCharm}
            </span>
            <button
              onClick={rerollCharm}
              className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-white/85 transition hover:bg-white/20"
            >
              Reroll
            </button>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              animate={{ width: `${stageProgress}%` }}
              transition={{ type: "spring", stiffness: 95, damping: 18 }}
              className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-violet-400"
            />
          </div>
        </div>

        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-5 sm:mb-8"
        >
          <motion.h1
            animate={
              partyMode && stage === "win" && !reduceMotion
                ? { scale: [1, 1.03, 1], rotate: [0, -1, 1, 0] }
                : undefined
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-r from-pink-300 via-rose-300 to-violet-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl"
          >
            {stageCopy[stage].title}
          </motion.h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-white/70 sm:text-base">
            {stageCopy[stage].subtitle}
          </p>
          {partyMode && (stage === "cards" || stage === "win") && (
            <motion.p
              key={funMessageIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-2 max-w-xl rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs text-pink-100 sm:text-sm"
            >
              {funMessages[funMessageIndex]}
            </motion.p>
          )}
        </motion.div>

        {/* ---------- STAGE 1 : BUTTON ---------- */}
        {stage === "button" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.09,
                  delayChildren: reduceMotion ? 0 : 0.1,
                },
              },
            }}
            className="mt-8 flex flex-col items-center gap-8 sm:mt-10 sm:gap-10"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
              <motion.button
                animate={{ x: btnX }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!checked) {
                    // Keep motion playful but bounded on small screens.
                    const maxX = Math.max(35, Math.min(width * 0.28, 240));
                    const direction = Math.random() > 0.5 ? 1 : -1;
                    setBtnX(direction * (Math.random() * maxX));
                  } else {
                    setStatusMessage("Game started. Watch the gift carefully.");
                    setStage("shuffle");
                  }
                }}
                aria-label={checked ? "Unlock surprise" : "Catch me button"}
                className={`rounded-2xl px-8 py-3 text-base font-bold text-white shadow-[0_16px_32px_rgba(19,22,42,0.42)] transition-all sm:px-14 sm:py-4 sm:text-lg ${
                  checked
                    ? "bg-gradient-to-r from-emerald-400 to-green-500 hover:brightness-105"
                    : "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:shadow-[0_20px_38px_rgba(184,64,255,0.45)]"
                }`}
              >
                {checked ? "Unlock Surprise 🎁" : "Catch Me"}
              </motion.button>
            </motion.div>

            <motion.label
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white/75 transition hover:bg-white/15 sm:text-base"
            >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="scale-110 accent-pink-500 sm:scale-125"
                />
                Surrender
            </motion.label>
          </motion.div>
        )}

        {/* ---------- STAGE 2 : SHUFFLE ---------- */}
        {stage === "shuffle" && (
          <>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 md:gap-8">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                  className={`flex h-28 items-center justify-center rounded-3xl text-5xl text-white shadow-2xl sm:h-44 sm:text-6xl lg:h-56 lg:text-7xl ${revealGift && card.hasGift
                      ? "scale-105 bg-gradient-to-br from-yellow-400 to-pink-500 ring-4 ring-yellow-300"
                      : "bg-gradient-to-br from-indigo-400 to-purple-600"
                    }`}
                >
                  {revealGift && card.hasGift ? (
                    "🎁"
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 119.53 122.88"
                      width={width < 640 ? 68 : 92}
                      height={width < 640 ? 68 : 92}
                    >
                      <path
                        fill={"#FFF"}
                        fillRule="evenodd"
                        d="M30.14,41.83c.64,0,1.28,0,1.91.06a30.14,30.14,0,1,1,55.52,0c.61,0,1.21-.06,1.83-.06A30.14,30.14,0,1,1,65.55,90.38c5.35,10,11.91,20.24,22.73,25.61v6.89h-57V116c8.36-3,15-12.62,20.84-23.38a30.14,30.14,0,1,1-22-50.78Z"
                      />
                    </svg>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ---------- STAGE 3 : PICK CARD ---------- */}
        {stage === "cards" && (
          <>
            <div className="mt-1 flex flex-wrap justify-center gap-2 sm:gap-3">
              <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 sm:text-sm">
                Attempts: {attemptsUsed}
              </div>
              <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 sm:text-sm">
                Cards left: {cardsRemaining}
              </div>
              <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 sm:text-sm">
                Next-pick odds: {nextPickOdds}%
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 md:gap-8">
              {cards.map((card) => {
                const isWrong = wrongCard.some((wc) => wc.id === card.id);
                return (
                  <motion.div
                    key={card.id}
                    whileHover={!isWrong ? { scale: 1.05, y: -4 } : undefined}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !isWrong && pickCard(card)}
                    role="button"
                    aria-label={isWrong ? `Card ${card.id + 1} already wrong` : `Pick card ${card.id + 1}`}
                    className={`
    flex h-28 items-center justify-center rounded-3xl text-5xl text-white shadow-2xl transition-all duration-300 sm:h-44 sm:text-6xl md:h-52 lg:text-7xl
    ${isWrong
      ? "cursor-not-allowed bg-gray-400/35 grayscale"
      : "cursor-pointer border border-white/20 bg-gradient-to-br from-yellow-400 to-pink-500 hover:brightness-110 hover:shadow-[0_18px_50px_rgba(255,130,180,0.45)]"}
  `}
                  >
                    {isWrong ? "❌" : "❓"}
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {statusMessage && stage !== "win" && (
          <motion.p
            key={statusMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-xs text-white/75 sm:text-sm"
          >
            {statusMessage}
          </motion.p>
        )}

        {/* ---------- STAGE 4 : WIN ---------- */}
        {stage === "win" && (
          <>
            {partyMode && (
              <div className="mb-4 flex items-center justify-center gap-2 text-xl sm:text-2xl">
                {["🥳", "🎂", "🎉", "💃", "🎁"].map((emoji, idx) => (
                  <motion.span
                    key={emoji}
                    animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                    transition={{
                      duration: 0.9,
                      delay: idx * 0.08,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            )}
            <div className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-8 lg:gap-10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {images.map((src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => {
                      setActiveIndex(i);
                      setIsModalOpen(true);
                    }}
                    className="h-32 w-full cursor-pointer rounded-2xl object-cover shadow-2xl ring-1 ring-white/15 transition hover:ring-white/35 sm:h-44 md:h-52 lg:h-56"
                  />
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10"
              >
                <video controls className="h-full min-h-[220px] w-full object-cover sm:min-h-[280px]">
                  <source src="/memories/video1.mp4" type="video/mp4" />
                </video>
              </motion.div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="rounded-full border border-emerald-200/30 bg-emerald-400/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100 sm:text-sm">
                Badge Unlocked: {winBadge}
              </div>
            </div>

            {/* ---------- BIRTHDAY NOTE SCROLL ---------- */}
            <div className="mt-12 flex justify-center sm:mt-16">
              <motion.div
                initial={false}
                animate={openNote ? "open" : "closed"}
                variants={{
                  closed: { height: 120 },
                  open: { height: openNoteHeight },
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full max-w-3xl cursor-pointer overflow-hidden"
                onClick={() => setOpenNote(!openNote)}
              >
                {/* Scroll Rods */}
                <div
                  className={`absolute -top-6 left-0 right-0 h-6 ${theme.rod} rounded-full shadow-lg`}
                />
                <div
                  className={`absolute -bottom-6 left-0 right-0 h-6 ${theme.rod} rounded-full shadow-lg`}
                />

                {/* Paper */}
                <div
                  className={`relative h-full rounded-3xl ${theme.paper} border ${theme.border}
      overflow-y-auto shadow-[0_30px_60px_rgba(0,0,0,0.35)] p-6 sm:p-10`}
                >
                  {!openNote ? (
                    <div
                      className={`h-full flex flex-col items-center justify-center text-center ${theme.text}`}
                    >
                      <p className="text-lg font-semibold sm:text-2xl">
                        📜 Tap to Open Your Note
                      </p>
                      <p className={`mt-2 ${theme.subText}`}>
                        A message just for you
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`text-center ${theme.text}`}
                    >
                      <h2 className="text-3xl sm:text-4xl font-extrabold">
                        💖 Happy Birthday 💖
                      </h2>

                      <p className="mt-6 text-base font-medium leading-relaxed sm:text-xl">
                        Today isn’t just about cake and candles —
                        it’s about celebrating you, your journey,
                        your wins, your growth, and everything amazing
                        that’s coming your way.
                      </p>

                      <p className="mt-6 text-base font-medium leading-relaxed sm:text-xl">
                        May your days be full of laughter,
                        your goals turn into reality,
                        and your life feel as special
                        as you just made this moment 💫
                      </p>

                      <p className="mt-10 text-2xl font-bold">
                        🎂✨ Stay awesome, always ✨🎂
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-14">
              <button
                onClick={revealCompliment}
                className="rounded-2xl border border-cyan-200/30 bg-cyan-400/20 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-400/30 sm:text-base"
              >
                Compliment Drop 💬
              </button>
              <button
                onClick={triggerPartyBurst}
                className="rounded-2xl border border-pink-200/30 bg-gradient-to-r from-fuchsia-500/60 to-pink-500/60 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110 sm:text-base"
              >
                Party Burst 🎇
              </button>
              <button
                onClick={resetGame}
                className="rounded-2xl border border-white/20 bg-white/15 px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/25 sm:px-12 sm:py-4 sm:text-base"
              >
                Play Again 🔄
              </button>
            </div>
          </>
        )}

        {compliment && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[70] w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-white/20 bg-black/60 px-4 py-3 text-center text-sm text-white/95 backdrop-blur-md sm:text-base"
          >
            {compliment}
          </motion.div>
        )}

        {/* ---------- MODAL ---------- */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 backdrop-blur-md sm:px-4"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close image modal"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/15 px-3 py-1 text-2xl text-white transition hover:bg-white/30 sm:right-6 sm:top-6 sm:text-3xl"
            >
              ✕
            </button>

            {/* Slider */}
            <div
              className="relative flex w-full max-w-4xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Prev */}
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                aria-label="Previous image"
                className="absolute left-1 z-10 select-none rounded-full bg-white/15 px-3 py-1 text-3xl text-white transition hover:bg-white/30 sm:left-4 sm:text-4xl"
              >
                ‹
              </button>

              {/* Image */}
              <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="max-h-[80vh] w-full rounded-3xl object-contain shadow-2xl sm:w-auto"
              />

              {/* Next */}
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                aria-label="Next image"
                className="absolute right-1 z-10 select-none rounded-full bg-white/15 px-3 py-1 text-3xl text-white transition hover:bg-white/30 sm:right-4 sm:text-4xl"
              >
                ›
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
