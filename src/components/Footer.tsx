import React, { useState } from "react";
import gentlemanPepeImg from "../assets/images/logo.png";
import {
  Copy,
  Check,
  ExternalLink,
  Flame,
} from "lucide-react";
import { sound } from "../audio";
import { SOCIAL_LINKS, CONTRACT_ADDRESS } from "../constants/socialLinks";

export const Footer: React.FC<{
  onOpenLeaderboard: () => void;
}> = ({ onOpenLeaderboard }) => {
  const [copied, setCopied] = useState(false);

  const ca = CONTRACT_ADDRESS;

  const handleCopy = () => {
    navigator.clipboard.writeText(ca);
    setCopied(true);
    sound.playBoost();

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <footer
      id="main-footer"
      className="w-full bg-[#060e20] border-t-4 border-black pt-14 pb-8"
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 flex flex-col gap-10">

        {/* =========================
            TOP FOOTER
        ========================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* BRAND */}
          <div className="md:col-span-5 flex flex-col gap-5">

         <div className="flex items-center gap-3">
  <img
      src={gentlemanPepeImg}
      alt="FREPE Logo"
      className="w-20 h-20 object-contain"
    />

  <div>
    <div className="font-headline text-3xl text-[#ffecb9] uppercase font-black leading-none">
      FREPE
    </div>

    <div className="font-mono-code text-[10px] text-[#4ae176] uppercase tracking-widest mt-1">
      CRISPY EXECUTIVE DEPARTMENT
    </div>
  </div>
</div>


            <p className="text-sm text-[#d1c6ab] font-body leading-relaxed max-w-md">
              The suited Pepe running the crispiest operation on Solana.
              Memes, games, community chaos and absolutely unnecessary
              amounts of executive confidence.
            </p>

            {/* CONTRACT ADDRESS */}
            <div className="bg-[#131b2e] border-2 border-[#2d3449] rounded-xl p-3">

              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-code text-[10px] text-[#facc15] font-black uppercase tracking-wider">
                  CONTRACT ADDRESS
                </span>

                <span className="font-mono-code text-[9px] text-[#4ae176]">
                  SOLANA
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono-code text-xs text-[#dae2fd] truncate select-all">
                  {ca}
                </span>

                <button
                  onClick={handleCopy}
                  className="shrink-0 p-2 rounded-lg bg-[#060e20] border border-[#2d3449] text-[#d1c6ab] hover:text-[#facc15] hover:border-[#facc15] transition-colors cursor-pointer"
                  title="Copy Contract Address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#4ae176]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {copied && (
                <div className="mt-2 font-mono-code text-[10px] text-[#4ae176] font-bold">
                  ✓ CONTRACT COPIED
                </div>
              )}
            </div>
          </div>

          {/* QUICK NAVIGATION */}
          <div className="md:col-span-3">

            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#facc15] rounded-full" />

              <span className="font-headline text-sm text-[#ffecb9] uppercase font-black">
                FREPE HQ
              </span>
            </div>

            <div className="flex flex-col gap-2.5 font-mono-code text-xs">

              <a
                href="#about"
                className="text-[#d1c6ab] hover:text-[#facc15] transition-colors"
              >
                → About FREPE
              </a>

              <a
                href="#crunch-arena"
                className="text-[#d1c6ab] hover:text-[#facc15] transition-colors"
              >
                → Crunch Arena
              </a>

              <button
                onClick={onOpenLeaderboard}
                className="text-left text-[#d1c6ab] hover:text-[#facc15] transition-colors cursor-pointer"
              >
                → Global Leaderboard
              </button>

              <a
                href="#duels"
                className="text-[#d1c6ab] hover:text-[#facc15] transition-colors flex items-center gap-2"
              >
                → FREPE Duels

                <span className="text-[8px] bg-[#facc15] text-black px-1.5 py-0.5 rounded font-black">
                  SOON
                </span>
              </a>

              <a
                href="#tokenomics"
                className="text-[#d1c6ab] hover:text-[#facc15] transition-colors"
              >
                → Fry-o-nomics
              </a>

              <a
                href="#how-to-buy"
                className="text-[#d1c6ab] hover:text-[#facc15] transition-colors"
              >
                → How to Buy
              </a>

              <a
                href="#roadmap"
                className="text-[#d1c6ab] hover:text-[#facc15] transition-colors"
              >
                → Golden Roadmap
              </a>

              <a
                href="#meme-stash"
                className="text-[#d1c6ab] hover:text-[#facc15] transition-colors"
              >
                → Meme Vault
              </a>
            </div>
          </div>

          {/* SOCIAL / TRACKERS */}
          <div className="md:col-span-4">

            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#4ae176] rounded-full" />

              <span className="font-headline text-sm text-[#ffecb9] uppercase font-black">
                FREPE ON THE INTERNET
              </span>
            </div>

            <div className="flex flex-wrap gap-2">

              {/* X */}
              <a
                href={SOCIAL_LINKS.TWITTER}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 bg-[#131b2e] hover:bg-[#222a3d] text-[#dae2fd] rounded-lg border border-[#2d3449] hover:border-[#facc15] flex items-center gap-2 font-bold transition-all"
              >
                <span className="text-sm">𝕏</span>
                Follow FREPE
              </a>

              {/* DexScreener */}
              <a
                href={SOCIAL_LINKS.DEX_SCREENER}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 bg-[#131b2e] hover:bg-[#222a3d] text-[#dae2fd] rounded-lg border border-[#2d3449] hover:border-[#facc15] flex items-center gap-2 font-bold transition-all"
              >
                DexScreener
                <ExternalLink className="w-3 h-3 text-[#9a9078]" />
              </a>

              {/* Solscan */}
              <a
                href={SOCIAL_LINKS.SOLSCAN}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 bg-[#131b2e] hover:bg-[#222a3d] text-[#dae2fd] rounded-lg border border-[#2d3449] hover:border-[#facc15] flex items-center gap-2 font-bold transition-all"
              >
                Solscan
                <ExternalLink className="w-3 h-3 text-[#9a9078]" />
              </a>

              {/* Pump.fun */}
              <a
                href={SOCIAL_LINKS.PUMP_FUN}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 bg-[#131b2e] hover:bg-[#222a3d] text-[#4ae176] rounded-lg border border-[#2d3449] hover:border-[#4ae176] flex items-center gap-2 font-bold transition-all"
              >
                pump.fun
                <ExternalLink className="w-3 h-3" />
              </a>

            </div>

            {/* STATUS */}
            <div className="mt-4 bg-[#131b2e] border-2 border-[#2d3449] rounded-xl p-3">

              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#facc15]" />

                <span className="font-mono-code text-[10px] text-[#facc15] font-black uppercase">
                  FREPE STATUS
                </span>
              </div>

              <p className="mt-1 text-[11px] text-[#9a9078] font-mono-code">
                Crispy. Chaotic. Community powered.
              </p>

            </div>
          </div>
        </div>

        {/* =========================
            BOTTOM BAR
        ========================== */}
        <div className="pt-6 border-t border-[#2d3449] flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex flex-col sm:flex-row items-center gap-2 text-center md:text-left">

            <span className="font-mono-code text-[10px] text-[#9a9078]">
              $FREPE IS A MEME COIN FOR ENTERTAINMENT & COMMUNITY.
            </span>

            <span className="hidden sm:block text-[#2d3449]">
              •
            </span>

            <span className="font-mono-code text-[10px] text-[#9a9078]">
              DYOR. CRUNCH RESPONSIBLY.
            </span>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-1.5 font-mono-code text-[10px] text-[#4ae176]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ae176]" />
              BUILT ON SOLANA
            </div>

            <span className="text-[#2d3449]">
              •
            </span>

            <span className="font-mono-code text-[10px] text-[#facc15] font-bold">
              © 2026 FREPE
            </span>

          </div>
        </div>

        {/* BOTTOM BRANDING */}
        <div className="text-center">
          <div className="font-headline text-2xl text-[#2d3449] uppercase font-black tracking-widest">
            EAT • FRY • FREPE
          </div>
        </div>

      </div>
    </footer>
  );
};