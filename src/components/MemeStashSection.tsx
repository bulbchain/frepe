import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Share2,
  Flame,
  Send,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  RefreshCw,
  X,
  Wand2,
  Maximize2,
  SlidersHorizontal,
} from "lucide-react";
import { sound } from "../audio";
import { SOCIAL_LINKS } from "../constants/socialLinks";

import frepeJacuzzi from "../assets/images/frepe_fry_jacuzzi_1789905527682.jpg";
import frepeBoardroom from "../assets/images/frepe_boardroom_raid_1789905512832.jpg";
import frepeWallStreet from "../assets/images/frepe_wall_street_bull_1789905071874.jpg";
import frepeFryKing from "../assets/images/frepe_golden_fry_king_1789905092335.jpg";
import gentlemanPepeRefined from "../assets/images/gentleman_pepe_refined_1789889197008.jpg";
import gentlemanPepeMascot from "../assets/images/gentleman_pepe_mascot_1789888715358.jpg";

interface MemeItem {
  id: string;
  title: string;
  category: "raid" | "executive" | "lore";
  author: string;
  crunchVotes: number;
  badge: string;
  image: string;
  caption: string;
  raidText: string;
}

const INITIAL_MEMES: MemeItem[] = [
  {
    id: "meme-jacuzzi",
    title: "BATHING IN CRISPY GAINS",
    category: "lore",
    author: "@DegenFryChef",
    crunchVotes: 2480,
    badge: "VIRAL SENSATION",
    image: frepeJacuzzi,
    caption: "When the SOL candle hits pump.fun graduation and you swap water for 350°F golden fries.",
    raidText: "Chilling in the $FREPE fry jacuzzi while the chart goes vertical on Solana! 🍟🚀 #FrepeOnSolana #pumpfun",
  },
  {
    id: "meme-boardroom",
    title: "PUMP.FUN BOARDROOM STRATEGY",
    category: "raid",
    author: "@SuitedPepeSol",
    crunchVotes: 3150,
    badge: "TOP RAID WEAPON",
    image: frepeBoardroom,
    caption: "Executive presentation: Step 1: Fry spuds. Step 2: Burn LP. Step 3: Vertical green candles.",
    raidText: "Executive meeting adjourned. 100% of portfolio allocated into $FREPE. Only crispy gains! 🍟📊 #SolanaMeme",
  },
  {
    id: "meme-wallst",
    title: "24/7 TRADING DESK FREPE",
    category: "executive",
    author: "@WallStFryer",
    crunchVotes: 1890,
    badge: "DEGEN EXECUTIVE",
    image: frepeWallStreet,
    caption: "Snacking on golden hashbrowns while monitoring pump.fun sub-cent Solana transactions.",
    raidText: "Wall Street suits could never understand the culinary perfection of $FREPE on Solana. 🍟📈",
  },
  {
    id: "meme-fryking",
    title: "100X FRY KING TROPHY",
    category: "lore",
    author: "@SolanaFryLord",
    crunchVotes: 2740,
    badge: "DIAMOND SPATULA",
    image: frepeFryKing,
    caption: "Paper hands get soggy discarded spuds. Diamond hands inherit the golden carton.",
    raidText: "Holding the trophy carton proud! No soggy sells, strictly extra crispy with $FREPE! 🍟💎",
  },
  {
    id: "meme-refined",
    title: "SUITED & BOOTED MASCOT",
    category: "executive",
    author: "@PepeInATux",
    crunchVotes: 1620,
    badge: "SIGNATURE LORE",
    image: gentlemanPepeRefined,
    caption: "Silk lapels, steamed spectacles, and freshly sliced Idaho russet potatoes in the top hat.",
    raidText: "The gentleman standard in meme tokens. 0% tax, renounced mint, 100% crispy. $FREPE 🍟🎩",
  },
  {
    id: "meme-runner",
    title: "HIGH-VELOCITY SOLANA RUNNER",
    category: "raid",
    author: "@SpeedyFrog",
    crunchVotes: 2190,
    badge: "ARENA CHAMPION",
    image: gentlemanPepeMascot,
    caption: "Dodging red candles at 65,000 TPS on Solana while catching floating golden fries.",
    raidText: "Sprint to the fryer! $FREPE runner breaking high scores and bonding curves on pump.fun! 🏃‍♂️🍟",
  },
];

