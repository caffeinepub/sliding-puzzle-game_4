import { Button } from "@/components/ui/button";
import { type Difficulty, usePuzzle } from "@/hooks/usePuzzle";
import { RefreshCw, Shuffle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { WinModal } from "./WinModal";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const DIFFICULTIES: { label: string; value: Difficulty }[] = [
  { label: "3×3", value: 3 },
  { label: "4×4", value: 4 },
  { label: "5×5", value: 5 },
];

export function PuzzleGame() {
  const puzzle = usePuzzle(4);
  const [animatingTile, setAnimatingTile] = useState<number | null>(null);

  const handleTileClick = useCallback(
    (value: number) => {
      if (!puzzle.movableTiles.has(value)) return;
      setAnimatingTile(value);
      puzzle.clickTile(value);
      setTimeout(() => setAnimatingTile(null), 150);
    },
    [puzzle],
  );

  const tileSize =
    puzzle.size === 3 ? "text-3xl" : puzzle.size === 4 ? "text-2xl" : "text-lg";

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-7 w-full max-w-lg mx-auto">
      {/* Top row: difficulty + stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        {/* Difficulty selector */}
        <div className="flex gap-1.5" data-ocid="difficulty.tab">
          {DIFFICULTIES.map((d) => (
            <button
              type="button"
              key={d.value}
              onClick={() => puzzle.changeDifficulty(d.value)}
              data-ocid="difficulty.tab"
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                puzzle.size === d.value
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Stats chip */}
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            background: "oklch(0.28 0.03 250)",
            border: "1px solid oklch(0.35 0.03 250 / 0.5)",
          }}
          data-ocid="stats.panel"
        >
          <span className="text-muted-foreground">
            Moves: <span className="text-foreground">{puzzle.moves}</span>
          </span>
          <div className="w-px h-4 bg-border" />
          <span className="text-muted-foreground">
            Time:{" "}
            <span className="text-foreground">
              {formatTime(puzzle.elapsed)}
            </span>
          </span>
        </div>
      </div>

      {/* Puzzle grid */}
      <div className="relative">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}
          data-ocid="puzzle.canvas_target"
        >
          <AnimatePresence mode="popLayout">
            {puzzle.board.map((value, idx) => {
              const isEmpty = value === 0;
              const isMovable = puzzle.movableTiles.has(value);
              const isAnimating = animatingTile === value;

              if (isEmpty) {
                return (
                  <div
                    key="empty"
                    className="aspect-square rounded-xl"
                    style={{ background: "oklch(0.16 0.02 250 / 0.5)" }}
                  />
                );
              }

              return (
                <motion.button
                  key={value}
                  layout
                  layoutId={`tile-${value}`}
                  className={`aspect-square rounded-xl flex items-center justify-center font-black select-none transition-colors duration-150 ${
                    tileSize
                  } ${
                    isMovable
                      ? "cursor-pointer tile-3d-hover"
                      : "cursor-default tile-3d"
                  } ${isAnimating ? "animate-tile-slide" : ""}`}
                  onClick={() => handleTileClick(value)}
                  whileHover={isMovable ? { scale: 1.04 } : {}}
                  whileTap={isMovable ? { scale: 0.96 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  data-ocid={`puzzle.item.${idx + 1}`}
                  aria-label={`Tile ${value}${isMovable ? ", movable" : ""}`}
                >
                  <span
                    style={{
                      color: isMovable
                        ? "oklch(0.87 0.10 205)"
                        : "oklch(0.93 0.005 250)",
                      textShadow: isMovable
                        ? "0 0 12px oklch(0.87 0.10 205 / 0.5)"
                        : "0 1px 2px oklch(0.05 0.01 250)",
                    }}
                  >
                    {value}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Win modal overlay */}
        <WinModal
          isOpen={puzzle.isWon}
          size={puzzle.size}
          moves={puzzle.moves}
          elapsed={puzzle.elapsed}
          onPlayAgain={() => puzzle.newGame()}
          onNewGame={() => puzzle.newGame()}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-5">
        <Button
          className="flex-1 h-11 font-bold text-sm gap-2 text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.76 0.18 65), oklch(0.68 0.19 50))",
            color: "#fff",
          }}
          onClick={() => puzzle.newGame()}
          data-ocid="game.primary_button"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </Button>
        <Button
          className="flex-1 h-11 font-bold text-sm gap-2"
          style={{ background: "oklch(0.52 0.22 265)", color: "#fff" }}
          onClick={() => puzzle.newGame()}
          data-ocid="game.secondary_button"
        >
          <RefreshCw className="w-4 h-4" />
          New Game
        </Button>
      </div>
    </div>
  );
}
