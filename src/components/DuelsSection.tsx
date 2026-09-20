import React, { useState } from "react";
import {
  Copy,
  Check,
  Send,
  Swords,
  Users,
  Trophy,
  Zap,
  Lock,
} from "lucide-react";
import { sound } from "../audio";

interface DuelsSectionProps {
  onStartDuel: (wager: number, opponentName: string) => void;
}

const STAKES = [
  {
    value: 0.1,
    label: "STARTER",
    description: "Test the waters",
    emoji: "🍟",
  },
  {
    value: 0.5,
    label: "DEGEN",
    description: "Put some crunch on it",
    emoji: "🔥",
  },
  {
    value: 1,
    label: "SERIOUS",
    description: "No paper hands",
    emoji: "💼",
  },
  {
    value: 5,
    label: "WHALE",
    description: "Executive level",
    emoji: "🐋",
  },
];

export const DuelsSection: React.FC<DuelsSectionProps> = ({
  onStartDuel,
}) => {
  const [selectedStake, setSelectedStake] = useState<number>(0.5);
  const [copied, setCopied] = useState(false);

  const roomCode = `FREPE-${Math.floor(1000 + Math.random() * 9000)}`;

  const duelUrl = `https://frepe.fun/duel?room=${roomCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(duelUrl);

    setCopied(true);
    sound.playBoost();

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCreateDuel = () => {
    sound.playBoost();

    /*
      Duel functionality is not live yet.

      When the duel system is ready:
      onStartDuel(selectedStake, "FRIEND");
    */
  };

  return (
    <section
      id="duels"
      className="relative mb-10 w-full overflow-hidden rounded-2xl border-4 border-black bg-[#060e20] p-4 shadow-[8px_8px_0px_#000] sm:p-6 lg:p-7"
    >
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#facc15]/5 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#4ae176]/5 blur-3xl" />

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="relative mb-6 flex flex-col justify-between gap-4 border-b-2 border-[#2d3449] pb-5 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-[#facc15] px-2.5 py-1 font-mono-code text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_#000]">
              <Swords className="h-3 w-3" />
              FREPE DUELS
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#2d3449] bg-[#131b2e] px-2.5 py-1 font-mono-code text-[10px] font-black uppercase text-[#9a9078]">
              <Lock className="h-3 w-3" />
              COMING SOON
            </span>
          </div>

          <h3 className="font-headline text-3xl font-black uppercase leading-none text-[#ffecb9] sm:text-4xl lg:text-5xl">
            CHALLENGE YOUR
            <span className="text-[#4ae176]"> FRENS</span>
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#9a9078]">
            Pick your wager, challenge a friend and find out who has the
            crispiest hands in the arena.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-[#2d3449] bg-[#0d1527] px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#facc15] text-lg">
            🍟
          </div>

          <div>
            <div className="font-mono-code text-[8px] font-bold uppercase text-[#666]">
              STATUS
            </div>

            <div className="font-mono-code text-xs font-black uppercase text-[#facc15]">
              BUILDING
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* =======================================================
            CREATE DUEL
        ======================================================= */}

        <div className="rounded-xl border-2 border-[#2d3449] bg-[#0d1527] p-4 shadow-[4px_4px_0px_#000] sm:p-5 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-mono-code text-[9px] font-bold uppercase tracking-wider text-[#4ae176]">
                STEP 01
              </div>

              <h4 className="mt-0.5 font-headline text-xl font-black uppercase text-[#ffecb9]">
                PICK YOUR WAGER
              </h4>
            </div>

            <div className="text-2xl">💰</div>
          </div>

          {/* Stake cards */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STAKES.map((stake) => {
              const selected = selectedStake === stake.value;

              return (
                <button
                  key={stake.value}
                  onClick={() => setSelectedStake(stake.value)}
                  className={`relative rounded-lg border-2 p-3 text-left transition-all ${
                    selected
                      ? "border-[#facc15] bg-[#facc15] text-black shadow-[3px_3px_0px_#000]"
                      : "border-[#2d3449] bg-[#131b2e] text-[#dae2fd] hover:border-[#4ae176]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{stake.emoji}</span>

                    {selected && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div className="mt-2 font-headline text-lg font-black">
                    {stake.value} SOL
                  </div>

                  <div
                    className={`font-mono-code text-[8px] font-black uppercase ${
                      selected ? "text-black/60" : "text-[#4ae176]"
                    }`}
                  >
                    {stake.label}
                  </div>

                  <div
                    className={`mt-1 text-[8px] ${
                      selected ? "text-black/50" : "text-[#777]"
                    }`}
                  >
                    {stake.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected wager */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-[#2d3449] bg-[#060e20] px-3 py-2.5">
            <div>
              <div className="font-mono-code text-[8px] font-bold uppercase text-[#666]">
                SELECTED WAGER
              </div>

              <div className="font-headline text-lg font-black text-[#ffecb9]">
                {selectedStake} SOL
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono-code text-[8px] font-bold uppercase text-[#666]">
                POT
              </div>

              <div className="font-headline text-lg font-black text-[#4ae176]">
                {selectedStake * 2} SOL
              </div>
            </div>
          </div>

          {/* Create button */}
          <button
            id="create-duel-btn"
            onClick={handleCreateDuel}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black bg-[#facc15] py-3 font-mono-code text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] transition-all hover:bg-[#ffecb9]"
          >
            <Swords className="h-4 w-4" />
            CREATE DUEL
          </button>

          <div className="mt-2 text-center font-mono-code text-[8px] font-bold uppercase text-[#555]">
            Duel creation will be enabled when the arena launches
          </div>
        </div>

        {/* =======================================================
            HOW IT WORKS
        ======================================================= */}

        <div className="rounded-xl border-2 border-[#2d3449] bg-[#131b2e] p-4 shadow-[4px_4px_0px_#000] sm:p-5 lg:col-span-5">
          <div className="mb-4">
            <div className="font-mono-code text-[9px] font-bold uppercase tracking-wider text-[#4ae176]">
              THE GAMEPLAN
            </div>

            <h4 className="mt-0.5 font-headline text-xl font-black uppercase text-[#ffecb9]">
              HOW IT WORKS
            </h4>
          </div>

          <div className="space-y-2.5">
            {/* Step 1 */}
            <div className="flex items-center gap-3 rounded-lg border border-[#2d3449] bg-[#0d1527] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#facc15] font-mono-code text-xs font-black text-black">
                01
              </div>

              <div>
                <div className="font-mono-code text-xs font-black uppercase text-[#ffecb9]">
                  CREATE
                </div>

                <div className="text-[10px] text-[#777]">
                  Choose your SOL wager
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 rounded-lg border border-[#2d3449] bg-[#0d1527] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#4ae176] font-mono-code text-xs font-black text-black">
                02
              </div>

              <div>
                <div className="font-mono-code text-xs font-black uppercase text-[#ffecb9]">
                  INVITE
                </div>

                <div className="text-[10px] text-[#777]">
                  Send the duel to your fren
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 rounded-lg border border-[#2d3449] bg-[#0d1527] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#facc15] font-mono-code text-xs font-black text-black">
                03
              </div>

              <div>
                <div className="font-mono-code text-xs font-black uppercase text-[#ffecb9]">
                  CRUNCH
                </div>

                <div className="text-[10px] text-[#777]">
                  Catch more fries than them
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-center gap-3 rounded-lg border border-[#2d3449] bg-[#0d1527] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#4ae176] font-mono-code text-xs font-black text-black">
                04
              </div>

              <div>
                <div className="font-mono-code text-xs font-black uppercase text-[#ffecb9]">
                  WIN
                </div>

                <div className="text-[10px] text-[#777]">
                  Take the bragging rights
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          INVITE FRIEND
      ========================================================= */}

      <div className="relative mt-5 rounded-xl border-2 border-[#2d3449] bg-[#0b1324] p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#4ae176] text-black">
              <Users className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <div className="font-mono-code text-[8px] font-bold uppercase text-[#666]">
                FRIEND INVITE
              </div>

              <div className="truncate font-mono-code text-xs text-[#9a9078]">
                {duelUrl}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-[#facc15] px-3 py-2 font-mono-code text-[9px] font-black uppercase text-black shadow-[2px_2px_0px_#000]"
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}

              {copied ? "COPIED" : "COPY LINK"}
            </button>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                duelUrl
              )}&text=I%20challenge%20you%20to%20a%20FREPE%20Duel!`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#2d3449] bg-[#131b2e] px-3 py-2 font-mono-code text-[9px] font-black uppercase text-[#dae2fd] transition-colors hover:border-[#4ae176] hover:text-[#4ae176]"
            >
              <Send className="h-3 w-3" />
              SHARE
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          COMING SOON FOOTER
      ========================================================= */}

      <div className="relative mt-4 flex flex-col items-center justify-between gap-3 rounded-xl border-2 border-dashed border-[#2d3449] bg-[#0a1222] px-4 py-3 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#facc15]" />

          <span className="font-mono-code text-[9px] font-black uppercase text-[#9a9078]">
            Multiplayer duel arena is being cooked
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono-code text-[9px] font-black uppercase text-[#4ae176]">
          <Trophy className="h-3.5 w-3.5" />
          MORE CRUNCH. MORE BRAGGING RIGHTS.
        </div>
      </div>
    </section>
  );
};