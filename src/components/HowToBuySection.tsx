import React, { useState } from "react";
import { Copy, Check, ArrowRight, ArrowDownUp, Flame } from "lucide-react";
import { sound } from "../audio";

interface HowToBuySectionProps {
  onOpenSwap: () => void;
}

export const HowToBuySection: React.FC<HowToBuySectionProps> = ({ onOpenSwap }) => {
  const [copied, setCopied] = useState(false);
  const contractAddress = "coming soon";

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    sound.playBoost();
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      num: "01",
      title: "SETUP A SOLANA WALLET",
      desc: "Download Phantom or Solflare wallet for desktop browser or mobile. Guard your recovery seed phrase with your life.",
      badge: "NON-CUSTODIAL",
    },
    {
      num: "02",
      title: "LOAD UP WITH SOLANA (SOL)",
      desc: "Deposit SOL directly from your preferred exchange (Coinbase, Binance, Kraken) into your personal Solana wallet address.",
      badge: "ZERO FRICTION",
    },
    {
      num: "03",
      title: "CONNECT TO PUMP.FUN",
      desc: "Navigate to pump.fun or use our instant on-site swap tool. Paste our official mint address to find $FREPE on the bonding curve.",
      badge: "VERIFIED MINT",
    },
    {
      num: "04",
      title: "SWAP & ENJOY THE CRUNCH",
      desc: "Set slippage to 1% (or auto), confirm transaction on Solana with instant sub-cent finality, and watch your bag get seasoned with crispy gains.",
      badge: "0% TAX",
    },
  ];

  return (
    <section id="how-to-buy" className="w-full py-16 max-w-[1280px] mx-auto px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="font-mono-code text-xs bg-[#4ae176] text-[#002109] px-3 py-1 rounded font-black uppercase tracking-wider inline-block mb-2 -rotate-1 shadow-sm">
            EASY 4-STEP ONBOARDING
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl uppercase text-[#ffecb9] font-black">
            HOW TO GET EXTRA CRISPY
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#d1c6ab] max-w-md font-body">
          Getting your hands on $FREPE takes less than 90 seconds. Follow these steps and claim
          your seat at the executive fry counter.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {steps.map((step) => (
          <div
            key={step.num}
            id={`buy-step-${step.num}`}
            className="bg-[#131b2e] rounded-2xl border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between group hover:border-[#facc15] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-headline text-4xl text-[#facc15] font-black group-hover:scale-110 transition-transform inline-block">
                  {step.num}
                </span>
                <span className="font-mono-code text-[10px] bg-[#171f33] text-[#4ae176] px-2 py-0.5 rounded border border-[#2d3449] font-bold">
                  {step.badge}
                </span>
              </div>
              <h3 className="font-headline text-lg text-[#ffecb9] uppercase font-black mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#d1c6ab] leading-relaxed font-body">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quick Swap Callout Banner */}
      <div className="bg-[#171f33] rounded-2xl border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#facc15] text-[#3c2f00] flex items-center justify-center text-2xl font-bold border-2 border-black -rotate-3 shrink-0">
            🍟
          </div>
          <div>
            <h4 className="font-headline text-lg sm:text-xl text-[#ffecb9] uppercase font-black">
              INSTANT IN-APP SWAP CALCULATOR
            </h4>
            <span className="font-mono-code text-xs text-[#4ae176] font-bold">
              ESTIMATE: 1 SOL ≈ 1,425,000 $FREPE • SLIPPAGE 0% • INSTANT SOLANA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            id="how-to-buy-copy-ca"
            onClick={handleCopy}
            className="flex-1 md:flex-none neo-brutal-btn bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] px-3.5 py-2.5 rounded-xl font-mono-code text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#4ae176]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "COPIED" : "COPY CA"}</span>
          </button>

          <button
            id="how-to-buy-swap-modal-btn"
            onClick={onOpenSwap}
            className="flex-1 md:flex-none neo-brutal-btn bg-[#facc15] text-[#3c2f00] font-headline text-base uppercase px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black cursor-pointer shadow-[3px_3px_0px_#000000]"
          >
            <ArrowDownUp className="w-4 h-4" />
            <span>OPEN SWAPPER</span>
          </button>
        </div>
      </div>
    </section>
  );
};
