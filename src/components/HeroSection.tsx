import React, { useState } from "react";
import { Check, Copy, Flame, TrendingUp, Send, ShieldCheck, Zap } from "lucide-react";
import gentlemanPepeImg from "../assets/images/gentleman_pepe_refined_1789889197008.jpg";
import twitterImg from "../assets/images/twitter.png";

interface HeroSectionProps {
  onOpenSwap: () => void;
  onOpenGame: (mode?: "pepe_run" | "fry_catcher") => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSwap, onOpenGame }) => {
  const [copied, setCopied] = useState(false);
  const contractAddress = "Coming soon";

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="about" className="relative w-full overflow-hidden pb-12 pt-6">
      {/* Ambient Glows */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#facc15]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#4ae176]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Hot Notice Chip */}
        <div className="flex items-center gap-3 mb-6">
          <span
            id="hero-fresh-chip"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#93000a] text-[#ffdad6] font-mono-code text-[11px] uppercase tracking-wider font-bold -rotate-1 shadow-[2px_2px_0px_#000000]"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" />
            FRESH OUT OF THE FRYER • LIVE ON PUMP.FUN
          </span>
          <span
            id="hero-lp-locked-chip"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#222a3d] text-[#4ae176] font-mono-code text-[12px]"
          >
            <ShieldCheck className="w-4 h-4 text-[#4ae176]" />
            100% LP LOCKED
          </span>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="font-mono-code text-[13px] text-[#facc15] font-bold uppercase tracking-widest flex items-center gap-2">
                <span>🍟</span> THE SUITED PEPE REVOLUTION ON SOLANA
              </span>
              <h1
                id="hero-headline"
                className="font-headline text-5xl sm:text-6xl lg:text-7xl uppercase text-[#ffecb9] leading-[0.92] tracking-tighter font-black"
              >
                CRISPY GAINS. <br />
                <span className="text-[#facc15] drop-shadow-[0_4px_24px_rgba(250,204,21,0.45)]">
                  EXTRA SALTY.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#d1c6ab] max-w-xl leading-relaxed font-body">
              Born from boiling fryer oil and bespoke Wall Street executive vibes. The golden crunch
              that the crypto trenches desperately needed. Zero taxes, zero insider dumps, infinite
              buttery velocity.
            </p>

            {/* Interactive Contract Bar */}
            <div
              id="hero-contract-box"
              className="bg-[#131b2e] rounded-xl p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#000000] border-2 border-[#2d3449]"
            >
              <div className="flex items-center gap-2 px-2 overflow-hidden">
                <span className="font-mono-code text-xs text-[#facc15] shrink-0 font-bold">MINT:</span>
                <span className="font-mono-code text-xs text-[#dae2fd] select-all truncate">
                  {contractAddress}
                </span>
              </div>
              <button
                id="hero-copy-ca-btn"
                onClick={handleCopy}
                className="shrink-0 neo-brutal-btn bg-[#222a3d] hover:bg-[#facc15] text-[#dae2fd] hover:text-[#3c2f00] px-4 py-2 rounded-lg font-mono-code text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#4ae176]" />
                    <span className="text-[#4ae176] font-bold">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy CA</span>
                  </>
                )}
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-grab-bag-btn"
                onClick={onOpenSwap}
                className="neo-brutal-btn bg-[#facc15] text-[#3c2f00] font-headline text-lg uppercase px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-[4px_4px_0px_#000000] font-black cursor-pointer"
              >
                <Flame className="w-5 h-5 text-[#93000a]" />
                <span>GRAB A BAG 🍟</span>
              </button>

              <button
                id="hero-launch-pepe-run-btn"
                onClick={() => onOpenGame("pepe_run")}
                className="neo-brutal-btn bg-[#4ae176] text-[#002109] hover:text-[#ffecb9] font-headline text-lg uppercase px-5 py-3.5 rounded-xl flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000000] font-black cursor-pointer"
              >
                <Zap className="w-5 h-5 text-[#002109]" />
                <span>PLAY PEPE RUN 🏃‍♂️</span>
              </button>

              <button
                id="hero-launch-game-btn"
                onClick={() => onOpenGame("fry_catcher")}
                className="neo-brutal-btn bg-[#222a3d] text-[#dae2fd] hover:text-[#facc15] font-headline text-base uppercase px-4 py-3.5 rounded-xl flex items-center gap-1.5 border-2 border-[#2d3449] shadow-[4px_4px_0px_#000000] font-bold cursor-pointer"
              >
                <span>🍟 FRY CATCHER</span>
              </button>

              <a
                id="hero-twitter-link"
                href="https://x.com/frepeofficial"
                target="_blank"
                rel="noreferrer"
                className="neo-brutal-btn bg-[#131b2e] p-3.5 rounded-xl flex items-center justify-center border-2 border-[#2d3449] shadow-[4px_4px_0px_#000000]"
                title="Follow FREPE on Twitter"
              >
                <img
                  src={twitterImg}
                  alt="Twitter"
                  className="w-5 h-5 object-contain"
                />
              </a>
            </div>

