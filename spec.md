# Sliding Puzzle Game

## Current State
New project with empty Motoko backend stub. No frontend implemented yet.

## Requested Changes (Diff)

### Add
- Sliding tile puzzle game (15-puzzle style) with numbered tiles
- Multiple difficulty levels: 3x3, 4x4, 5x5 grids
- Move counter and timer (starts on first move, stops on win)
- Shuffle button to randomize the board (ensuring solvability)
- Win detection with a congratulations modal showing time and moves taken
- Clean, responsive UI styled with Tailwind CSS
- Game logic: tile movement (click to slide), valid move detection, win condition check

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Build all game logic in a custom React hook (`usePuzzle`): board state, tile movement, shuffle (solvable), win detection, move counter, timer.
2. Build the main `App.tsx` with:
   - Header with game title
   - Difficulty selector (3x3, 4x4, 5x5 pill buttons)
   - Stats bar (moves + timer)
   - Puzzle grid (responsive square tiles, empty slot, click-to-slide)
   - Controls: Shuffle button
   - Win modal overlay (congratulations, time, moves, play again)
3. Style with Tailwind: dark theme, blue/orange accents, raised tile look, smooth transitions.
4. No backend interaction required -- pure frontend game.
