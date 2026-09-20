import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Plus,
  Play,
  Pause,
  Maximize2,
  Download,
  Trash2,
  Check,
  Copy,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  Image as ImageIcon,
} from "lucide-react";
import { sound } from "../audio";
import { SOCIAL_LINKS } from "../constants/socialLinks";
import gentlemanPepeRefined from "../assets/images/gentleman_pepe_refined_1789889197008.jpg";
import gentlemanPepeMascot from "../assets/images/gentleman_pepe_mascot_1789888715358.jpg";
import frepeWallStreetBull from "../assets/images/frepe_wall_street_bull_1789905071874.jpg";
import frepeGoldenFryKing from "../assets/images/frepe_golden_fry_king_1789905092335.jpg";
import frepeJacuzzi from "../assets/images/frepe_fry_jacuzzi_1789905527682.jpg";
import frepeBoardroom from "../assets/images/frepe_boardroom_raid_1789905512832.jpg";
import frepe1 from "../assets/images/frepe1.JPG";
import frepe2 from "../assets/images/frepe2.JPG";
import frepe3 from "../assets/images/frepe3.JPG";
import frepe4 from "../assets/images/frepe4.JPG";
import frepe5 from "../assets/images/frepe5.JPG";
import frepe6 from "../assets/images/frepe6.JPG";
import frepe7 from "../assets/images/frepe7.JPG";
import frepe8 from "../assets/images/frepe8.JPG";
import frepe9 from "../assets/images/frepe9.JPG";
import frepe10 from "../assets/images/frepe10.JPG";
import frepe11 from "../assets/images/frepe11.JPG";


export interface FrepeImageItem {
  id: string;
  title: string;
  tag: string;
  caption: string;
  imageUrl: string;
  isCustom?: boolean;
}

const DEFAULT_FORWARD_IMAGES: FrepeImageItem[] = [
  {
    id: "frepe-fwd-1",
    title: "EXECUTIVE WALL ST FREPE",
    tag: "#01 TOP HAT & TUXEDO",
    caption: "The definitive suited frog, ready to discuss crispy gains over a serious business meeting.",
    imageUrl: gentlemanPepeRefined,
  },
   {
    id: "frepe-fwd-8",
    title: "CRISPY FRY JACUZZI SPA",
    tag: "#08 EXECUTIVE LIFESTYLE",
    caption: "A hard day at the office deserves an even harder fry session.",
    imageUrl: frepeJacuzzi,
  },
  {
    id: "frepe-fwd-2",
    title: "FREPE BOARDROOM",
    tag: "#02 BIG MEETING ENERGY",
    caption: "Pepe walks into the boardroom like he already owns the entire market.",
    imageUrl: frepe1,
  },
  {
    id: "frepe-fwd-3",
    title: "THE EXECUTIVE TEAM",
    tag: "#03 CORPORATE FREPE",
    caption: "Suit on, fries secured, and absolutely no time for boring meetings.",
    imageUrl: frepe2,
  },
  {
    id: "frepe-fwd-4",
    title: "CRISPY BUSINESS MEETING",
    tag: "#04 FRY STRATEGY",
    caption: "Important business decisions are being made. The fries are also on the agenda.",
    imageUrl: frepe3,
  },
    {
    id: "frepe-fwd-7",
    title: "100X FRY KING ROYALE",
    tag: "#07 GOLDEN HARVEST",
    caption: "Holding the trophy fast-food carton like the next big corporate acquisition.",
    imageUrl: frepeGoldenFryKing,
  },
  {
    id: "frepe-fwd-5",
    title: "WALL STREET FREPE",
    tag: "#05 MARKET MOVES",
    caption: "Pepe studying the charts while casually pretending this is a normal Monday meeting.",
    imageUrl: frepe4,
  },
  {
    id: "frepe-fwd-6",
    title: "FREPE CEO MODE",
    tag: "#06 CEO ENERGY",
    caption: "When the meeting starts at 9 and the crispy gains discussion starts at 9:01.",
    imageUrl: frepe5,
  },

  {
    id: "frepe-fwd-9",
    title: "RETRO RUNNER SPRINT",
    tag: "#09 HIGH VELOCITY",
    caption: "Late for the board meeting. Still dressed better than everyone else.",
    imageUrl: gentlemanPepeMascot,
  },
];

