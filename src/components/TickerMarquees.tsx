import React from "react";

export const TickerMarquees: React.FC = () => {
  return (
    <div id="dual-marquee-tickers" className="w-full relative my-8 select-none overflow-hidden">
      {/* Top Strip (Electric Yellow / Black) -1deg */}
      <div className="w-full bg-[#facc15] text-[#231b00] py-2 border-y-2 border-black -rotate-1 transform origin-left shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        <div className="animate-ticker font-headline text-lg sm:text-xl font-black uppercase tracking-wider flex items-center gap-8 whitespace-nowrap">
          <span>🍟 SERVING FRESH GAINS</span>
          <span>🚀 NO VC DUMPS</span>
          <span>💰 100% LIQUIDITY LOCKED</span>
          <span>🔥 CONTRACT RENOUNCED</span>
          <span>🐸 PEPE GETS CRISPY</span>
          <span>🧂 PASS THE KETCHUP</span>
          <span>🍟 ZERO SLIPPAGE TAX</span>
          <span>📈 TO THE DEEP FRYER MOON</span>
          <span>🍟 SERVING FRESH GAINS</span>
          <span>🚀 NO VC DUMPS</span>
          <span>💰 100% LIQUIDITY LOCKED</span>
          <span>🔥 CONTRACT RENOUNCED</span>
          <span>🐸 PEPE GETS CRISPY</span>
          <span>🧂 PASS THE KETCHUP</span>
          <span>🍟 ZERO SLIPPAGE TAX</span>
          <span>📈 TO THE DEEP FRYER MOON</span>
        </div>
      </div>

      {/* Bottom Strip (Neon Green / Deep Navy) +1deg */}
      <div className="w-full bg-[#4ae176] text-[#002109] py-2 border-b-2 border-black rotate-1 transform origin-right -mt-2 shadow-[0_4px_16px_rgba(74,225,118,0.3)]">
        <div className="animate-ticker-reverse font-mono-code text-sm sm:text-base font-bold uppercase tracking-widest flex items-center gap-10 whitespace-nowrap">
          <span>⚡ 0% BUY TAX • 0% SELL TAX</span>
          <span>🍟 DEGEN CERTIFIED ON SOLANA</span>
          <span>🚀 LIVE ON PUMP.FUN</span>
          <span>⭐ CMC & CG FAST TRACK READY</span>
          <span>🐸 $FREPE ONLY GOES CRUNCH</span>
          <span>🍟 FRESH AIRDROPS INCOMING</span>
          <span>⚡ 0% BUY TAX • 0% SELL TAX</span>
          <span>🍟 DEGEN CERTIFIED ON SOLANA</span>
          <span>🚀 LIVE ON PUMP.FUN</span>
          <span>⭐ CMC & CG FAST TRACK READY</span>
          <span>🐸 $FREPE ONLY GOES CRUNCH</span>
          <span>🍟 FRESH AIRDROPS INCOMING</span>
        </div>
      </div>
    </div>
  );
};