<div
  id="hero-mini-metrics-grid"
  className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2"
>
  <div className="bg-[#171f33] p-3 rounded-lg border border-[#222a3d]">
    <span className="font-mono-code text-[11px] text-[#9a9078] block uppercase">
      Fry Level
    </span>
    <span className="font-headline text-xl text-[#facc15] font-black">
       CRISPY
    </span>
    <span className="font-mono-code text-[11px] text-[#4ae176] flex items-center mt-0.5">
      🔥 Fully Loaded
    </span>
  </div>

  <div className="bg-[#171f33] p-3 rounded-lg border border-[#222a3d]">
    <span className="font-mono-code text-[11px] text-[#9a9078] block uppercase">
      Pepe Mode
    </span>
    <span className="font-headline text-xl text-[#ffecb9] font-black">
      SUITED UP
    </span>
    <span className="font-mono-code text-[11px] text-[#4ae176] flex items-center mt-0.5">
      🕴️ Boss Mode
    </span>
  </div>

  <div className="bg-[#171f33] p-3 rounded-lg border border-[#222a3d]">
    <span className="font-mono-code text-[11px] text-[#9a9078] block uppercase">
      Fry Power
    </span>
    <span className="font-headline text-xl text-[#dae2fd] font-black">
      MAXIMUM
    </span>
    <span className="font-mono-code text-[11px] text-[#4ae176] flex items-center mt-0.5">
      ⚡ Full Send
    </span>
  </div>

  <div className="bg-[#171f33] p-3 rounded-lg border border-[#222a3d]">
    <span className="font-mono-code text-[11px] text-[#9a9078] block uppercase">
      Kitchen
    </span>
    <span className="font-headline text-xl text-[#4ae176] font-black">
      OPEN
    </span>
    <span className="font-mono-code text-[11px] text-[#9a9078] flex items-center mt-0.5">
      🍟 Come Hungry
    </span>
  </div>
</div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center relative mt-6 lg:mt-0">
            {/* Background sticker highlights */}
            <div
              id="hero-sticker-degen"
              className="absolute -top-4 -right-2 z-20 bg-[#facc15] text-[#3c2f00] font-headline text-sm font-black px-4 py-1.5 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000000] rotate-6 select-none"
            >
              🍟 100% ORGANIC DEGEN
            </div>
            <div
              id="hero-sticker-audit"
              className="absolute -bottom-4 -left-4 z-20 bg-[#00b954] text-[#003915] font-mono-code text-[11px] px-3 py-1.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] -rotate-3 font-black uppercase tracking-wider select-none"
            >
              ✅ AUDIT VERIFIED: ZERO CRUST
            </div>

            {/* Mascot Image Card */}
            <div
              id="hero-mascot-card"
              className="relative w-full max-w-md rounded-2xl overflow-hidden bg-[#131b2e] border-4 border-black shadow-[8px_8px_0px_#000000] group"
            >
              <div className="relative w-full aspect-square overflow-hidden bg-[#060e20]">
                <img
                  id="hero-senior-fry-exec-img"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Official FREPE crypto mascot - Executive Gentleman Pepe with top hat, crispy fries, glasses, suit, and shoes"
                  src={gentlemanPepeImg}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="bg-[#0b1326]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#facc15]/40">
                    <span className="font-mono-code text-[10px] text-[#facc15] uppercase font-bold tracking-wider">
                      OFFICIAL MASCOT
                    </span>
                    <p className="font-headline text-lg text-[#ffecb9] leading-tight font-black">
                      THE SENIOR FRY EXEC
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#facc15] text-[#3c2f00] flex items-center justify-center font-bold text-2xl border-2 border-black shadow-[2px_2px_0px_#000000]">
                    🍟
                  </div>
                </div>
              </div>

              {/* Card Bottom Bar */}
              <div className="p-3 bg-[#222a3d] border-t-2 border-black flex items-center justify-between text-xs font-mono-code">
                <span className="text-[#d1c6ab] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ae176] inline-block animate-pulse" />
                  Minting: Renounced
                </span>
                <span className="text-[#facc15] font-bold">LP Burnt: 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