const DEFAULT_BACKWARD_IMAGES: FrepeImageItem[] = [
  {
    id: "frepe-bwd-1",
    title: "FREPE INVESTOR MEETING",
    tag: "#10 SERIOUS BUSINESS",
    caption: "Pepe presenting the quarterly crispy-gains strategy to the executive team.",
    imageUrl: frepe6,
  },
  {
    id: "frepe-bwd-2",
    title: "THE BOARDROOM BOSS",
    tag: "#11 BOSS MODE",
    caption: "Everyone is taking notes. Pepe is already thinking about the next move.",
    imageUrl: frepe7,
  },
  {
    id: "frepe-bwd-3",
    title: "FREPE CORPORATE CALL",
    tag: "#12 MEETING MODE",
    caption: "Another meeting, another opportunity to casually discuss the future of FREPE.",
    imageUrl: frepe8,
  },
  {
    id: "frepe-bwd-4",
    title: "SUITED FREPE",
    tag: "#13 DRESSED TO WIN",
    caption: "Sharp suit. Serious face. Questionable financial decisions.",
    imageUrl: frepe9,
  },
  {
    id: "frepe-bwd-5",
    title: "FREPE STRATEGY SESSION",
    tag: "#14 MASTER PLAN",
    caption: "The team has gathered. The charts are open. The fries are ready.",
    imageUrl: frepe10,
  },
  {
    id: "frepe-bwd-6",
    title: "EXECUTIVE FREPE CLUB",
    tag: "#15 CORPORATE LORE",
    caption: "Just another high-level meeting at the headquarters of crispy gains.",
    imageUrl: frepe11,
  },
  {
    id: "frepe-bwd-7",
    title: "PUMP.FUN BOARDROOM",
    tag: "#16 MARKET ROOM",
    caption: "Pepe enters the meeting with one goal: keep the vibes crispy.",
    imageUrl: frepeBoardroom,
  },
  {
    id: "frepe-bwd-8",
    title: "TRADING FLOOR FREPE",
    tag: "#17 DEGEN EXECUTIVE",
    caption: "Monitoring the market while maintaining impeccable corporate fashion.",
    imageUrl: frepeWallStreetBull,
  },
];

const STORAGE_KEY = "frepe_custom_gallery_images_v1";

