import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

// ---------------- TYPES ----------------
type Card = {
  id: number;
  hasGift: boolean;
};

export default function App() {
  const { width, height } = useWindowSize();

  const images = [
    "/memories/photo1.jpg",
    "/memories/photo2.jpg",
    "/memories/photo3.jpg",
    "/memories/photo4.jpg",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openNote, setOpenNote] = useState(false);


  const [stage, setStage] = useState<
    "button" | "shuffle" | "cards" | "win"
  >("button");

  const [checked, setChecked] = useState(false);
  const [btnX, setBtnX] = useState(0);
  const [wrongCard, setWrongCard] = useState<Card[]>([]);

  const [revealGift, setRevealGift] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

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

  // ---------------- INIT 6 CARDS ----------------
  const initCards = () => {
    const giftIndex = Math.floor(Math.random() * 6);
    setCards(
      Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        hasGift: i === giftIndex,
      }))
    );
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

  // ---------------- PICK CARD ----------------
  const pickCard = (card: Card) => {
    if (card.hasGift) {
      setStage("win");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 15000);
    } else {
      setWrongCard((previousState) => [...previousState, card]);
      console.log(wrongCard, "sss")
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
      {/* Glow blobs */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-pink-500/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[380px] h-[380px] bg-purple-500/30 rounded-full blur-[140px]" />

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={700}
          gravity={0.22}
          recycle={false}
        />
      )}

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mt-5 mb-5 sm:mt-10 sm:mb-10 relative z-10 w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-8 md:p-12 lg:p-14 text-center"
      >
        {/* ---------- STAGE 1 : BUTTON ---------- */}
        {stage === "button" && (
          <>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              🎂 Birthday Quest
            </h1>
            <p className="mt-4 text-white/70">Catch the button… or surrender</p>

            <div className="mt-16 flex flex-col items-center gap-10 relative overflow-hidden">
              <motion.button
                animate={{ x: btnX }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!checked) {
                    const randomX = Math.random() > 0.5
                      ? Math.random() * 260 + 120
                      : -Math.random() * 260 - 120;
                    setBtnX(randomX);
                  } else {
                    setStage("shuffle");
                  }
                }}
                className={`px-14 py-4 rounded-2xl text-lg font-semibold shadow-xl ${checked
                  ? "bg-gradient-to-r from-emerald-400 to-green-500"
                  : "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600"
                  } text-white`}
              >
                {checked ? "Unlock Surprise 🎁" : "Catch Me"}
              </motion.button>

              <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="accent-pink-500 scale-125"
                />
                Surrender
              </label>
            </div>
          </>
        )}

        {/* ---------- STAGE 2 : SHUFFLE ---------- */}
        {stage === "shuffle" && (
          <>
            <h2 className="text-4xl font-bold text-white">🃏 Watch Closely</h2>
            <p className="text-white/60 mt-2">Memorize where the gift is 👀</p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                  className={`h-40 sm:h-48 lg:h-60 rounded-3xl shadow-2xl flex items-center justify-center text-white text-6xl ${revealGift && card.hasGift
                    ? "bg-gradient-to-br from-yellow-400 to-pink-500 ring-4 ring-yellow-300 scale-110"
                    : "bg-gradient-to-br from-indigo-400 to-purple-600"
                    }`}
                >
                  {revealGift && card.hasGift ? "🎁" : <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 119.53 122.88"
                    width={60}
                    height={60}
                  >
                    <path
                      fill={"#FFF"}
                      fillRule="evenodd"
                      d="M30.14,41.83c.64,0,1.28,0,1.91.06a30.14,30.14,0,1,1,55.52,0c.61,0,1.21-.06,1.83-.06A30.14,30.14,0,1,1,65.55,90.38c5.35,10,11.91,20.24,22.73,25.61v6.89h-57V116c8.36-3,15-12.62,20.84-23.38a30.14,30.14,0,1,1-22-50.78Z"
                    />
                  </svg>}
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ---------- STAGE 3 : PICK CARD ---------- */}
        {stage === "cards" && (
          <>
            <h2 className="text-4xl font-bold text-white">Pick a Card</h2>
            <p className="text-white/60 mt-2">One hides the gift</p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {cards.map((card) => {
                const isWrong = wrongCard.some(wc => wc.id === card.id);
                return <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => pickCard(card)}
                  className={`
    cursor-pointer h-40 sm:h-48 md:h-56 lg:h-60 rounded-3xl bg-gradient-to-br from-yellow-400 to-pink-500 shadow-2xl flex items-center justify-center text-white text-4xl sm:text-5xl md:text-6xl
    transition-all duration-300
    ${isWrong
                      ? "bg-gray-400/40 grayscale"
                      : "bg-white/20 hover:bg-white/30"}
  `}
                >
                  {isWrong ? "❌" : "❓"}
                </motion.div>
              })}
            </div>
          </>
        )}

        {/* ---------- STAGE 4 : WIN ---------- */}
        {stage === "win" && (
          <>
            <h1 className="text-5xl font-extrabold text-white">Happy Birthday</h1>
            <p className="mt-4 text-lg text-white/80">You found the gift</p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-12">
              <div className="grid grid-cols-2 gap-6">
                {images.map((src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setActiveIndex(i);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer rounded-3xl h-40 sm:h-48 md:h-56 lg:h-64 w-full object-cover shadow-2xl"
                  />
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl overflow-hidden shadow-2xl bg-black">
                <video controls className="w-full h-full object-cover">
                  <source src="/memories/video1.mp4" type="video/mp4" />
                </video>
              </motion.div>
            </div>
            
            {/* ---------- BIRTHDAY NOTE SCROLL ---------- */}
            <div className="mt-20 flex justify-center">
              <motion.div
                initial={false}
                animate={openNote ? "open" : "closed"}
                variants={{
                  closed: { height: 120 },
                  open: { height: 420 },
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full max-w-2xl cursor-pointer overflow-hidden"
                onClick={() => setOpenNote(!openNote)}
              >
                {/* Scroll Rods */}
                <div className={`absolute -top-6 left-0 right-0 h-6 ${theme.rod} rounded-full shadow-lg`} />
                <div className={`absolute -bottom-6 left-0 right-0 h-6 ${theme.rod} rounded-full shadow-lg`} />

                {/* Paper */}
                <div
                  className={`relative h-full rounded-3xl ${theme.paper} border ${theme.border}
      shadow-[0_30px_60px_rgba(0,0,0,0.35)] p-8 sm:p-12`}
                >
                  {!openNote ? (
                    <div className={`h-full flex flex-col items-center justify-center text-center ${theme.text}`}>
                      <p className="text-xl sm:text-2xl font-semibold">
                        📜 Tap to Open Your Note
                      </p>
                      <p className={`mt-2 ${theme.subText}`}>
                        A message written just for you
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

                      <p className="mt-6 text-lg sm:text-xl leading-relaxed font-medium">
                        Today isn’t just about cake and candles —
                        it’s about celebrating you, your journey,
                        your wins, your growth, and everything amazing
                        that’s coming your way.
                      </p>

                      <p className="mt-6 text-lg sm:text-xl leading-relaxed font-medium">
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


            <button
              onClick={() => window.location.reload()}
              className="mt-16 px-12 py-4 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
            >
              Play Again 🔄
            </button>
          </>
        )}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          >
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-white text-3xl"
            >
              ✕
            </button>

            {/* Slider */}
            <div className="relative max-w-4xl w-full flex items-center justify-center">
              {/* Prev */}
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 sm:left-4 text-white text-4xl select-none"
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
                className="rounded-3xl max-h-[80vh] w-auto object-contain shadow-2xl"
              />

              {/* Next */}
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 sm:right-4 text-white text-4xl select-none"
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
