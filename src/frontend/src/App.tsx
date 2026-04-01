import { PuzzleGame } from "./components/PuzzleGame";

function DiamondIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TileScape logo"
    >
      <rect
        x="1"
        y="1"
        width="12"
        height="12"
        rx="2.5"
        fill="oklch(0.52 0.22 265)"
      />
      <rect
        x="15"
        y="1"
        width="12"
        height="12"
        rx="2.5"
        fill="oklch(0.76 0.18 65)"
      />
      <rect
        x="1"
        y="15"
        width="12"
        height="12"
        rx="2.5"
        fill="oklch(0.76 0.18 65)"
      />
      <rect
        x="15"
        y="15"
        width="12"
        height="12"
        rx="2.5"
        fill="oklch(0.52 0.22 265)"
      />
    </svg>
  );
}

export default function App() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.16 0.02 250) 0%, oklch(0.13 0.015 255) 100%)",
      }}
    >
      {/* Navbar */}
      <header
        className="sticky top-0 z-30 flex items-center px-5 sm:px-8 h-14"
        style={{
          background: "oklch(0.18 0.025 250 / 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.30 0.025 250 / 0.5)",
        }}
        data-ocid="nav.panel"
      >
        <div className="flex items-center gap-2.5">
          <DiamondIcon />
          <span className="text-foreground font-black text-lg tracking-tight">
            Tile<span style={{ color: "oklch(0.76 0.18 65)" }}>Scape</span>
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <PuzzleGame />
      </main>

      {/* Footer */}
      <footer
        className="py-4 text-center text-xs text-muted-foreground border-t"
        style={{ borderColor: "oklch(0.28 0.025 250)" }}
      >
        © {year}. Built with ♥ using{" "}
        <a
          href={utm}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
