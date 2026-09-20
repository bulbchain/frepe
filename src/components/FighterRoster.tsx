import React from "react";
import { Fighter } from "../types";
import { sound } from "../audio";
import { Check } from "lucide-react";

import gentlemanPepeImg from "../assets/images/gentleman_pepe_refined_1789889197008.jpg";
import frepe1 from "../assets/images/frepe1.JPG";
import frepe2 from "../assets/images/frepe4.JPG";
import frepe3 from "../assets/images/frepe3.JPG";

export const FIGHTERS: Fighter[] = [
  {
    id: "wall-street",
    name: "Wall Street Frepe",
    tier: "EXECUTIVE",
    tierBadgeColor: "#facc15",
    bonus: "+25% CRISPY GAINS",
    description:
      "The CEO of bad financial decisions. Sharp suit, fresh fries, zero hesitation.",
    crunch: 96,
    saltiness: 88,
    specialStatName: "Greed",
    specialStatValue: 99,
    emoji: "🐸💼",
    suitColor: "#0f172a",
    multiplierBonus: 0.25,
    speedBonus: 0.1,
    jackpotChance: 0.05,
    hasShield: false,
  },
  {
    id: "cyber-crunch",
    name: "Cyber Frepe",
    tier: "TECH",
    tierBadgeColor: "#4ae176",
    bonus: "+50% SPEED",
    description:
      "Runs on caffeine, code and an unreasonable amount of fryer power.",
    crunch: 89,
    saltiness: 72,
    specialStatName: "Speed",
    specialStatValue: 98,
    emoji: "🤖🍟",
    suitColor: "#1e1b4b",
    multiplierBonus: 0.1,
    speedBonus: 0.5,
    jackpotChance: 0.05,
    hasShield: false,
  },
  {
    id: "golden-king",
    name: "Golden Frepe",
    tier: "ROYAL",
    tierBadgeColor: "#facc15",
    bonus: "2X JACKPOT CHANCE",
    description:
      "The richest frog in the fryer. Everything he touches turns golden.",
    crunch: 94,
    saltiness: 95,
    specialStatName: "Luck",
    specialStatValue: 99,
    emoji: "👑🍟",
    suitColor: "#78350f",
    multiplierBonus: 0.15,
    speedBonus: 0.15,
    jackpotChance: 0.35,
    hasShield: false,
  },
  {
    id: "trench-cook",
    name: "Trench Cook Frepe",
    tier: "VETERAN",
    tierBadgeColor: "#4ae176",
    bonus: "BOT IMMUNITY",
    description:
      "Straight from the trenches. Salty, battle-tested and always ready.",
    crunch: 97,
    saltiness: 99,
    specialStatName: "Armor",
    specialStatValue: 95,
    emoji: "👨‍🍳🧂",
    suitColor: "#1e293b",
    multiplierBonus: 0.1,
    speedBonus: 0.1,
    jackpotChance: 0.05,
    hasShield: true,
  },
];

interface FighterRosterProps {
  selectedFighter: Fighter;
  onSelectFighter: (fighter: Fighter) => void;
}

const fighterImages: Record<string, string> = {
  "wall-street": gentlemanPepeImg,
  "cyber-crunch": frepe1,
  "golden-king": frepe2,
  "trench-cook": frepe3,
};

