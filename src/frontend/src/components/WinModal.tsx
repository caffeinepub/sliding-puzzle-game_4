import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/hooks/usePuzzle";
import { AnimatePresence, motion } from "motion/react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
  shape: "circle" | "rect";
}

const CONFETTI_COLORS = [
  "oklch(0.76 0.18 65)", // orange
  "oklch(0.77 0.21 130)", // green
  "oklch(0.52 0.22 265)", // blue
  "oklch(0.87 0.10 205)", // cyan
  "oklch(0.80 0.20 340)", // pink
  "oklch(0.85 0.19 90)", // yellow
];

function generateConfetti(): ConfettiPiece[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    duration: 1.2 + Math.random() * 1.2,
    delay: Math.random() * 0.8,
    size: 6 + Math.random() * 8,
    shape: Math.random() > 0.5 ? "circle" : "rect",
  }));
}

const confettiPieces = generateConfetti();

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

interface WinModalProps {
  isOpen: boolean;
  size: Difficulty;
  moves: number;
  elapsed: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export function WinModal({
  isOpen,
  size,
  moves,
  elapsed,
  onPlayAgain,
  onNewGame,
}: WinModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-ocid="win.modal"
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl" />

          {/* Confetti */}
          {confettiPieces.map((p) => (
            <div
              key={p.id}
              className="absolute top-0 pointer-events-none"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.shape === "rect" ? p.size * 0.5 : p.size,
                borderRadius: p.shape === "circle" ? "50%" : "2px",
                background: p.color,
                animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s infinite`,
              }}
            />
          ))}

          {/* Modal card */}
          <motion.div
            className="relative z-10 glass-panel rounded-2xl p-8 mx-4 text-center max-w-sm w-full"
            initial={{ scale: 0.7, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Party emoji */}
            <div className="text-5xl mb-3 animate-win-bounce">🎉</div>

            {/* YOU WON text */}
            <h2
              className="text-4xl font-black uppercase tracking-widest mb-1"
              style={{ color: "oklch(0.77 0.21 130)" }}
            >
              YOU WON!
            </h2>
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-5">
              Puzzle Solved!
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="text-3xl animate-star-pop"
                  style={
                    { "--delay": `${0.3 + i * 0.15}s` } as React.CSSProperties
                  }
                >
                  ⭐
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-7">
              <div className="bg-secondary rounded-xl p-3">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                  Grid
                </div>
                <div className="text-lg font-bold text-foreground">
                  {size}×{size}
                </div>
              </div>
              <div className="bg-secondary rounded-xl p-3">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                  Moves
                </div>
                <div className="text-lg font-bold text-foreground">{moves}</div>
              </div>
              <div className="bg-secondary rounded-xl p-3">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                  Time
                </div>
                <div className="text-lg font-bold text-foreground">
                  {formatTime(elapsed)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                className="w-full font-bold text-base h-11 text-white"
                style={{ background: "oklch(0.76 0.18 65)", color: "#fff" }}
                onClick={onPlayAgain}
                data-ocid="win.primary_button"
              >
                Play Again
              </Button>
              <Button
                variant="secondary"
                className="w-full font-semibold text-base h-11"
                onClick={onNewGame}
                data-ocid="win.secondary_button"
              >
                New Game
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
