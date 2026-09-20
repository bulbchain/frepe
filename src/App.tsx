import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TickerMarquees } from "./components/TickerMarquees";
import { FrepeImageMarquee } from "./components/FrepeImageMarquee";
import { FryCatcherGame } from "./components/FryCatcherGame";
import { PepeRunGame } from "./components/PepeRunGame";
import { FighterRoster, FIGHTERS } from "./components/FighterRoster";
import { DuelsSection } from "./components/DuelsSection";
import { TokenomicsSection } from "./components/TokenomicsSection";
import { HowToBuySection } from "./components/HowToBuySection";
import { RoadmapSection } from "./components/RoadmapSection";
import { MemeStashSection } from "./components/MemeStashSection";
import { Footer } from "./components/Footer";
import { GlobalLeaderboardModal } from "./components/GlobalLeaderboardModal";
import { SwapModal } from "./components/SwapModal";
import { Fighter, LeaderboardEntry } from "./types";
import { Trophy, Swords, Zap, Flame, ShieldAlert, Award, ExternalLink } from "lucide-react";
import { sound } from "./audio";

export default function App() {
  const [selectedFighter, setSelectedFighter] = useState<Fighter>(FIGHTERS[0]);
  const [gameMode, setGameMode] = useState<"pepe_run" | "fry_catcher">("pepe_run");
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState<boolean>(false);
  const [swapModalOpen, setSwapModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("about");

  // Duels state passed to game
  const [activeDuelWager, setActiveDuelWager] = useState<number>(0);
  const [duelOpponent, setDuelOpponent] = useState<string | undefined>(undefined);

  // Live mini-leaderboard preview in arena section
  const [topCrunchers, setTopCrunchers] = useState<LeaderboardEntry[]>([]);

  const fetchTopCrunchers = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setTopCrunchers(data.slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching top crunchers:", err);
    }
  };

  useEffect(() => {
    fetchTopCrunchers();
    const interval = setInterval(fetchTopCrunchers, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStartDuel = (wager: number, opponentName: string) => {
    setActiveDuelWager(wager);
    setDuelOpponent(opponentName);
    // Smooth scroll to crunch arena
    const el = document.getElementById("crunch-arena");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDuelFinish = (score: number) => {
    fetchTopCrunchers();
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col selection:bg-[#facc15] selection:text-[#3c2f00]">
      {/* Fixed Header with Ticker */}
      <Header
        activeSection={activeSection}
        onOpenSwap={() => setSwapModalOpen(true)}
        onOpenLeaderboard={() => setLeaderboardModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <HeroSection
          onOpenSwap={() => setSwapModalOpen(true)}
          onOpenGame={(mode) => {
            if (mode) setGameMode(mode);
            const el = document.getElementById("crunch-arena");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Dynamic Dual Ticker Marquees */}
        <TickerMarquees />

        {/* Dual Frepe Image Marquee (Forward & Backward) */}
        <FrepeImageMarquee />

        {/* Choose Your Fry Fighter Roster */}
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <FighterRoster
            selectedFighter={selectedFighter}
            onSelectFighter={(f) => {
              setSelectedFighter(f);
              const el = document.getElementById("crunch-arena");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>

        {/* Crunch Arena: Game & Live High Score Widget */}
        <section
          id="crunch-arena"
          className="w-full py-12 max-w-[1280px] mx-auto px-4 lg:px-8 relative"
        >
          {/* Section Header Title & Game Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-[#4ae176] animate-ping" />
                <span className="font-mono-code text-xs text-[#facc15] font-black uppercase tracking-wider">
                  LIVE CRUNCH ARENA • {gameMode === "pepe_run" ? "ENDLESS WALL STREET SPRINT" : "SOL MULTIPLIER ROYALE"}
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl uppercase text-[#ffecb9] font-black">
                {gameMode === "pepe_run" ? "PEPE RUN: SPRINT ROYALE" : "FRY CATCHER ROYALE"}
              </h2>
            </div>

            {/* Arcade Mode Selector Tabs & Leaderboard Button */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#060e20] p-1 rounded-xl border-2 border-[#2d3449] flex items-center gap-1 shadow-[2px_2px_0px_#000000]">
                <button
                  id="mode-pepe-run-btn"
                  onClick={() => {
                    setGameMode("pepe_run");
                    sound.playBoost();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-headline text-xs uppercase font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    gameMode === "pepe_run"
                      ? "bg-[#facc15] text-[#3c2f00] shadow-[2px_2px_0px_#000000]"
                      : "text-[#dae2fd] hover:text-[#ffecb9]"
                  }`}
                >
                  <span>🏃‍♂️ PEPE RUN</span>
                  <span className="px-1.5 py-0.5 bg-[#93000a] text-[#ffdad6] text-[9px] rounded font-mono-code font-bold">
                    HOT
                  </span>
                </button>
                <button
                  id="mode-fry-catcher-btn"
                  onClick={() => {
                    setGameMode("fry_catcher");
                    sound.playBoost();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-headline text-xs uppercase font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    gameMode === "fry_catcher"
                      ? "bg-[#facc15] text-[#3c2f00] shadow-[2px_2px_0px_#000000]"
                      : "text-[#dae2fd] hover:text-[#ffecb9]"
                  }`}
                >
                  <span>🍟 FRY CATCHER</span>
                </button>
              </div>

              <button
                id="arena-open-leaderboard-btn"
                onClick={() => setLeaderboardModalOpen(true)}
                className="neo-brutal-btn bg-[#222a3d] hover:bg-[#facc15] text-[#dae2fd] hover:text-[#3c2f00] px-4 py-2 rounded-xl font-headline text-xs uppercase flex items-center gap-1.5 font-bold cursor-pointer transition-all"
              >
                <Trophy className="w-4 h-4 text-[#facc15]" />
                <span>GLOBAL LEADERBOARD</span>
              </button>
            </div>
          </div>

          {/* Arena Layout: Left Game (8 cols), Right Top Crunchers (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Game Canvas & Controls */}
            <div className="lg:col-span-8">
              {gameMode === "pepe_run" ? (
                <PepeRunGame
                  selectedFighter={selectedFighter}
                  onOpenLeaderboard={() => setLeaderboardModalOpen(true)}
                  onRunFinish={() => fetchTopCrunchers()}
                />
              ) : (
                <FryCatcherGame
                  selectedFighter={selectedFighter}
                  onOpenLeaderboard={() => setLeaderboardModalOpen(true)}
                  activeDuelWager={activeDuelWager}
                  duelOpponent={duelOpponent}
                  onDuelFinish={handleDuelFinish}
                />
              )}
            </div>

            {/* Right Mini-Leaderboard & Staking Widget */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Mini Leaderboard Card */}
              <div
                id="arena-mini-leaderboard"
                className="bg-[#131b2e] rounded-2xl border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_#000000] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b-2 border-[#2d3449] pb-3 mb-3">
                  <span className="font-headline text-base text-[#ffecb9] uppercase font-black flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#facc15]" />
                    TOP FRY CRUNCHERS
                  </span>
                  <button
                    onClick={() => setLeaderboardModalOpen(true)}
                    className="font-mono-code text-[11px] text-[#4ae176] hover:underline font-bold cursor-pointer"
                  >
                    VIEW ALL
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 font-mono-code text-xs">
                  {topCrunchers.map((entry, idx) => (
                    <div
                      key={entry.id || idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#060e20] border border-[#222a3d] hover:border-[#facc15] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center font-black text-[10px] ${
                            idx === 0
                              ? "bg-[#facc15] text-[#3c2f00]"
                              : idx === 1
                              ? "bg-[#cbd5e1] text-[#0f172a]"
                              : idx === 2
                              ? "bg-[#b45309] text-white"
                              : "bg-[#222a3d] text-[#9a9078]"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[#ffecb9] font-bold block leading-tight">
                            {entry.player}
                          </span>
                          <span className="text-[10px] text-[#9a9078]">{entry.fighter}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[#4ae176] font-black text-xs block">
                          {entry.score.toLocaleString()} PTS
                        </span>
                        <span className="text-[10px] text-[#facc15]">{entry.solGain}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  id="view-full-leaderboard-btn"
                  onClick={() => setLeaderboardModalOpen(true)}
                  className="mt-4 w-full neo-brutal-btn bg-[#facc15] text-[#3c2f00] font-headline text-xs uppercase py-2.5 rounded-lg border-2 border-black font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#000000]"
                >
                  <Award className="w-4 h-4" />
                  <span>OPEN FULL LEADERBOARD</span>
                </button>
              </div>

              {/* Arena Staking Stats Callout Card */}
              <div className="bg-[#171f33] rounded-2xl border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_#000000] flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#4ae176] text-[#002109] flex items-center justify-center text-lg font-black border border-black -rotate-6">
                    ⚡
                  </span>
                  <div>
                    <h4 className="font-headline text-base text-[#ffecb9] uppercase font-black">
                      4,820 SOL TOTAL STAKED
                    </h4>
                    <span className="font-mono-code text-[10px] text-[#4ae176] font-bold">
                      ZERO HOUSE EDGE • 100% DEGEN
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#d1c6ab] font-body leading-relaxed">
                  Sprint across Wall Street in <strong>Pepe Run</strong> or catch falling golden fries in <strong>Fry Catcher Royale</strong>. Every combo contributes to your live multiplier. Cash out before crashing to lock in high scores!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Duels Section: Stake Your SOL */}
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <DuelsSection onStartDuel={handleStartDuel} />
        </div>

        {/* Tokenomics Bento Grid */}
        <TokenomicsSection />

        {/* How To Buy Section & In-App Calculator */}
        <HowToBuySection onOpenSwap={() => setSwapModalOpen(true)} />

        {/* The Golden Fry Roadmap */}
        <RoadmapSection />

        {/* Meme Stash Section with Zoom & Upvotes */}
        <MemeStashSection onOpenSwap={() => setSwapModalOpen(true)} />
      </main>

      {/* Footer with Contract & Trackers */}
      <Footer onOpenLeaderboard={() => setLeaderboardModalOpen(true)} />

      {/* Global Leaderboard Modal */}
      <GlobalLeaderboardModal
        isOpen={leaderboardModalOpen}
        onClose={() => setLeaderboardModalOpen(false)}
      />

      {/* Interactive Swap Modal */}
      <SwapModal isOpen={swapModalOpen} onClose={() => setSwapModalOpen(false)} />
    </div>
  );
}