export const FrepeImageMarquee: React.FC = () => {
  const [forwardImages, setForwardImages] = useState<FrepeImageItem[]>(DEFAULT_FORWARD_IMAGES);
  const [backwardImages, setBackwardImages] = useState<FrepeImageItem[]>(DEFAULT_BACKWARD_IMAGES);

  // Marquee playback speed & state
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 0.5x, 1x, 1.5x

  // Modals
  const [lightboxImage, setLightboxImage] = useState<FrepeImageItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadTag, setUploadTag] = useState<string>("#FREPE MEME");
  const [uploadCaption, setUploadCaption] = useState<string>("");
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [uploadTrack, setUploadTrack] = useState<"forward" | "backward" | "both">("both");
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom images from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.forward && Array.isArray(parsed.forward)) {
          setForwardImages(parsed.forward);
        }
        if (parsed.backward && Array.isArray(parsed.backward)) {
          setBackwardImages(parsed.backward);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (fwd: FrepeImageItem[], bwd: FrepeImageItem[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          forward: fwd,
          backward: bwd,
        })
      );
    } catch {
      // storage quota or private mode fallback
    }
  };

  // Handle local file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP, GIF).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setPreviewDataUrl(res);
      setUploadUrl("");
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, "").toUpperCase());
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit custom FREPE image
  const handleAddFrepeImage = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageSrc = previewDataUrl || uploadUrl.trim();
    if (!finalImageSrc) {
      alert("Please provide an image by uploading a file or entering an image URL.");
      return;
    }

    const newItem: FrepeImageItem = {
      id: `custom-frepe-${Date.now()}`,
      title: uploadTitle.trim() || "COMMUNITY FREPE MEME",
      tag: uploadTag.trim() || "#FREPE GAINS",
      caption: uploadCaption.trim() || "Custom community Frepe added to the live marquee.",
      imageUrl: finalImageSrc,
      isCustom: true,
    };

    let newFwd = [...forwardImages];
    let newBwd = [...backwardImages];

    if (uploadTrack === "forward" || uploadTrack === "both") {
      newFwd = [newItem, ...newFwd];
    }
    if (uploadTrack === "backward" || uploadTrack === "both") {
      newBwd = [newItem, ...newBwd];
    }

    setForwardImages(newFwd);
    setBackwardImages(newBwd);
    saveToStorage(newFwd, newBwd);

    sound.playCashout();

    // Reset & close
    setUploadTitle("");
    setUploadTag("#FREPE MEME");
    setUploadCaption("");
    setUploadUrl("");
    setPreviewDataUrl(null);
    setIsUploadModalOpen(false);
  };

  // Remove a custom image
  const handleDeleteImage = (id: string) => {
    const newFwd = forwardImages.filter((img) => img.id !== id);
    const newBwd = backwardImages.filter((img) => img.id !== id);
    setForwardImages(newFwd);
    setBackwardImages(newBwd);
    saveToStorage(newFwd, newBwd);
    if (lightboxImage?.id === id) {
      setLightboxImage(null);
    }
  };

  // Reset to default gallery
  const handleResetDefaults = () => {
    setForwardImages(DEFAULT_FORWARD_IMAGES);
    setBackwardImages(DEFAULT_BACKWARD_IMAGES);
    localStorage.removeItem(STORAGE_KEY);
    sound.playBoost();
  };

  // Calculate animation duration based on speed
  const baseForwardDuration = 26 / speedMultiplier;
  const baseBackwardDuration = 26 / speedMultiplier;

  // Duplicate items for continuous seamless loop (x4 to make wide track)
  const duplicatedForward = [
    ...forwardImages,
    ...forwardImages,
    ...forwardImages,
    ...forwardImages,
  ];
  const duplicatedBackward = [
    ...backwardImages,
    ...backwardImages,
    ...backwardImages,
    ...backwardImages,
  ];

  return (
    <section
      id="frepe-gallery-marquee"
      className="w-full py-8 sm:py-12 relative overflow-hidden bg-[#060e20] border-y-4 border-black"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#facc15]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#4ae176]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Header Container */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-8 mb-5 sm:mb-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
              <span className="font-mono-code text-[10px] sm:text-xs bg-[#facc15] text-[#3c2f00] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded font-black uppercase tracking-wider inline-flex items-center gap-1.5 -rotate-1 shadow-sm">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                THE FREPE MEME VAULT
              </span>
              <span className="font-mono-code text-[11px] sm:text-xs text-[#4ae176] font-bold">
                • COMMUNITY POWERED
              </span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-5xl uppercase text-[#ffecb9] font-black tracking-tight">
              FREPE MEME SHOWCASE
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-[#d1c6ab] max-w-xl font-body mt-1">
              Top track glides <strong>forward</strong>, bottom track glides <strong>backward</strong>.
              Hover over any artwork to pause, tap or click to inspect in full resolution, or upload your own
              FREPE creations directly into the live display!
            </p>
          </div>

          {/* Interactive Action Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Speed Toggle */}
            <div className="bg-[#131b2e] p-1 rounded-xl border-2 border-[#2d3449] flex items-center gap-1 shadow-[2px_2px_0px_#000000]">
              <button
                onClick={() => setSpeedMultiplier(0.6)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                  speedMultiplier === 0.6
                    ? "bg-[#2d3449] text-[#facc15]"
                    : "text-[#9a9078] hover:text-[#dae2fd]"
                }`}
                title="Slow speed"
              >
                0.5x
              </button>
              <button
                onClick={() => setSpeedMultiplier(1)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                  speedMultiplier === 1
                    ? "bg-[#2d3449] text-[#facc15]"
                    : "text-[#9a9078] hover:text-[#dae2fd]"
                }`}
                title="Normal speed"
              >
                1x
              </button>
              <button
                onClick={() => setSpeedMultiplier(1.8)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                  speedMultiplier === 1.8
                    ? "bg-[#2d3449] text-[#facc15]"
                    : "text-[#9a9078] hover:text-[#dae2fd]"
                }`}
                title="High-velocity speed"
              >
                2x
              </button>
            </div>

            {/* Play/Pause Button */}
            <button
              id="frepe-marquee-toggle-pause"
              onClick={() => {
                setIsPaused(!isPaused);
                sound.playBoost();
              }}
              className="neo-brutal-btn bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-mono-code text-[11px] sm:text-xs uppercase flex items-center gap-1.5 font-bold cursor-pointer"
              title={isPaused ? "Resume Marquee Animation" : "Pause Marquee Animation"}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#4ae176]" />
                  <span>PLAY</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>PAUSE</span>
                </>
              )}
            </button>

            {/* Upload Frepe Image Button */}
            <button
              id="upload-frepe-image-btn"
              onClick={() => {
                setIsUploadModalOpen(true);
                sound.playBoost();
              }}
              className="neo-brutal-btn bg-[#facc15] hover:bg-[#ffecb9] text-[#3c2f00] font-headline text-[11px] sm:text-xs uppercase px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 font-black cursor-pointer shadow-[3px_3px_0px_#000000]"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>SHOW MY FREPE 🍟</span>
            </button>
          </div>
        </div>
      </div>

      {/* TRACK 1: FORWARD MARQUEE (Moves Leftward) */}
      <div className="w-full relative mb-4 sm:mb-6">
        <div className="flex items-center gap-2 px-3 sm:px-4 lg:px-8 max-w-[1280px] mx-auto mb-1.5 sm:mb-2 font-mono-code text-[10px] sm:text-xs text-[#facc15] font-bold uppercase tracking-wider">
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#facc15] animate-pulse" />
          <span>🔥 CRISPY MEMES INCOMING</span>
          <span className="text-[#9a9078] text-[9px] sm:text-[10px] hidden xs:inline">• HOVER TO PAUSE</span>
        </div>

        <div className="relative w-full overflow-hidden py-1 sm:py-2 bg-gradient-to-r from-black/40 via-transparent to-black/40">
          <div
            className="animate-marquee-forward marquee-pause-hover flex items-center gap-3 sm:gap-4 md:gap-5 whitespace-nowrap will-change-transform"
            style={{
              animationDuration: `${baseForwardDuration}s`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicatedForward.map((item, index) => (
              <div
                key={`fwd-${item.id}-${index}`}
                onClick={() => {
                  setLightboxImage(item);
                  sound.playBoost();
                }}
                className="group w-44 xs:w-48 sm:w-56 md:w-60 lg:w-64 shrink-0 bg-[#131b2e] rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black p-2 sm:p-2.5 md:p-3 shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] hover:border-[#facc15] hover:shadow-[5px_5px_0px_#000000] transition-all cursor-pointer select-none"
              >
                {/* Artwork Thumbnail Frame */}
                <div className="relative w-full aspect-square bg-[#0b1326] rounded-lg sm:rounded-xl overflow-hidden border border-black mb-1.5 sm:mb-2">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-black/85 text-[#facc15] font-mono-code text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded border border-black uppercase truncate max-w-[85%]">
                    {item.tag}
                  </div>
                  <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-black/75 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#facc15]" />
                  </div>
                  {item.isCustom && (
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-[#4ae176] text-[#002109] font-mono-code text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded border border-black uppercase">
                      USER
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-headline text-xs sm:text-sm text-[#ffecb9] uppercase font-black truncate group-hover:text-[#facc15] transition-colors">
                    {item.title}
                  </h4>
                  <p className="font-body text-[10px] sm:text-[11px] text-[#d1c6ab] line-clamp-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRACK 2: BACKWARD MARQUEE (Moves Rightward) */}
      <div className="w-full relative">
        <div className="flex items-center justify-end gap-2 px-3 sm:px-4 lg:px-8 max-w-[1280px] mx-auto mb-1.5 sm:mb-2 font-mono-code text-[10px] sm:text-xs text-[#4ae176] font-bold uppercase tracking-wider">
          <span className="text-[#9a9078] text-[9px] sm:text-[10px] hidden xs:inline">HOVER TO PAUSE •</span>
          <span>🍟 MORE FREPE. MORE CHAOS.</span>
          <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4ae176] animate-pulse" />
        </div>

        <div className="relative w-full overflow-hidden py-1 sm:py-2 bg-gradient-to-r from-black/40 via-transparent to-black/40">
          <div
            className="animate-marquee-backward marquee-pause-hover flex items-center gap-3 sm:gap-4 md:gap-5 whitespace-nowrap will-change-transform"
            style={{
              animationDuration: `${baseBackwardDuration}s`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicatedBackward.map((item, index) => (
              <div
                key={`bwd-${item.id}-${index}`}
                onClick={() => {
                  setLightboxImage(item);
                  sound.playBoost();
                }}
                className="group w-44 xs:w-48 sm:w-56 md:w-60 lg:w-64 shrink-0 bg-[#131b2e] rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black p-2 sm:p-2.5 md:p-3 shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] hover:border-[#4ae176] hover:shadow-[5px_5px_0px_#000000] transition-all cursor-pointer select-none"
              >
                {/* Artwork Thumbnail Frame */}
                <div className="relative w-full aspect-square bg-[#0b1326] rounded-lg sm:rounded-xl overflow-hidden border border-black mb-1.5 sm:mb-2">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-black/85 text-[#4ae176] font-mono-code text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded border border-black uppercase truncate max-w-[85%]">
                    {item.tag}
                  </div>
                  <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-black/75 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4ae176]" />
                  </div>
                  {item.isCustom && (
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-[#4ae176] text-[#002109] font-mono-code text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded border border-black uppercase">
                      USER
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-headline text-xs sm:text-sm text-[#ffecb9] uppercase font-black truncate group-hover:text-[#4ae176] transition-colors">
                    {item.title}
                  </h4>
                  <p className="font-body text-[10px] sm:text-[11px] text-[#d1c6ab] line-clamp-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar with Reset & Status */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-8 mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono-code text-[#9a9078] text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ae176] animate-pulse" />
          <span>SHOWCASING {forwardImages.length + backwardImages.length} CRISPY FREPE ARTWORKS</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleResetDefaults}
            className="hover:text-[#facc15] underline cursor-pointer"
          >
            Reset to Default Frepe Gallery
          </button>
        </div>
      </div>

      {/* FULL LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          id="frepe-lightbox-overlay"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            id="frepe-lightbox-card"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131b2e] border-3 sm:border-4 border-black rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-[#060e20] border-b-2 border-[#2d3449] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">🍟</span>
                <div>
                  <h3 className="font-headline text-base sm:text-lg text-[#ffecb9] uppercase font-black">
                    {lightboxImage.title}
                  </h3>
                  <span className="font-mono-code text-[10px] sm:text-[11px] text-[#facc15] font-bold">
                    {lightboxImage.tag}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 sm:p-1.5 rounded-lg bg-[#222a3d] hover:bg-[#93000a] text-[#dae2fd] border border-[#2d3449] cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* High-res Image Preview */}
            <div className="relative w-full max-h-[48vh] sm:max-h-[55vh] bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="max-h-[44vh] sm:max-h-[50vh] max-w-full object-contain rounded-lg sm:rounded-xl border border-[#2d3449] shadow-2xl"
              />
            </div>

            {/* Details & Actions Footer */}
            <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0b1326] border-t-2 border-[#2d3449]">
              <p className="font-body text-xs sm:text-sm text-[#d1c6ab] max-w-md">
                {lightboxImage.caption}
              </p>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                {/* Download Button */}
                <a
                  href={lightboxImage.imageUrl}
                  download={`${lightboxImage.title.toLowerCase().replace(/\s+/g, "_")}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-brutal-btn bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-mono-code text-[11px] sm:text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                  title="Download Image"
                >
                  <Download className="w-3.5 h-3.5 text-[#4ae176]" />
                  <span>Download</span>
                </a>

                {/* Copy URL */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lightboxImage.imageUrl);
                    setCopiedLink(true);
                    sound.playBoost();
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="neo-brutal-btn bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-mono-code text-[11px] sm:text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#4ae176]" />
                      <span className="text-[#4ae176]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY LINK</span>
                    </>
                  )}
                </button>

                {/* Delete button if user added */}
                {lightboxImage.isCustom && (
                  <button
                    onClick={() => handleDeleteImage(lightboxImage.id)}
                    className="neo-brutal-btn bg-[#93000a] text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl font-mono-code text-[11px] sm:text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                    title="Remove from my marquee"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>REMOVE</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / ADD YOUR FREPE MODAL */}
      {isUploadModalOpen && (
        <div
          id="upload-frepe-overlay"
          onClick={() => setIsUploadModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            id="upload-frepe-card"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131b2e] border-3 sm:border-4 border-black rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-3 sm:p-4 bg-[#060e20] border-b-2 border-[#2d3449] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#facc15] text-[#3c2f00] flex items-center justify-center font-black border border-black -rotate-3 text-base sm:text-lg">
                  🍟
                </div>
                <div>
                  <h3 className="font-headline text-base sm:text-lg text-[#ffecb9] uppercase font-black">
                    ADD YOUR FREPE IMAGE
                  </h3>
                  <span className="font-mono-code text-[9px] sm:text-[10px] text-[#4ae176] font-bold">
                    ADD YOUR MEME TO THE FREPE VAULT
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 sm:p-1.5 rounded-lg bg-[#222a3d] hover:bg-[#93000a] text-[#dae2fd] border border-[#2d3449] cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddFrepeImage} className="p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-4">
              {/* File Upload Zone */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono-code text-[#ffecb9] font-bold uppercase mb-1.5">
                  1. UPLOAD IMAGE FILE OR PASTE DIRECT LINK
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#facc15]/60 hover:border-[#facc15] bg-[#060e20] rounded-xl p-3.5 sm:p-4 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors group"
                >
                  {previewDataUrl ? (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border-2 border-[#4ae176]">
                      <img
                        src={previewDataUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-mono-code text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        CHANGE
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#facc15]/20 text-[#facc15] flex items-center justify-center">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="font-mono-code text-[11px] sm:text-xs text-[#dae2fd] font-bold">
                        Click to select image from your device
                      </span>
                      <span className="font-mono-code text-[9px] sm:text-[10px] text-[#9a9078]">
                        PNG, JPG, WEBP, or GIF supported
                      </span>
                    </>
                  )}
                </div>

                {/* Alternative URL Input */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] sm:text-[10px] font-mono-code text-[#9a9078] uppercase shrink-0">
                    OR URL:
                  </span>
                  <input
                    type="url"
                    value={uploadUrl}
                    onChange={(e) => {
                      setUploadUrl(e.target.value);
                      if (e.target.value) setPreviewDataUrl(null);
                    }}
                    placeholder="https://... image link"
                    className="w-full bg-[#060e20] border border-[#2d3449] rounded-lg px-2.5 py-1.5 text-xs font-mono-code text-[#dae2fd] outline-none focus:border-[#facc15]"
                  />
                </div>
              </div>

              {/* Title & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-mono-code text-[#ffecb9] font-bold uppercase mb-1">
                    FREPE TITLE
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. MOON BAG FREPE"
                    required
                    className="w-full bg-[#060e20] border border-[#2d3449] rounded-lg px-3 py-1.5 sm:py-2 text-xs font-mono-code text-[#dae2fd] outline-none focus:border-[#facc15]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-mono-code text-[#ffecb9] font-bold uppercase mb-1">
                    BADGE TAG
                  </label>
                  <input
                    type="text"
                    value={uploadTag}
                    onChange={(e) => setUploadTag(e.target.value)}
                    placeholder="e.g. #TOP FRY GAINS"
                    className="w-full bg-[#060e20] border border-[#2d3449] rounded-lg px-3 py-1.5 sm:py-2 text-xs font-mono-code text-[#dae2fd] outline-none focus:border-[#facc15]"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono-code text-[#ffecb9] font-bold uppercase mb-1">
                  CAPTION / DESCRIPTION
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Short fun lore about this Frepe variant"
                  className="w-full bg-[#060e20] border border-[#2d3449] rounded-lg px-3 py-1.5 sm:py-2 text-xs font-mono-code text-[#dae2fd] outline-none focus:border-[#facc15]"
                />
              </div>

              {/* Marquee Placement Selector */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono-code text-[#ffecb9] font-bold uppercase mb-1.5">
                  SHOW IN MARQUEE
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadTrack("both")}
                    className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg font-mono-code text-[10px] sm:text-xs font-bold uppercase border cursor-pointer ${
                      uploadTrack === "both"
                        ? "bg-[#facc15] text-[#3c2f00] border-black shadow-[2px_2px_0px_#000000]"
                        : "bg-[#060e20] text-[#9a9078] border-[#2d3449]"
                    }`}
                  >
                    Both Tracks
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadTrack("forward")}
                    className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg font-mono-code text-[10px] sm:text-xs font-bold uppercase border cursor-pointer ${
                      uploadTrack === "forward"
                        ? "bg-[#facc15] text-[#3c2f00] border-black shadow-[2px_2px_0px_#000000]"
                        : "bg-[#060e20] text-[#9a9078] border-[#2d3449]"
                    }`}
                  >
                    Forward Track
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadTrack("backward")}
                    className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg font-mono-code text-[10px] sm:text-xs font-bold uppercase border cursor-pointer ${
                      uploadTrack === "backward"
                        ? "bg-[#4ae176] text-[#002109] border-black shadow-[2px_2px_0px_#000000]"
                        : "bg-[#060e20] text-[#9a9078] border-[#2d3449]"
                    }`}
                  >
                    Backward Track
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="submit-frepe-image-action-btn"
                className="w-full mt-1 sm:mt-2 neo-brutal-btn bg-[#facc15] text-[#3c2f00] font-headline text-sm sm:text-base uppercase py-2.5 sm:py-3 rounded-xl border-2 border-black font-black flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000]"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#93000a]" />
                <span>DROP IT IN THE VAULT 🍟</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
