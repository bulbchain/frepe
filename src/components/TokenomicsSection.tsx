import React from "react";
import {
  Lock,
  ShieldCheck,
  Gift,
  Building2,
  Flame,
} from "lucide-react";
import { SOCIAL_LINKS } from "../constants/socialLinks";

export const TokenomicsSection: React.FC = () => {
  return (
    <section
      id="tokenomics"
      className="w-full bg-[#060e20] py-16 border-y-2 border-[#2d3449] relative"
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="font-mono-code text-xs bg-[#facc15] text-[#3c2f00] px-3 py-1 rounded font-black uppercase tracking-wider -rotate-2 shadow-sm">
            THE FREPE FINANCIAL REPORT
          </span>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl uppercase text-[#ffecb9] font-black">
            FRY-O-NOMICS
          </h2>

          <p className="text-sm sm:text-base text-[#d1c6ab] max-w-xl font-body leading-relaxed">
            No corporate mystery. No unnecessary spreadsheets.
            Just the FREPE setup, clearly explained.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* Card 1 — Supply */}
          <div className="md:col-span-7 bg-[#131b2e] rounded-2xl border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000] relative overflow-hidden flex flex-col justify-between">

            <div className="absolute -right-6 -bottom-6 opacity-10 font-headline font-black text-9xl text-[#ffecb9] select-none pointer-events-none">
              FREPE
            </div>

            <div className="flex flex-col gap-3 relative z-10">

              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#4ae176]" />

                <span className="font-mono-code text-xs text-[#4ae176] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  TOKEN SETUP
                </span>
              </div>

              <h3 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-[#ffecb9] uppercase font-black">
                FIXED SUPPLY
              </h3>

              <p className="text-sm sm:text-base text-[#d1c6ab] max-w-md font-body leading-relaxed">
                FREPE launches through the Pump.fun ecosystem.
                Token supply and launch details will be published
                alongside the official token address.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#2d3449] flex items-center justify-between font-mono-code text-xs relative z-10">
              <span className="text-[#9a9078]">
                Launch:
              </span>

              <a
                href={SOCIAL_LINKS.PUMP_FUN}
                target="_blank"
                rel="noreferrer"
                className="text-[#4ae176] font-bold flex items-center gap-1 hover:text-[#facc15] transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                PUMP.FUN
              </a>
            </div>
          </div>

          {/* Card 2 — 0% Tax */}
          <div className="md:col-span-5 bg-[#facc15] text-[#3c2f00] rounded-2xl border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">

            <div className="flex flex-col gap-2">

              <span className="font-mono-code text-xs bg-black text-[#facc15] px-2.5 py-0.5 rounded font-black uppercase w-max">
                NO TOKEN TAX
              </span>

              <h3 className="font-headline text-3xl sm:text-4xl lg:text-5xl uppercase leading-none font-black text-black">
                0% BUY
                <br />
                0% SELL
              </h3>

              <p className="text-sm sm:text-base text-black/85 font-medium leading-relaxed">
                FREPE does not add a token buy or sell tax.
                Your trade isn't reduced by a separate FREPE
                transaction tax.
              </p>
            </div>

            <div className="mt-8 pt-3 border-t-2 border-black/20 flex items-center justify-between font-mono-code text-xs font-black text-black">
              <span>Token Tax:</span>
              <span>0%</span>
            </div>
          </div>

          {/* Card 3 — Community */}
          <div className="md:col-span-6 bg-[#131b2e] rounded-2xl border-4 border-black p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">

            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl select-none">
                🎁
              </span>

              <span className="font-mono-code text-[10px] text-[#facc15] bg-[#facc15]/10 border border-[#facc15]/30 px-2 py-1 rounded font-black uppercase">
                COMMUNITY
              </span>
            </div>

            <h4 className="font-headline text-xl text-[#ffecb9] uppercase font-black">
              MEMES & COMMUNITY
            </h4>

            <p className="text-xs sm:text-sm text-[#d1c6ab] mt-1 font-body leading-relaxed">
              FREPE is built around memes, games, community
              creations and whatever chaos the community cooks up.
            </p>
          </div>

          {/* Card 4 — Liquidity */}
          <div className="md:col-span-6 bg-[#131b2e] rounded-2xl border-4 border-black p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">

            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl select-none">
                🔥
              </span>

              <span className="font-mono-code text-[10px] text-[#4ae176] bg-[#4ae176]/10 border border-[#4ae176]/30 px-2 py-1 rounded font-black uppercase">
                BEING COOKED
              </span>
            </div>

            <h4 className="font-headline text-xl text-[#ffecb9] uppercase font-black">
              LIQUIDITY & TRADING
            </h4>

            <p className="text-xs sm:text-sm text-[#d1c6ab] mt-1 font-body leading-relaxed">
              Trading starts through the Pump.fun launch.
              Additional liquidity and trading integrations
              will be announced as they become available.
            </p>
          </div>

        </div>

        {/* Bottom Note */}
        <div className="mt-6 bg-[#131b2e] border-2 border-[#2d3449] rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <Flame className="w-4 h-4 text-[#facc15]" />

          <span className="font-mono-code text-[10px] sm:text-xs text-[#9a9078] uppercase">
            Official token details will always be published by FREPE
            through its official channels.
          </span>
        </div>

      </div>
    </section>
  );
};