const PRESET_MEME_TEXTS = [
  { top: "WHEN THE OIL HITS 420°F", bottom: "AND SOLANA GAS IS $0.0001" },
  { top: "NO SOGGY PAPER HANDS", bottom: "STRICTLY EXTRA CRISPY" },
  { top: "ME EXPLAINING $FREPE", bottom: "TO MY FINANCIAL ADVISOR" },
  { top: "SUITED UP FOR THE RAID", bottom: "TOP HAT PACKED WITH FRIES" },
  { top: "BONDING CURVE GRADUATED", bottom: "RAYDIUM LIQUIDITY FRIED FOREVER" },
];

export const MemeStashSection: React.FC<{ onOpenSwap: () => void }> = ({ onOpenSwap }) => {
  const [memes, setMemes] = useState<MemeItem[]>(INITIAL_MEMES);
  const [activeCategory, setActiveCategory] = useState<"all" | "raid" | "executive" | "lore" | "generator">("all");
  const [activeModalMeme, setActiveModalMeme] = useState<MemeItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Meme Generator State
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [topText, setTopText] = useState<string>("BOUGHT THE DIP");
  const [bottomText, setBottomText] = useState<string>("ATE THE CRISPY CHIP");
  const [fontSize, setFontSize] = useState<number>(36);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatorCopied, setGeneratorCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const templates = [
    { title: "Fry Jacuzzi", image: frepeJacuzzi },
    { title: "Boardroom Raid", image: frepeBoardroom },
    { title: "Wall St Trading", image: frepeWallStreet },
    { title: "Fry King Trophy", image: frepeFryKing },
    { title: "Suited Executive", image: gentlemanPepeRefined },
    { title: "Retro Sprinter", image: gentlemanPepeMascot },
  ];

  // Upvote Meme Handler
  const handleVote = (id: string) => {
    sound.playFryCatch();
    setMemes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, crunchVotes: m.crunchVotes + 1 } : m))
    );
  };

  // Copy Raid Text
  const handleCopyRaid = (m: MemeItem) => {
    navigator.clipboard.writeText(m.raidText);
    setCopiedId(m.id);
    sound.playBoost();
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Share to X
  const handleShareToX = (m: MemeItem) => {
    sound.playBoost();
    const tweetText = encodeURIComponent(`${m.raidText}\n\nhttps://frepe.fun`);
    window.open(`${SOCIAL_LINKS.TWITTER_INTENT}?text=${tweetText}`, "_blank");
  };

  // Draw Meme Canvas for the Generator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = templates[selectedTemplateIndex].image;

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;

      // Draw background image
      ctx.drawImage(img, 0, 0, 600, 600);

      // Add top and bottom dark gradient overlay for text readability
      const topGrad = ctx.createLinearGradient(0, 0, 0, 140);
      topGrad.addColorStop(0, "rgba(0,0,0,0.65)");
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, 600, 140);

      const botGrad = ctx.createLinearGradient(0, 460, 0, 600);
      botGrad.addColorStop(0, "rgba(0,0,0,0)");
      botGrad.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, 460, 600, 140);

      // Text styling - Classic Impact Meme Font
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(4, fontSize / 5);
      ctx.font = `900 ${fontSize}px 'Impact', 'Arial Black', sans-serif`;

      // Draw Top Text
      if (topText.trim()) {
        const lines = wrapText(ctx, topText.toUpperCase(), 560);
        lines.forEach((line, i) => {
          const y = 45 + i * (fontSize + 6);
          ctx.strokeText(line, 300, y);
          ctx.fillText(line, 300, y);
        });
      }

      // Draw Bottom Text
      if (bottomText.trim()) {
        const lines = wrapText(ctx, bottomText.toUpperCase(), 560);
        const startY = 570 - (lines.length - 1) * (fontSize + 6);
        lines.forEach((line, i) => {
          const y = startY + i * (fontSize + 6);
          ctx.strokeText(line, 300, y);
          ctx.fillText(line, 300, y);
        });
      }

      // Watermark badge
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeText("$FREPE • PUMP.FUN", 520, 588);
      ctx.fillText("$FREPE • PUMP.FUN", 520, 588);
    };
  }, [selectedTemplateIndex, topText, bottomText, fontSize]);

  // Helper function for wrapping meme text
  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Download Generated Meme
  const handleDownloadGenerated = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.playCashout();
    const link = document.createElement("a");
    link.download = `frepe_meme_${Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  };

  // Copy Generated Meme Image to Clipboard (or text if clipboard blob not supported)
  const handleCopyGeneratedImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setGeneratorCopied(true);
          sound.playBoost();
          setTimeout(() => setGeneratorCopied(false), 2000);
        }
      });
    } catch {
      // Fallback
      handleDownloadGenerated();
    }
  };

  const filteredMemes =
    activeCategory === "all"
      ? memes
      : memes.filter((m) => m.category === activeCategory);

  return (
    <section id="meme-stash" className="w-full py-16 max-w-[1280px] mx-auto px-4 lg:px-8 relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono-code text-xs bg-[#facc15] text-[#3c2f00] px-3 py-1 rounded font-black uppercase tracking-wider inline-flex items-center gap-1.5 -rotate-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              COMMUNITY PROPAGANDA LAB
            </span>
            <span className="font-mono-code text-xs text-[#4ae176] font-bold">
              • READY FOR 𝕏 & TELEGRAM RAIDS
            </span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl uppercase text-[#ffecb9] font-black tracking-tight">
            COMMUNITY MEME VAULT
          </h2>
          <p className="text-sm sm:text-base text-[#d1c6ab] max-w-xl font-body mt-1">
            Certified crispy meme ammunition for raiding Twitter, Telegram, and pump.fun threads.
            Download high-res artwork, copy viral captions, or bake your own custom memes below!
          </p>
        </div>

        {/* Filter Navigation Chips */}
        <div className="flex flex-wrap items-center gap-2 bg-[#131b2e] p-1.5 rounded-2xl border-2 border-[#2d3449] shadow-[3px_3px_0px_#000000]">
          <button
            onClick={() => {
              setActiveCategory("all");
              sound.playBoost();
            }}
            className={`px-3 py-1.5 rounded-xl font-mono-code text-xs font-black uppercase transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-[#facc15] text-[#3c2f00] shadow-sm"
                : "text-[#dae2fd] hover:text-[#facc15]"
            }`}
          >
            🔥 All Memes
          </button>
          <button
            onClick={() => {
              setActiveCategory("raid");
              sound.playBoost();
            }}
            className={`px-3 py-1.5 rounded-xl font-mono-code text-xs font-black uppercase transition-all cursor-pointer ${
              activeCategory === "raid"
                ? "bg-[#4ae176] text-[#002109] shadow-sm"
                : "text-[#dae2fd] hover:text-[#4ae176]"
            }`}
          >
            🚀 Pump.fun Raids
          </button>
          <button
            onClick={() => {
              setActiveCategory("executive");
              sound.playBoost();
            }}
            className={`px-3 py-1.5 rounded-xl font-mono-code text-xs font-black uppercase transition-all cursor-pointer ${
              activeCategory === "executive"
                ? "bg-[#facc15] text-[#3c2f00] shadow-sm"
                : "text-[#dae2fd] hover:text-[#facc15]"
            }`}
          >
            💼 Executive Suits
          </button>
          <button
            onClick={() => {
              setActiveCategory("lore");
              sound.playBoost();
            }}
            className={`px-3 py-1.5 rounded-xl font-mono-code text-xs font-black uppercase transition-all cursor-pointer ${
              activeCategory === "lore"
                ? "bg-[#facc15] text-[#3c2f00] shadow-sm"
                : "text-[#dae2fd] hover:text-[#facc15]"
            }`}
          >
            🍟 Fry Lore
          </button>
          <button
            onClick={() => {
              setActiveCategory("generator");
              sound.playBoost();
            }}
            className={`px-3 py-1.5 rounded-xl font-mono-code text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === "generator"
                ? "bg-[#ff5252] text-white shadow-sm"
                : "text-[#ff5252] hover:bg-[#ff5252]/10"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Meme Studio</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MEME CARDS GRID */}
      {activeCategory !== "generator" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredMemes.map((m) => (
            <div
              key={m.id}
              id={`meme-card-${m.id}`}
              className="bg-[#131b2e] rounded-3xl border-4 border-black overflow-hidden shadow-[6px_6px_0px_#000000] flex flex-col group hover:border-[#facc15] hover:shadow-[8px_8px_0px_#000000] transition-all"
            >
              {/* Artwork Box with Zoom Action */}
              <div
                onClick={() => {
                  setActiveModalMeme(m);
                  sound.playBoost();
                }}
                className="relative w-full aspect-square bg-[#060e20] cursor-pointer overflow-hidden border-b-2 border-black"
              >
                <img
                  src={m.image}
                  alt={m.title}
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Badge Tag */}
                <div className="absolute top-3 left-3 bg-black/85 text-[#facc15] font-mono-code text-[11px] font-black px-2.5 py-1 rounded-lg border border-black uppercase shadow-md">
                  {m.badge}
                </div>

                {/* Hover inspect icon */}
                <div className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-black/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Maximize2 className="w-4 h-4 text-[#facc15]" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <h4 className="font-headline text-lg sm:text-xl text-[#ffecb9] uppercase font-black tracking-tight group-hover:text-[#facc15] transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#d1c6ab] font-body mt-1.5 leading-relaxed line-clamp-2">
                    {m.caption}
                  </p>
                </div>

                {/* Viral Raid Preview Quote */}
                <div className="bg-[#0b1326] p-2.5 rounded-xl border border-[#2d3449] font-mono-code text-[11px] text-[#4ae176] flex items-start gap-2">
                  <span className="text-[#facc15] font-bold shrink-0">RAID:</span>
                  <span className="truncate">{m.raidText}</span>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-[#2d3449] flex items-center justify-between gap-2">
                  {/* Crunch Votes */}
                  <button
                    id={`vote-meme-${m.id}`}
                    onClick={() => handleVote(m.id)}
                    className="neo-brutal-btn bg-[#060e20] hover:bg-[#222a3d] text-[#dae2fd] px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono-code text-xs font-bold cursor-pointer border border-[#2d3449]"
                    title="Give Crunchy Upvote"
                  >
                    <Flame className="w-3.5 h-3.5 text-[#ff5252]" />
                    <span>{m.crunchVotes.toLocaleString()}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Copy Raid Caption */}
                    <button
                      onClick={() => handleCopyRaid(m)}
                      className="neo-brutal-btn bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] p-2 rounded-xl text-xs font-mono-code flex items-center gap-1 font-bold cursor-pointer"
                      title="Copy Raid Text"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-[#4ae176]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Raid on X */}
                    <button
                      onClick={() => handleShareToX(m)}
                      className="neo-brutal-btn bg-[#171f33] hover:bg-black text-[#dae2fd] px-3 py-1.5 rounded-xl font-mono-code text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#2d3449]"
                      title="Tweet on X"
                    >
                      <span>𝕏 RAID</span>
                      <ExternalLink className="w-3 h-3 text-[#facc15]" />
                    </button>

                    {/* Download Image */}
                    <a
                      href={m.image}
                      download={`frepe_${m.id}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="neo-brutal-btn bg-[#facc15] hover:bg-[#ffecb9] text-[#3c2f00] p-2 rounded-xl flex items-center justify-center font-bold cursor-pointer shadow-sm"
                      title="Download Full-Res Meme"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: INTERACTIVE MEME STUDIO ("THE FRY-O-MATIC MEME BAKER") */}
      {(activeCategory === "generator" || activeCategory === "all") && (
        <div
          id="fry-meme-studio"
          className="mb-16 bg-[#131b2e] rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000000] relative overflow-hidden"
        >
          {/* Studio Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b-2 border-[#2d3449]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#facc15] text-[#3c2f00] flex items-center justify-center font-headline text-2xl font-black border-2 border-black -rotate-3 shadow-md">
                🍟
              </div>
              <div>
                <h3 className="font-headline text-2xl sm:text-3xl text-[#ffecb9] uppercase font-black">
                  FRY-O-MATIC MEME STUDIO
                </h3>
                <span className="font-mono-code text-xs text-[#4ae176] font-bold">
                  BAKE YOUR OWN CUSTOM FREPE MEMES IN SECONDS
                </span>
              </div>
            </div>

            <span className="font-mono-code text-xs text-[#9a9078] bg-[#060e20] px-3 py-1.5 rounded-lg border border-[#2d3449] w-max">
              ⚡ INSTANT CANVAS EXPORT
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Live Canvas Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[440px] aspect-square rounded-2xl overflow-hidden border-4 border-black shadow-[6px_6px_0px_#000000] bg-black">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain block"
                />
              </div>

              {/* Generator Action Buttons */}
              <div className="w-full max-w-[440px] mt-4 flex items-center gap-3">
                <button
                  id="download-generated-meme-btn"
                  onClick={handleDownloadGenerated}
                  className="flex-1 neo-brutal-btn bg-[#facc15] hover:bg-[#ffecb9] text-[#3c2f00] font-headline text-sm uppercase py-3 rounded-xl border-2 border-black font-black flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000]"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD MEME</span>
                </button>

                <button
                  id="copy-generated-meme-btn"
                  onClick={handleCopyGeneratedImage}
                  className="neo-brutal-btn bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] font-mono-code text-xs uppercase px-4 py-3 rounded-xl border-2 border-black font-bold flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#000000]"
                >
                  {generatorCopied ? (
                    <>
                      <Check className="w-4 h-4 text-[#4ae176]" />
                      <span className="text-[#4ae176]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Customization Controls */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              {/* Template Selector */}
              <div>
                <label className="block text-xs font-mono-code text-[#ffecb9] font-bold uppercase mb-2">
                  1. CHOOSE FREPE TEMPLATE
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {templates.map((tpl, idx) => (
                    <button
                      key={tpl.title}
                      onClick={() => {
                        setSelectedTemplateIndex(idx);
                        sound.playBoost();
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedTemplateIndex === idx
                          ? "border-[#facc15] ring-2 ring-[#facc15] scale-105 shadow-md"
                          : "border-black opacity-70 hover:opacity-100"
                      }`}
                      title={tpl.title}
                    >
                      <img
                        src={tpl.image}
                        alt={tpl.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Inputs */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-[#ffecb9] font-bold uppercase mb-1">
                    TOP MEME TEXT
                  </label>
                  <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="e.g. WHEN THE OIL HITS 420°F"
                    className="w-full bg-[#060e20] border-2 border-[#2d3449] focus:border-[#facc15] rounded-xl px-3.5 py-2.5 text-sm font-mono-code text-[#dae2fd] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-[#ffecb9] font-bold uppercase mb-1">
                    BOTTOM MEME TEXT
                  </label>
                  <input
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="e.g. AND YOU HOLD ZERO SOGGY PAPER"
                    className="w-full bg-[#060e20] border-2 border-[#2d3449] focus:border-[#facc15] rounded-xl px-3.5 py-2.5 text-sm font-mono-code text-[#dae2fd] outline-none"
                  />
                </div>
              </div>

              {/* Font Size Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono-code mb-1">
                  <span className="text-[#ffecb9] font-bold uppercase">FONT SIZE</span>
                  <span className="text-[#facc15]">{fontSize}PX</span>
                </div>
                <input
                  type="range"
                  min="22"
                  max="52"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[#facc15] cursor-pointer"
                />
              </div>

              {/* Quick Preset Ideas */}
              <div>
                <label className="block text-xs font-mono-code text-[#9a9078] font-bold uppercase mb-2">
                  ⚡ QUICK VIRAL PRESETS:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_MEME_TEXTS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setTopText(preset.top);
                        setBottomText(preset.bottom);
                        sound.playBoost();
                      }}
                      className="px-2.5 py-1 bg-[#060e20] hover:bg-[#222a3d] border border-[#2d3449] hover:border-[#facc15] rounded-lg text-[11px] font-mono-code text-[#dae2fd] cursor-pointer"
                    >
                      "{preset.top}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Grand Bottom Banner: READY TO GET EXTRA CRISPY? */}
<div
  id="ready-to-get-crispy-banner"
  className="w-full bg-[#facc15] rounded-3xl border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0px_#000000] relative overflow-hidden flex flex-col items-center text-center -rotate-0.5"
>
  {/* Icon */}
  <div className="w-16 h-16 rounded-2xl bg-black text-[#facc15] text-3xl font-headline flex items-center justify-center border-2 border-black -rotate-6 mb-4 shadow-[3px_3px_0px_#3c2f00]">
    🍟
  </div>

  {/* Heading */}
  <h3 className="font-headline text-3xl sm:text-5xl lg:text-6xl text-[#231b00] uppercase font-black tracking-tight mb-2">
    READY TO GET EXTRA CRISPY?
  </h3>

  {/* Subtitle */}
  <p className="font-mono-code text-sm sm:text-base text-[#3c2f00] font-black uppercase tracking-widest max-w-xl mb-8">
    THE FRYER IS HOT. FREPE IS READY. WELCOME TO THE CRISPIEST OPERATION ON SOLANA.
  </p>

  {/* Buttons */}
  <div className="flex flex-wrap items-center justify-center gap-4">

    {/* X */}
    <a
      id="grand-banner-x-btn"
      href={SOCIAL_LINKS.TWITTER}
      target="_blank"
      rel="noreferrer"
      className="neo-brutal-btn bg-[#131b2e] text-[#ffecb9] hover:bg-black font-headline text-base sm:text-lg uppercase px-6 py-3.5 rounded-xl flex items-center gap-2 border-2 border-black font-black shadow-[4px_4px_0px_#3c2f00]"
    >
      <span>FOLLOW FREPE 𝕏</span>
    </a>

    {/* Play */}
    <a
      id="grand-banner-play-btn"
      href="#crunch-arena"
      className="neo-brutal-btn bg-black text-[#facc15] hover:bg-[#1e1b4b] font-headline text-base sm:text-lg uppercase px-6 py-3.5 rounded-xl flex items-center gap-2 font-black shadow-[4px_4px_0px_#3c2f00]"
    >
      <span>PLAY FREPE 🍟</span>
    </a>

    {/* Pump.fun */}
    <a
      id="grand-banner-pump-btn"
      href={SOCIAL_LINKS.PUMP_FUN}
      target="_blank"
      rel="noreferrer"
      className="neo-brutal-btn bg-[#4ae176] text-[#002109] font-headline text-base sm:text-lg uppercase px-6 py-3.5 rounded-xl flex items-center gap-2 border-2 border-black font-black shadow-[4px_4px_0px_#3c2f00]"
    >
      {/* <Flame className="w-5 h-5 text-[#93000a]" /> */}
      <span>BUY ON PUMP.FUN</span>
    </a>

  </div>

  {/* Bottom micro-copy */}
  <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono-code text-[10px] sm:text-xs text-[#3c2f00] font-black uppercase">
    <span>🍟 EAT</span>
    <span>•</span>
    <span>🔥 FRY</span>
    <span>•</span>
    <span>🐸 FREPE</span>
    <span>•</span>
    <span>🚀 REPEAT</span>
  </div>
</div>

      {/* FULL-SCREEN MEME LIGHTBOX MODAL */}
      {activeModalMeme && (
        <div
          id="meme-stash-modal-overlay"
          onClick={() => setActiveModalMeme(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            id="meme-stash-modal-card"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131b2e] border-4 border-black rounded-3xl max-w-xl w-full overflow-hidden shadow-[8px_8px_0px_#000000] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 bg-[#060e20] border-b-2 border-[#2d3449] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍟</span>
                <div>
                  <h4 className="font-headline text-lg text-[#ffecb9] uppercase font-black">
                    {activeModalMeme.title}
                  </h4>
                  <span className="font-mono-code text-[11px] text-[#facc15] font-bold">
                    {activeModalMeme.badge} • By {activeModalMeme.author}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalMeme(null)}
                className="p-1.5 rounded-lg bg-[#222a3d] hover:bg-[#93000a] text-[#dae2fd] border border-[#2d3449] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image Preview */}
            <div className="relative w-full max-h-[55vh] bg-black flex items-center justify-center p-3">
              <img
                src={activeModalMeme.image}
                alt={activeModalMeme.title}
                className="max-h-[50vh] max-w-full object-contain rounded-xl border border-[#2d3449]"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-[#0b1326] border-t-2 border-[#2d3449] flex flex-col gap-3">
              <p className="text-sm text-[#d1c6ab] font-body">
                {activeModalMeme.caption}
              </p>

              <div className="bg-[#131b2e] p-3 rounded-xl border border-[#2d3449] flex items-center justify-between gap-2 font-mono-code text-xs">
                <span className="text-[#dae2fd] truncate">{activeModalMeme.raidText}</span>
                <button
                  onClick={() => handleCopyRaid(activeModalMeme)}
                  className="shrink-0 text-[#facc15] hover:underline font-bold"
                >
                  {copiedId === activeModalMeme.id ? "COPIED!" : "COPY"}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleShareToX(activeModalMeme)}
                  className="neo-brutal-btn bg-[#171f33] hover:bg-black text-[#dae2fd] px-4 py-2 rounded-xl font-mono-code text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#2d3449]"
                >
                  <span>𝕏 RAID TWEET</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#facc15]" />
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={activeModalMeme.image}
                    download={`frepe_${activeModalMeme.id}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="neo-brutal-btn bg-[#facc15] hover:bg-[#ffecb9] text-[#3c2f00] px-4 py-2 rounded-xl font-headline text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD</span>
                  </a>
                  <button
                    onClick={() => setActiveModalMeme(null)}
                    className="neo-brutal-btn bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] px-4 py-2 rounded-xl font-mono-code text-xs font-bold cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