export const FighterRoster: React.FC<FighterRosterProps> = ({
  selectedFighter,
  onSelectFighter,
}) => {
  const handleSelect = (fighter: Fighter) => {
    onSelectFighter(fighter);
    sound.playBoost();
  };

  return (
    <section
      id="fighter-roster-section"
      className="w-full mb-10 rounded-2xl border-4 border-black bg-[#060e20] p-4 shadow-[7px_7px_0px_#000] sm:p-5 lg:p-6"
    >
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="mb-5 flex flex-col justify-between gap-3 border-b-2 border-[#2d3449] pb-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono-code text-[10px] font-black uppercase tracking-[0.16em] text-[#4ae176]">
              🍟 FREPE EXECUTIVE LINEUP
            </span>

            <span className="rounded-full border border-[#2d3449] bg-[#131b2e] px-2 py-0.5 font-mono-code text-[8px] font-bold text-[#777]">
              4 ACTIVE
            </span>
          </div>

          <h3 className="font-headline text-2xl font-black uppercase leading-none text-[#ffecb9] sm:text-3xl lg:text-4xl">
            PICK YOUR FREPE
          </h3>
        </div>

        <p className="max-w-md text-xs leading-relaxed text-[#9a9078]">
          Pick your suit, lock in your perk and enter the fryer.
        </p>
      </div>

      {/* =========================================================
          4 CARD GRID
          xl = 4 cards in one row
      ========================================================= */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FIGHTERS.map((fighter) => {
          const isSelected = selectedFighter.id === fighter.id;
          const fighterImage = fighterImages[fighter.id];

          return (
            <div
              key={fighter.id}
              id={`fighter-card-${fighter.id}`}
              className={`group relative min-w-0 rounded-xl border-2 p-2.5 transition-all duration-200 ${
                isSelected
                  ? "-translate-y-1 border-[#facc15] bg-[#171f33] shadow-[4px_4px_0px_#facc15]"
                  : "border-[#2d3449] bg-[#0d1527] shadow-[3px_3px_0px_#000] hover:-translate-y-1 hover:border-[#4ae176] hover:shadow-[4px_4px_0px_#000]"
              }`}
            >
              {/* SELECTED BADGE */}
              {isSelected && (
                <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
                  <div className="flex items-center gap-1 whitespace-nowrap rounded-full border-2 border-black bg-[#facc15] px-2.5 py-0.5 font-mono-code text-[8px] font-black text-black shadow-[2px_2px_0px_#000]">
                    <Check className="h-2.5 w-2.5" />
                    SELECTED
                  </div>
                </div>
              )}

              {/* =================================================
                  IMAGE
              ================================================= */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-black bg-[#182338]">
                <img
                  src={fighterImage}
                  alt={fighter.name}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Bottom gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent" />

                {/* Tier */}
                <div
                  className="absolute bottom-2 left-2 rounded-md border border-white/10 bg-black/80 px-1.5 py-0.5 font-mono-code text-[8px] font-black uppercase"
                  style={{ color: fighter.tierBadgeColor }}
                >
                  {fighter.tier}
                </div>

                {/* Status */}
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-white/10 bg-black/75 px-1.5 py-0.5">
                  <span className="h-1 w-1 rounded-full bg-[#4ae176]" />
                  <span className="font-mono-code text-[7px] font-bold text-white/70">
                    READY
                  </span>
                </div>
              </div>

              {/* =================================================
                  NAME
              ================================================= */}
              <div className="pt-2.5">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <h4 className="truncate font-headline text-sm font-black uppercase leading-tight text-[#ffecb9]">
                      {fighter.name}
                    </h4>

                    <div className="mt-0.5 truncate font-mono-code text-[8px] font-black uppercase text-[#4ae176]">
                      {fighter.bonus}
                    </div>
                  </div>

                  <span className="shrink-0 text-sm">{fighter.emoji}</span>
                </div>

                {/* Description */}
                <p className="mt-2 min-h-[34px] text-[10px] leading-relaxed text-[#9a9078]">
                  {fighter.description}
                </p>
              </div>

              {/* =================================================
                  MINI STATS
              ================================================= */}
              <div className="mt-2.5 grid grid-cols-3 gap-1">
                <div className="rounded-md border border-[#2d3449] bg-[#060e20] px-1 py-1.5 text-center">
                  <div className="font-mono-code text-[7px] font-bold uppercase text-[#666]">
                    CRUNCH
                  </div>

                  <div className="text-xs font-black text-[#ffecb9]">
                    {fighter.crunch}
                  </div>
                </div>

                <div className="rounded-md border border-[#2d3449] bg-[#060e20] px-1 py-1.5 text-center">
                  <div className="font-mono-code text-[7px] font-bold uppercase text-[#666]">
                    SALT
                  </div>

                  <div className="text-xs font-black text-[#ffecb9]">
                    {fighter.saltiness}
                  </div>
                </div>

                <div className="rounded-md border border-[#2d3449] bg-[#060e20] px-1 py-1.5 text-center">
                  <div className="truncate font-mono-code text-[7px] font-bold uppercase text-[#666]">
                    {fighter.specialStatName}
                  </div>

                  <div className="text-xs font-black text-[#facc15]">
                    {fighter.specialStatValue}
                  </div>
                </div>
              </div>

              {/* =================================================
                  SELECT BUTTON
              ================================================= */}
              <button
                id={`select-fighter-${fighter.id}`}
                onClick={() => handleSelect(fighter)}
                className={`mt-2.5 w-full rounded-md border-2 border-black py-2 font-mono-code text-[9px] font-black uppercase transition-all ${
                  isSelected
                    ? "bg-[#facc15] text-black shadow-[2px_2px_0px_#000]"
                    : "bg-[#151e32] text-[#dae2fd] shadow-[1px_1px_0px_#000] hover:bg-[#4ae176] hover:text-black hover:shadow-[2px_2px_0px_#000]"
                }`}
              >
                {isSelected ? "✓ SELECTED" : "SELECT FREPE"}
              </button>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          BOTTOM STATUS
      ========================================================= */}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#2d3449] bg-[#0b1324] px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-base">🍟</span>

          <div className="min-w-0">
            <div className="font-mono-code text-[7px] font-bold uppercase text-[#666]">
              ACTIVE FREPE
            </div>

            <div className="truncate text-[10px] font-black uppercase text-[#ffecb9]">
              {selectedFighter.name}
            </div>
          </div>
        </div>

        <div className="hidden text-right sm:block">
          <div className="font-mono-code text-[7px] font-bold uppercase text-[#666]">
            ACTIVE PERK
          </div>

          <div className="font-mono-code text-[9px] font-black uppercase text-[#4ae176]">
            {selectedFighter.bonus}
          </div>
        </div>
      </div>
    </section>
  );
};