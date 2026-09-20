import React, { useState } from "react";
import { Volume2, VolumeX, Menu, X, Send, Flame, Fuel } from "lucide-react";
import { sound } from "../audio";
import { SOCIAL_LINKS, CONTRACT_ADDRESS_SHORT,LOGO } from "../constants/socialLinks";
import gentlemanPepeImg from "../assets/images/logo.png";

interface HeaderProps {
  onOpenSwap: () => void;
  onOpenLeaderboard: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSwap,
  onOpenLeaderboard,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
  };

  const navLinks = [
    { label: "About", href: "#about", id: "about" },
    { label: "Frepe Art", href: "#frepe-gallery-marquee", id: "frepe-gallery-marquee" },
    { label: "Crunch Arena", href: "#crunch-arena", id: "crunch-arena" },
    { label: "Duels", href: "#duels", id: "duels" },
    { label: "Leaderboard", onClick: onOpenLeaderboard, id: "leaderboard" },
    { label: "Tokenomics", href: "#tokenomics", id: "tokenomics" },
    { label: "How to Buy", href: "#how-to-buy", id: "how-to-buy" },
    { label: "Roadmap", href: "#roadmap", id: "roadmap" },
    { label: "Meme Stash", href: "#meme-stash", id: "meme-stash" },
  ];

  return (
    <>
      {/* Top Banner Ticker */}
      <div
        id="top-ticker-banner"
        className="fixed top-0 left-0 w-full z-50 overflow-hidden bg-[#facc15] text-[#3c2f00] border-b-2 border-black py-1 select-none shadow-sm"
      >
        <div className="animate-ticker font-mono-code text-[12px] uppercase font-bold tracking-wider flex items-center gap-6 whitespace-nowrap">
          <span>🏃‍♂️ PEPE RUN GAME LIVE IN ARENA!</span>
          <span>🍟</span>
          <span>🔥 $FREPE LIVE ON PUMP.FUN</span>
          <span>🍟</span>
          <span>0% TAX</span>
          <span>🍟</span>
          <span>100% LP BURNED</span>
          <span>🍟</span>
          <span>SOLANA SUB-CENT FEES</span>
          <span>🍟</span>
          <span>CRISPY GAINS ONLY</span>
          <span>🍟</span>
          <span>🏃‍♂️ PEPE RUN GAME LIVE!</span>
          <span>🍟</span>
          <span>SOL TPS: 3,450+</span>
          <span>🍟</span>
          <span>MCAP: $42.069M</span>
          <span>🍟</span>
          <span>🔥 $FREPE TO THE MOON</span>
          <span>🍟</span>
          <span>0% TAX</span>
          <span>🍟</span>
          <span>100% LP BURNED</span>
          <span>🍟</span>
          <span>CRISPY GAINS ONLY</span>
          <span>🍟</span>
          <span>SOL TPS: 3,450+</span>
          <span>🍟</span>
          <span>MCAP: $42.069M</span>
          <span>🍟</span>
        </div>
      </div>

      {/* Main App Header */}
      <header
        id="main-app-header"
        className="fixed top-8 w-full z-40 bg-[#0b1326]/95 backdrop-blur-md border-b border-[#2d3449]"
      >
        <div className="h-20 max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Burn / Gas Pill */}
          <div className="flex items-center gap-4">
<a
  id="header-brand-link"
  href="#about"
  className="flex items-center gap-2 group cursor-pointer"
>
  <img
    src={gentlemanPepeImg}
    alt="11FREPE Logo"
    className="w-20 h-20 object-contain"
  />
  <div className="flex flex-col -ml-1">
    <span className="font-headline text-1xl leading-none text-[#ffecb9] uppercase tracking-tight font-black">
      FREPE
    </span>
  </div>
</a>



            {/* <div className="hidden xl:flex items-center gap-2 bg-[#131b2e] border border-[#2d3449] px-3 py-1 rounded-full font-mono-code text-[12px]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ae176] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ae176]"></span>
              </span>
              <span className="text-[#4ae176] font-bold">BURN: 8.42%</span>
              <span className="text-[#9a9078]">|</span>
              <span className="text-[#d1c6ab] flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-[#facc15]" /> SOL &lt;$0.001 Fee
              </span>
            </div> */}
          </div>

          {/* Desktop Navigation */}
          <nav
            id="desktop-nav"
            className="hidden lg:flex items-center gap-5 text-sm uppercase tracking-wider font-medium"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              if (link.onClick) {
                return (
                  <button
                    key={link.id}
                    id={`nav-btn-${link.id}`}
                    onClick={link.onClick}
                    className={`transition-colors cursor-pointer ${
                      isActive
                        ? "text-[#facc15] font-bold underline underline-offset-4 decoration-2"
                        : "text-[#d1c6ab] hover:text-[#ffecb9]"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <a
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  className={`transition-colors ${
                    isActive
                      ? "text-[#facc15] font-bold underline underline-offset-4 decoration-2"
                      : "text-[#d1c6ab] hover:text-[#ffecb9]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs & Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={toggleSound}
              title={soundEnabled ? "Mute Arcade SFX" : "Unmute Arcade SFX"}
              className="p-2 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-[#d1c6ab] hover:text-[#facc15] border border-[#2d3449] transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#4ae176]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#ffb4ab]" />
              )}
            </button>

            {/* Quick Links on Tablet */}
            <div className="hidden sm:flex items-center gap-1 bg-[#222a3d] px-2 py-1 rounded-lg border border-[#2d3449]">
              <a
                id="header-telegram-icon"
                href={SOCIAL_LINKS.TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-[#d1c6ab] hover:text-[#facc15] transition-colors"
                title="Telegram Community"
              >
                <Send className="w-4 h-4" />
              </a>
              <button
                id="header-leaderboard-trophy-btn"
                onClick={onOpenLeaderboard}
                className="p-1 text-[#d1c6ab] hover:text-[#facc15] transition-colors text-sm"
                title="Global High Scores"
              >
                🏆
              </button>
            </div>

            {/* Ape In CTA */}
            <button
              id="header-ape-in-btn"
              onClick={onOpenSwap}
              className="neo-brutal-btn bg-[#facc15] text-[#3c2f00] font-headline font-bold uppercase px-3.5 py-2 rounded-lg flex items-center gap-1.5 leading-none text-sm cursor-pointer"
            >
              {/* <Flame className="w-4 h-4 text-[#93000a]" /> */}
              <span>Ape In</span>
            </button>

            {/* Profile Avatar */}
            <img
              id="user-profile-avatar"
              alt="Executive Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#facc15]/60 hidden xs:block"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Uq_mBpolc1lbi9rb6LSev9MjL-9BHswcYH4lREI7Q1-1ZZNo_zoXwsZiYCBbn30E4O9cgVo5ZkTHqmtNVh42pFVQRK0Uqx7lZgxjt5GV_vmLafLSAR_Nr6E0gBHkMWCaRHjz5qApfMW4jX3CBRXXlcoarBMXGbHLwWcfiEiTAvjhhQt5jvbeZaXvSP0hV_ASIm7eHiazEKmRL4trCi6U7T4K_ZDPuXlA_9hvyoTzKzivxWLDyXpAL6Z0E9ykF40UqeImQy2WVa7DY"
            />

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#222a3d] text-[#dae2fd] border border-[#2d3449]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden bg-[#0b1326] border-b-2 border-black px-4 py-4 flex flex-col gap-3 shadow-xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`mobile-nav-${link.id}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.onClick) {
                    link.onClick();
                  } else if (link.href) {
                    window.location.hash = link.href;
                  }
                }}
                className="text-left py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-wider text-[#dae2fd] hover:bg-[#171f33] hover:text-[#facc15]"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-[#2d3449] flex items-center justify-between text-xs font-mono-code text-[#9a9078]">
              <span>MINT: {CONTRACT_ADDRESS_SHORT}</span>
              <a
                href={SOCIAL_LINKS.PUMP_FUN}
                target="_blank"
                rel="noreferrer"
                className="text-[#4ae176] hover:text-[#facc15] transition-colors"
              >
                PUMP.FUN VERIFIED
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
