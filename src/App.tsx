import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import type { MouseEvent } from "react";
import photo1 from "./memories/photo1.jpeg";
import photo2 from "./memories/photo2.jpeg";
import photo3 from "./memories/photo3.jpeg";
import photo4 from "./memories/photo4.jpeg";
import video1 from "./memories/video1.mp4";

// ---------------- TYPES ----------------
type Card = {
  id: number;
  hasGift: boolean;
};

export default function App() {
  const { width, height } = useWindowSize();
  const reduceMotion = useReducedMotion();
  const totalCards = 6;
  const stageOrder: Array<"button" | "wheel" | "shuffle" | "cards" | "win"> = [
    "button",
    "wheel",
    "shuffle",
    "cards",
    "win",
  ];

  const images = [
    photo1,
    photo2,
    photo3,
    photo4,
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openNote, setOpenNote] = useState(false);

  const [stage, setStage] = useState<
    "button" | "wheel" | "shuffle" | "cards" | "win"
  >(
    "button"
  );

  const [checked, setChecked] = useState(false);
  const [btnX, setBtnX] = useState(0);
  const [btnY, setBtnY] = useState(0);
  const [surrenderCountdown, setSurrenderCountdown] = useState(10);
  const [wrongCard, setWrongCard] = useState<Card[]>([]);

  const [revealGift, setRevealGift] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBottomBlast, setShowBottomBlast] = useState(false);
  const [bottomBlastOpacity, setBottomBlastOpacity] = useState(1);
  const [partyBurstSource, setPartyBurstSource] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [partyMode, setPartyMode] = useState(true);
  const [funMessageIndex, setFunMessageIndex] = useState(0);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [luckyCharm, setLuckyCharm] = useState("🍀");
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [hasSpunWheel, setHasSpunWheel] = useState(false);
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
  const wheelOptions = useMemo(
    () => [
      "No gift 😶",
      "Big Hug 🤗",
      "1 Gift 🎁",
      "2 Gifts 🎁",
      "3 Gifts 🎁",
      "4 Gifts 🎁",
      "5 Gifts 🎁",
      "6 Gifts 🎁",
      "7 Gifts 🎁",
      "8 Gifts 🎁",
    ],
    []
  );
  const wheelStopOptions = useMemo(
    () => ["1 Gift 🎁", "2 Gifts 🎁", "3 Gifts 🎁"],
    []
  );
  const wheelSliceColors = [
    "#fb7185",
    "#a78bfa",
    "#22d3ee",
    "#34d399",
    "#f59e0b",
    "#f472b6",
  ];
  const wheelGradient = useMemo(() => {
    const segmentAngle = 360 / wheelOptions.length;
    return `conic-gradient(${wheelOptions
      .map((_, index) => {
        const start = index * segmentAngle;
        const end = start + segmentAngle;
        const color = wheelSliceColors[index % wheelSliceColors.length];
        return `${color} ${start}deg ${end}deg`;
      })
      .join(", ")})`;
  }, [wheelOptions]);

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
      wheel: {
        title: "Birthday Wheel",
        subtitle: "",
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
    setBtnY(0);
    setSurrenderCountdown(10);
    setWrongCard([]);
    setRevealGift(true);
    setCards([]);
    setShowConfetti(false);
    setShowBottomBlast(false);
    setBottomBlastOpacity(1);
    setPartyBurstSource(null);
    setStatusMessage(null);
    setFunMessageIndex(0);
    setCompliment(null);
    setLuckyCharm("🍀");
    setWheelRotation(0);
    setWheelResult(null);
    setIsWheelSpinning(false);
    setHasSpunWheel(false);
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

  useEffect(() => {
    if (stage !== "button") return;
    if (checked) {
      setSurrenderCountdown(10);
      return;
    }

    setSurrenderCountdown(10);
    const countdown = setInterval(() => {
      setSurrenderCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setChecked(true);
          setStatusMessage("Auto-surrender activated after 10 seconds.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [checked, stage]);

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
  const triggerPartyBurst = (event?: MouseEvent<HTMLButtonElement>) => {
    setBottomBlastOpacity(1);
    if (event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPartyBurstSource({
        // Emit exactly from the button center.
        x: rect.left + rect.width / 2 - 2,
        y: rect.top + rect.height / 2 - 2,
        w: 4,
        h: 4,
      });
    } else {
      setPartyBurstSource({
        x: Math.max(0, width / 2 - 2),
        y: Math.max(0, height - 110),
        w: 4,
        h: 4,
      });
    }

    setShowBottomBlast(true);
    setTimeout(() => setBottomBlastOpacity(0), 3800);
    setTimeout(() => {
      setShowBottomBlast(false);
      setBottomBlastOpacity(1);
      setPartyBurstSource(null);
    }, 5000);
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
  const spinWheel = () => {
    if (isWheelSpinning || hasSpunWheel) return;
    setIsWheelSpinning(true);
    setWheelResult(null);

    const selectedStop =
      wheelStopOptions[Math.floor(Math.random() * wheelStopOptions.length)];
    const foundIndex = wheelOptions.indexOf(selectedStop);
    const selectedIndex = foundIndex >= 0 ? foundIndex : 3;
    const segmentAngle = 360 / wheelOptions.length;
    const targetAngle = selectedIndex * segmentAngle + segmentAngle / 2;
    const fullRounds = 360 * (5 + Math.floor(Math.random() * 3));
    const finalRotation = wheelRotation + fullRounds + (360 - targetAngle);

    setWheelRotation(finalRotation);
    setTimeout(() => {
      setWheelResult(selectedStop);
      setStatusMessage(`Wheel says: ${selectedStop}`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      setIsWheelSpinning(false);
      setHasSpunWheel(true);
    }, 4300);
  };
  const moveCatchButton = () => {
    if (checked) return;
    // Let the button dodge in both horizontal and vertical directions.
    const maxX = Math.max(35, Math.min(width * 0.28, 240));
    const maxY = Math.max(18, Math.min(height * 0.12, 100));
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;
    setBtnX(directionX * (Math.random() * maxX));
    setBtnY(directionY * (Math.random() * maxY));
  };

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
            style={{ zIndex: 60, pointerEvents: "none" }}
          />
          <Confetti
            width={width}
            height={height}
            numberOfPieces={burstPieces}
            gravity={0.1}
            recycle={false}
            wind={0.02}
            colors={["#fef08a", "#f9a8d4", "#c4b5fd", "#86efac", "#93c5fd"]}
            style={{ zIndex: 60, pointerEvents: "none" }}
          />
        </>
      )}
      {showBottomBlast && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: bottomBlastOpacity }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-[85]"
        >
          <Confetti
            width={width}
            height={height}
            numberOfPieces={width < 640 ? 260 : 420}
            recycle={false}
            gravity={0.2}
            confettiSource={
              partyBurstSource ?? {
                x: Math.max(0, width / 2 - 2),
                y: Math.max(0, height - 110),
                w: 4,
                h: 4,
              }
            }
            initialVelocityY={{ min: -22, max: -10 }}
            initialVelocityX={{ min: -10, max: 10 }}
            colors={["#fde047", "#f9a8d4", "#a7f3d0", "#93c5fd", "#c4b5fd"]}
            style={{ zIndex: 85, pointerEvents: "none" }}
          />
        </motion.div>
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
                animate={{ x: btnX, y: btnY }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={moveCatchButton}
                onClick={() => {
                  if (!checked) {
                    setStatusMessage("You caught it! Moving to the wheel.");
                    setStage("wheel");
                  } else {
                    setStatusMessage("First spin the wheel, then we shuffle the cards.");
                    setStage("wheel");
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
            {!checked && (
              <p className="text-xs text-yellow-200/90 sm:text-sm">
                Auto-surrender in {surrenderCountdown}s
              </p>
            )}
          </motion.div>
        )}

        {/* ---------- STAGE 2 : WHEEL ---------- */}
        {stage === "wheel" && (
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="mb-5 text-sm text-white/80 sm:text-base">
              How many gifts will you receive on this birthday from Gunjan?<br/>
              Don't forget to take a screenshot.
            </p>

            <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
              <div className="absolute left-1/2 top-[-10px] z-20 h-0 w-0 -translate-x-1/2 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-yellow-300 drop-shadow-[0_0_14px_rgba(253,224,71,0.85)]" />
              <motion.div
                animate={{ rotate: wheelRotation }}
                transition={{ duration: 4.2, ease: [0.15, 0.9, 0.2, 1] }}
                className="relative h-full w-full rounded-full border-4 border-white/25 shadow-[0_0_55px_rgba(236,72,153,0.35)]"
                style={{
                  background: wheelGradient,
                }}
              >
                {wheelOptions.map((option, index) => {
                  const segmentAngle = 360 / wheelOptions.length;
                  const angle = index * segmentAngle + segmentAngle / 2 - 90;
                  const radius = width < 640 ? 112 : 126;
                  const radians = (angle * Math.PI) / 180;
                  const x = Math.cos(radians) * radius;
                  const y = Math.sin(radians) * radius;
                  return (
                    <span
                      key={option}
                      className="absolute rounded-full border border-white/35 bg-black/35 px-2 py-1 text-[10px] font-semibold leading-none text-white shadow-[0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-[2px] sm:text-xs"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {option.replace(" 🎁", "")}
                    </span>
                  );
                })}
                <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm" />
              </motion.div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={spinWheel}
                disabled={isWheelSpinning || hasSpunWheel}
                className="rounded-2xl border border-pink-200/30 bg-gradient-to-r from-pink-500/80 to-violet-500/80 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {isWheelSpinning
                  ? "Spinning..."
                  : hasSpunWheel
                    ? "Spin Used ✅"
                    : "Spin The Wheel 🎡"}
              </button>
              <button
                onClick={() => setStage("shuffle")}
                disabled={!wheelResult || isWheelSpinning}
                className="rounded-2xl border border-white/20 bg-white/15 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                Continue To Shuffle
              </button>
            </div>

            {wheelResult && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm font-semibold text-yellow-200 sm:text-base"
              >
                Result: {wheelResult}
              </motion.p>
            )}
          </div>
        )}

        {/* ---------- STAGE 3 : SHUFFLE ---------- */}
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

        {/* ---------- STAGE 4 : PICK CARD ---------- */}
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

        {/* ---------- STAGE 5 : WIN ---------- */}
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
                  <source src={video1} type="video/mp4" />
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
                onClick={(event) => triggerPartyBurst(event)}
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

        {/* ---------- MODAL ---------- */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/[0.05] px-3 backdrop-blur-md sm:px-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/25 bg-[linear-gradient(145deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-4"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-white/95">
                <span className="text-xs uppercase tracking-[0.2em] text-white/75 sm:text-sm">
                  Memory Gallery
                </span>
                <span className="text-xs font-semibold sm:text-sm">
                  {activeIndex + 1} / {images.length}
                </span>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close image modal"
                className="absolute right-4 top-16 z-20 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xl text-white transition hover:bg-white/25 sm:right-6 sm:top-20 sm:text-2xl"
              >
                ✕
              </button>

              <div className="relative flex items-center justify-center rounded-2xl border border-white/20 bg-white/[0.08] p-2 sm:p-3">
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous image"
                  className="absolute left-2 z-10 select-none rounded-full border border-white/30 bg-white/15 px-3 py-1 text-2xl text-white transition hover:-translate-y-0.5 hover:bg-white/25 sm:left-4 sm:text-3xl"
                >
                  ‹
                </button>

                <motion.img
                  key={activeIndex}
                  src={images[activeIndex]}
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.28 }}
                  className="h-[50vh] w-full rounded-2xl object-contain sm:h-[62vh]"
                />

                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="Next image"
                  className="absolute right-2 z-10 select-none rounded-full border border-white/30 bg-white/15 px-3 py-1 text-2xl text-white transition hover:-translate-y-0.5 hover:bg-white/25 sm:right-4 sm:text-3xl"
                >
                  ›
                </button>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                {images.map((src, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={() => setActiveIndex(index)}
                    className={`overflow-hidden rounded-xl border transition ${
                      activeIndex === index
                        ? "border-pink-300/90 ring-2 ring-pink-300/60"
                        : "border-white/20 hover:border-white/45"
                    }`}
                    aria-label={`Open image ${index + 1}`}
                  >
                    <img
                      src={src}
                      className="h-16 w-full object-cover sm:h-20"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {compliment && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="pointer-events-none fixed inset-x-3 bottom-6 z-[90] mx-auto w-auto max-w-md rounded-2xl border border-white/20 bg-black/70 px-4 py-3 text-center text-sm text-white/95 backdrop-blur-md [overflow-wrap:anywhere] sm:inset-x-auto sm:left-1/2 sm:w-[92%] sm:max-w-md sm:-translate-x-1/2 sm:text-base"
        >
          {compliment}
        </motion.div>
      )}
    </div>
  );
}
