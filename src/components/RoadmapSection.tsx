import React from "react";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { SOCIAL_LINKS } from "../constants/socialLinks";

export const RoadmapSection: React.FC = () => {
  const phases = [
    {
      phase: "PHASE 01",
      title: "THE OIL HEATS UP",
      status: "IN PROGRESS",
      statusColor: "bg-[#4ae176] text-[#002109]",
      items: [
        "Fair Launch on pump.fun",
        "100% Bonding Curve Graduated & Raydium LP Burned",
        "Mint Authority Revoked & Verified Clean",
        "First 5,000 Holders Onboarded",
        "CoinGecko & CoinMarketCap Applied",
      ],
    },
    {
      phase: "PHASE 02",
      title: "FIRST CRUNCH WAVE",
      status: "IN PROGRESS",
      statusColor: "bg-[#facc15] text-[#3c2f00]",
      items: [
        "Wall Street Suited Pepe Marketing Blitz",
        "Fry Catcher Royale Mini-Game Launch",
        "Global High Score Leaderboard & SOL Stakes",
        "Trending #1 on DexScreener & DEXTools",
        "25,000+ Salty Executive Holders",
      ],
    },
    {
      phase: "PHASE 03",
      title: "THE DEEP FRYER EXPANSION",
      status: "UPCOMING",
      statusColor: "bg-[#222a3d] text-[#dae2fd]",
      items: [
        "Tier-1 Centralized Exchange Listings (CEX)",
        "Solana & Base Cross-Chain Fry Bridge",
        "Exclusive Suited Pepe Apron & Fry Merch Drop",
        "$100K High-Roller Crunch Tournaments",
        "Institutional Market Making Liquidity",
      ],
    },
    {
      phase: "PHASE 04",
      title: "GLOBAL FRY SUPREMACY",
      status: "LOCKED",
      statusColor: "bg-[#171f33] text-[#9a9078]",
      items: [
        "Viral Fast-Food Brand X/Twitter Raids",
        "Real-Life $FREPE Pop-Up Food Trucks in NYC & Tokyo",
        "Decentralized Fry DAO & Treasury Staking",
        "First Frog with French Fries on Mars",
      ],
    },
  ];

  return (
    <section id="roadmap" className="w-full py-16 bg-[#060e20] border-t-2 border-[#2d3449]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="font-mono-code text-xs bg-[#facc15] text-[#3c2f00] px-3 py-1 rounded font-black uppercase tracking-wider -rotate-1 shadow-sm">
            THE MASTER RECIPE
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl uppercase text-[#ffecb9] font-black">
            THE GOLDEN FRY ROADMAP
          </h2>
          <p className="text-sm sm:text-base text-[#d1c6ab] max-w-xl font-body">
            No empty promises or corporate pitch decks. Just an aggressive timeline of fried gains
            and community takeover.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {phases.map((p) => (
            <div
              key={p.phase}
              id={`roadmap-card-${p.phase.replace(/\s+/g, "-")}`}
              className="bg-[#131b2e] rounded-2xl border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-code text-xs text-[#9a9078] font-bold">{p.phase}</span>
                  <span
                    className={`font-mono-code text-[10px] px-2.5 py-0.5 rounded font-black uppercase ${p.statusColor}`}
                  >
                    {p.status}
                  </span>
                </div>
                <h3 className="font-headline text-xl text-[#ffecb9] uppercase font-black mb-4">
                  {p.title}
                </h3>
                <ul className="flex flex-col gap-2.5 font-body text-xs sm:text-sm text-[#d1c6ab]">
                  {p.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#facc15] mt-0.5 text-xs">🍟</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
