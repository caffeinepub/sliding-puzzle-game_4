import { useCallback, useEffect, useRef, useState } from "react";

export type Difficulty = 3 | 4 | 5;

function getGoalBoard(size: number): number[] {
  const total = size * size;
  const goal: number[] = [];
  for (let i = 1; i < total; i++) goal.push(i);
  goal.push(0);
  return goal;
}

function countInversions(board: number[]): number {
  let inv = 0;
  const tiles = board.filter((x) => x !== 0);
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inv++;
    }
  }
  return inv;
}

function isSolvable(board: number[], size: number): boolean {
  const inversions = countInversions(board);
  if (size % 2 === 1) {
    return inversions % 2 === 0;
  }
  const emptyIdx = board.indexOf(0);
  const emptyRowFromBottom = size - Math.floor(emptyIdx / size);
  return (inversions + emptyRowFromBottom) % 2 === 1;
}

function shuffle(size: number): number[] {
  const total = size * size;
  let board: number[];
  do {
    board = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = board[i];
      board[i] = board[j];
      board[j] = tmp;
    }
  } while (
    !isSolvable(board, size) ||
    board.join(",") === getGoalBoard(size).join(",")
  );
  return board;
}

function getMovableTiles(b: number[], sz: number): Set<number> {
  const emptyIdx = b.indexOf(0);
  const emptyRow = Math.floor(emptyIdx / sz);
  const emptyCol = emptyIdx % sz;
  const movable = new Set<number>();
  const candidates: number[] = [
    emptyIdx - sz,
    emptyIdx + sz,
    emptyCol > 0 ? emptyRow * sz + emptyCol - 1 : -1,
    emptyCol < sz - 1 ? emptyRow * sz + emptyCol + 1 : -1,
  ];
  for (const idx of candidates) {
    if (idx >= 0 && idx < b.length && b[idx] !== 0) {
      movable.add(b[idx]);
    }
  }
  return movable;
}

export function usePuzzle(initialSize: Difficulty = 4) {
  const [size, setSize] = useState<Difficulty>(initialSize);
  const [board, setBoard] = useState<number[]>(() => shuffle(initialSize));
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (isStarted && !isWon) {
      stopTimer();
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    if (isWon) stopTimer();
  }, [isStarted, isWon, stopTimer]);

  const clickTile = useCallback(
    (value: number) => {
      if (isWon) return;
      setBoard((prev) => {
        const emptyIdx = prev.indexOf(0);
        const tileIdx = prev.indexOf(value);
        const emptyRow = Math.floor(emptyIdx / size);
        const emptyCol = emptyIdx % size;
        const tileRow = Math.floor(tileIdx / size);
        const tileCol = tileIdx % size;
        const isAdjacent =
          (emptyRow === tileRow && Math.abs(emptyCol - tileCol) === 1) ||
          (emptyCol === tileCol && Math.abs(emptyRow - tileRow) === 1);
        if (!isAdjacent) return prev;

        const next = [...prev];
        next[emptyIdx] = value;
        next[tileIdx] = 0;

        const goal = getGoalBoard(size);
        if (next.join(",") === goal.join(",")) {
          setIsWon(true);
        }

        return next;
      });
      setMoves((m) => m + 1);
      setIsStarted(true);
    },
    [isWon, size],
  );

  const newGame = useCallback(
    (newSize?: Difficulty) => {
      const sz = newSize ?? size;
      stopTimer();
      setSize(sz);
      setBoard(shuffle(sz));
      setMoves(0);
      setElapsed(0);
      setIsStarted(false);
      setIsWon(false);
    },
    [size, stopTimer],
  );

  const changeDifficulty = useCallback(
    (newSize: Difficulty) => {
      newGame(newSize);
    },
    [newGame],
  );

  return {
    board,
    size,
    moves,
    elapsed,
    isStarted,
    isWon,
    movableTiles: getMovableTiles(board, size),
    clickTile,
    newGame,
    changeDifficulty,
  };
}
