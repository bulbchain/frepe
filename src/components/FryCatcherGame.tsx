import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { Fighter, LeaderboardEntry } from "../types";
import { sound } from "../audio";
import { drawGentlemanPepe } from "../utils/drawGentlemanPepe";
import { Rocket, Zap, PiggyBank, RefreshCw, Trophy, ShieldAlert, Award } from "lucide-react";

interface FryCatcherGameProps {
  selectedFighter: Fighter;
  onOpenLeaderboard: () => void;
  activeDuelWager?: number;
  duelOpponent?: string;
  onDuelFinish?: (score: number) => void;
}

interface Item {
  x: number;
  y: number;
  type: "fry" | "mega" | "butter" | "salt" | "puddle" | "dumpBot";
  speedY: number;
  speedX: number;
  size: number;
  points: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const FryCatcherGame: React.FC<FryCatcherGameProps> = ({
  selectedFighter,
  onOpenLeaderboard,
  activeDuelWager = 0,
  duelOpponent,
  onDuelFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [cashedOut, setCashedOut] = useState<boolean>(false);

  // Live telemetry metrics
  const [score, setScore] = useState<number>(0);
  const [friesCaught, setFriesCaught] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [heatVelocity, setHeatVelocity] = useState<number>(380);
  const [health, setHealth] = useState<number>(100);
  const [combo, setCombo] = useState<number>(0);
  const [boostActive, setBoostActive] = useState<boolean>(false);
  const [boostCharges, setBoostCharges] = useState<number>(2);
  const [shieldActive, setShieldActive] = useState<boolean>(selectedFighter.hasShield);

  // Submission state
  const [playerName, setPlayerName] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Internal game engine references
  const playerRef = useRef({
    x: 250,
    y: 200,
    width: 64,
    height: 70,
    vx: 0,
    speed: 7,
    frame: 0,
  });

  const botRef = useRef({
    x: 120,
    y: 190,
    fries: 0,
    speed: 3.5,
  });

  const itemsRef = useRef<Item[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const animationFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  // Multiplier scaling & stats refs
  const scoreRef = useRef(0);
  const friesRef = useRef(0);
  const multRef = useRef(1.0);
  const comboRef = useRef(0);
  const healthRef = useRef(100);
  const isPlayingRef = useRef(false);

  // Sync state with refs
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    friesRef.current = friesCaught;
  }, [friesCaught]);
  useEffect(() => {
    multRef.current = multiplier;
  }, [multiplier]);
  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);
  useEffect(() => {
    healthRef.current = health;
  }, [health]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Handle fighter perks change
  useEffect(() => {
    setShieldActive(selectedFighter.hasShield);
  }, [selectedFighter]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true;
      }
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        triggerBoost();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [boostCharges, isPlaying]);

  // Add particles
  const addParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 0,
        maxLife: 20 + Math.random() * 15,
        color,
        size: Math.random() * 4 + 2,
      });
    }
  };

  // Start / Reset game
  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setCashedOut(false);
    setSubmitted(false);
    setScore(0);
    setFriesCaught(0);
    setMultiplier(1.0 + selectedFighter.multiplierBonus);
    setHeatVelocity(380);
    setHealth(100);
    setCombo(0);
    setBoostCharges(3);
    setBoostActive(false);
    setShieldActive(selectedFighter.hasShield);

    scoreRef.current = 0;
    friesRef.current = 0;
    multRef.current = 1.0 + selectedFighter.multiplierBonus;
    comboRef.current = 0;
    healthRef.current = 100;
    isPlayingRef.current = true;

    itemsRef.current = [];
    particlesRef.current = [];
    playerRef.current.x = (canvasRef.current?.width || 600) / 2 - 32;
    botRef.current.x = 100;
    botRef.current.fries = 0;

    sound.playBoost();
  };

  // Boost butter action
  const triggerBoost = () => {
    if (boostCharges <= 0 || !isPlayingRef.current || boostActive) return;
    setBoostCharges((prev) => prev - 1);
    setBoostActive(true);
    sound.playBoost();
    addParticles(playerRef.current.x + 32, playerRef.current.y + 40, "#facc15", 25);

    setTimeout(() => {
      setBoostActive(false);
    }, 4500);
  };

  // Cashout action
  const triggerCashout = () => {
    if (!isPlayingRef.current || isGameOver) return;
    setIsPlaying(false);
    setCashedOut(true);
    sound.playCashout();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#facc15", "#4ae176", "#ffecb9"],
    });

    if (onDuelFinish) {
      onDuelFinish(scoreRef.current);
    }
  };

  // End game
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    sound.playHit();
    if (onDuelFinish) {
      onDuelFinish(scoreRef.current);
    }
  }, [onDuelFinish]);

  // Submit high score to backend API
  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player: playerName.trim(),
          fighter: selectedFighter.name,
          title: selectedFighter.tier + " Cook",
          score: scoreRef.current,
          multiplier: multRef.current,
          friesCaught: friesRef.current,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#facc15", "#4ae176", "#00b954"],
        });
        setTimeout(() => {
          onOpenLeaderboard();
        }, 1200);
      }
    } catch (err) {
      console.error("Score submission error:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Main Canvas Render & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 360);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // 1. Clear background
      ctx.fillStyle = "#060e20";
      ctx.fillRect(0, 0, width, height);

      // 2. Draw animated laser grid
      ctx.strokeStyle = "rgba(77, 70, 50, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Draw Upward Crypto Bull Trendline
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.9);
      ctx.quadraticCurveTo(width * 0.3, height * 0.8, width * 0.6, height * 0.55);
      ctx.quadraticCurveTo(width * 0.8, height * 0.4, width, height * 0.15);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // If playing, update game logic
      if (isPlayingRef.current) {
        // Player movement
        const baseSpeed =
          (playerRef.current.speed + selectedFighter.speedBonus * 4) * (boostActive ? 1.6 : 1.0);
        if (keysRef.current.left) {
          playerRef.current.vx = -baseSpeed;
        } else if (keysRef.current.right) {
          playerRef.current.vx = baseSpeed;
        } else {
          playerRef.current.vx *= 0.8;
        }
        playerRef.current.x += playerRef.current.vx;

        // Bound player in canvas
        if (playerRef.current.x < 10) playerRef.current.x = 10;
        if (playerRef.current.x > width - playerRef.current.width - 10) {
          playerRef.current.x = width - playerRef.current.width - 10;
        }
        playerRef.current.y = height - 85;

        // Rival bot AI movement along track
        botRef.current.x += botRef.current.speed;
        if (botRef.current.x > width - 80 || botRef.current.x < 20) {
          botRef.current.speed *= -1;
        }
        botRef.current.y = height - 70;

        // Heat velocity increase
        setHeatVelocity((prev) => Math.min(500, Math.floor(380 + multRef.current * 8)));

        // Item Spawning
        if (currentTime - lastSpawnRef.current > (boostActive ? 280 : 450)) {
          lastSpawnRef.current = currentTime;
          const rand = Math.random();
          let type: Item["type"] = "fry";
          let points = 100;
          let size = 26;

          const jackpotRoll = selectedFighter.jackpotChance;

          if (rand < 0.55) {
            type = "fry";
            points = 100;
          } else if (rand < 0.7 + jackpotRoll) {
            type = "mega";
            points = 350;
            size = 32;
          } else if (rand < 0.8) {
            type = "butter";
            points = 200;
            size = 28;
          } else if (rand < 0.87) {
            type = "salt";
            points = 150;
            size = 26;
          } else {
            type = rand > 0.93 ? "dumpBot" : "puddle";
            points = 0;
            size = 30;
          }

          itemsRef.current.push({
            x: Math.random() * (width - 60) + 30,
            y: -30,
            type,
            speedY: Math.random() * 2.5 + 3.0 + (boostActive ? 2.5 : 0),
            speedX: (Math.random() - 0.5) * 1.5,
            size,
            points,
          });
        }

        // Update items
        for (let i = itemsRef.current.length - 1; i >= 0; i--) {
          const item = itemsRef.current[i];
          item.y += item.speedY;
          item.x += item.speedX;

          // Draw item
          ctx.save();
          ctx.font = `${item.size}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          let emoji = "🍟";
          if (item.type === "mega") emoji = "🍟✨";
          else if (item.type === "butter") emoji = "🧈";
          else if (item.type === "salt") emoji = "🧂";
          else if (item.type === "puddle") emoji = "💦";
          else if (item.type === "dumpBot") emoji = "🤖";

          // Glow for powerups
          if (item.type === "mega" || item.type === "fry") {
            ctx.shadowColor = "#facc15";
            ctx.shadowBlur = 10;
          } else if (item.type === "puddle" || item.type === "dumpBot") {
            ctx.shadowColor = "#ff5252";
            ctx.shadowBlur = 12;
          }

          ctx.fillText(emoji, item.x, item.y);
          ctx.restore();

          // Collision detection with player
          const px = playerRef.current.x + playerRef.current.width / 2;
          const py = playerRef.current.y + playerRef.current.height / 2;
          const dist = Math.hypot(item.x - px, item.y - py);

          if (dist < 38) {
            // Caught item
            if (item.type === "fry" || item.type === "mega") {
              const basePts = item.points;
              const earned = Math.round(basePts * multRef.current);
              setScore((s) => s + earned);
              setFriesCaught((f) => f + (item.type === "mega" ? 5 : 1));
              setCombo((c) => {
                const nextCombo = c + 1;
                // Multiplier climbs every 4 fries
                if (nextCombo % 4 === 0) {
                  setMultiplier((m) => Number((m + 0.15).toFixed(2)));
                }
                return nextCombo;
              });

              if (item.type === "mega") {
                sound.playJackpot();
                addParticles(item.x, item.y, "#facc15", 20);
              } else {
                sound.playFryCatch();
                addParticles(item.x, item.y, "#ffecb9", 8);
              }
            } else if (item.type === "butter") {
              sound.playBoost();
              setBoostCharges((prev) => Math.min(5, prev + 1));
              setMultiplier((m) => Number((m + 0.35).toFixed(2)));
              addParticles(item.x, item.y, "#facc15", 15);
            } else if (item.type === "salt") {
              sound.playFryCatch();
              setHealth((h) => Math.min(100, h + 25));
              setShieldActive(true);
              addParticles(item.x, item.y, "#ffffff", 14);
            } else if (item.type === "puddle" || item.type === "dumpBot") {
              // Hit hazard
              if (shieldActive) {
                // Shield absorbs hit
                setShieldActive(false);
                sound.playBoost();
                addParticles(playerRef.current.x + 32, playerRef.current.y + 35, "#4ae176", 20);
              } else {
                sound.playHit();
                addParticles(item.x, item.y, "#ff5252", 20);
                setCombo(0);
                setMultiplier((m) => Math.max(1.0, Number((m * 0.75).toFixed(2))));
                setHealth((h) => {
                  const nextH = h - 35;
                  if (nextH <= 0) {
                    endGame();
                    return 0;
                  }
                  return nextH;
                });
              }
            }

            itemsRef.current.splice(i, 1);
            continue;
          }

          // Remove off-screen items
          if (item.y > height + 40) {
            itemsRef.current.splice(i, 1);
          }
        }
      }

      // 5. Draw Rival Bot Runner (Ghost on track)
      ctx.save();
      ctx.font = "24px serif";
      ctx.textAlign = "center";
      ctx.fillText("🤖", botRef.current.x, botRef.current.y + 12);
      ctx.fillStyle = "#9a9078";
      ctx.font = "bold 10px 'Space Mono', monospace";
      ctx.fillText(duelOpponent || "Bot_0xSoggy", botRef.current.x, botRef.current.y - 14);
      ctx.restore();

      // 6. Draw Player Character: PEPE WITH FRIES ON THE HEAD IN EXECUTIVE SUIT
      const px = playerRef.current.x;
      const py = playerRef.current.y;

      ctx.save();
      // Shield Aura
      if (shieldActive) {
        ctx.strokeStyle = "#4ae176";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#4ae176";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(px + 32, py + 32, 40, 42, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Boost Aura
      if (boostActive) {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.ellipse(px + 32, py + 32, 44, 46, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update animation frame
      playerRef.current.frame += (keysRef.current.left || keysRef.current.right) ? 0.25 : 0.08;

      // Draw Gentleman Pepe Mascot with Top Hat, Fries, Glasses, Tuxedo, Moving Hands & Legs with Toes!
      drawGentlemanPepe({
        ctx,
        x: px + (playerRef.current.width - 52) / 2,
        y: py,
        width: 52,
        height: playerRef.current.height,
        runFrame: playerRef.current.frame,
        isMoving: keysRef.current.left || keysRef.current.right,
        direction: keysRef.current.left ? -1 : 1,
        suitColor: selectedFighter.suitColor || "#111624",
        boostActive,
        shieldActive,
        mode: "catch",
      });

      // Character Player Name Tag & Multiplier Pill
      ctx.fillStyle = "#facc15";
      ctx.font = "bold 10px 'Space Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        `YOU (${multRef.current.toFixed(2)}x)`,
        px + 32,
        py - (boostActive ? 30 : 25)
      );

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedFighter, boostActive, shieldActive, endGame, duelOpponent]);

  // Touch drag controls for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPlayingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clientX = touch.clientX - rect.left;
    playerRef.current.x = Math.max(
      10,
      Math.min(canvasRef.current.width - 70, clientX - playerRef.current.width / 2)
    );
  };

  return (
    <div
      id="fry-catcher-royale-container"
      className="bg-[#131b2e] rounded-2xl border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0px_#000000] relative overflow-hidden flex flex-col"
    >
      {/* Game Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#2d3449] pb-3 mb-3 bg-[#060e20]/80 p-3 rounded-xl border border-[#222a3d]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#4ae176] animate-ping" />
          <span className="font-headline text-sm sm:text-base text-[#ffecb9] uppercase font-bold">
            CRUNCH RUNWAY // LOBBY #0420
          </span>
          <span
            className={`text-[10px] font-mono-code uppercase px-2 py-0.5 rounded font-bold ${
              isPlaying ? "bg-[#93000a] text-[#ffdad6]" : "bg-[#222a3d] text-[#facc15]"
            }`}
          >
            {isPlaying ? "ROUND ACTIVE" : "READY TO CRUNCH"}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono-code text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-[#facc15] bg-[#171f33] px-2.5 py-1 rounded border border-[#2d3449]">
            <span>MULTIPLIER:</span>
            <span id="liveMult" className="text-base font-black animate-pulse">
              {multiplier.toFixed(2)}x
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#4ae176] bg-[#171f33] px-2.5 py-1 rounded border border-[#2d3449]">
            <span>POT:</span>
            <span className="font-bold">
              {activeDuelWager > 0 ? `${(activeDuelWager * 2).toFixed(1)} SOL` : "12.5 SOL"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Stage Canvas Area */}
      <div
        id="fry-game-canvas-wrapper"
        onTouchMove={handleTouchMove}
        className="relative w-full h-80 sm:h-96 rounded-xl bg-[#060e20] border-2 border-[#222a3d] overflow-hidden flex flex-col justify-between p-3 select-none"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Top Floating Telemetry Overlay */}
        <div className="relative z-20 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1 bg-[#171f33]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2d3449]">
            <span className="font-mono-code text-[10px] text-[#9a9078] uppercase">
              Fries Collected
            </span>
            <span className="font-headline text-lg sm:text-xl text-[#facc15] font-black tabular-nums">
              🍟 {friesCaught.toLocaleString()}
            </span>
          </div>

          {/* Health & Butter Gauge */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1 bg-[#171f33]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2d3449] text-right">
              <span className="font-mono-code text-[10px] text-[#9a9078] uppercase">
                Saltiness Health
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-2.5 bg-[#0b1326] rounded-full overflow-hidden border border-[#2d3449]">
                  <div
                    className="h-full bg-[#4ae176] transition-all"
                    style={{ width: `${health}%` }}
                  />
                </div>
                <span className="font-mono-code text-xs font-bold text-[#4ae176]">{health}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 bg-[#171f33]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2d3449] text-right">
              <span className="font-mono-code text-[10px] text-[#9a9078] uppercase">
                Fry Heat Velocity
              </span>
              <span className="font-headline text-base sm:text-lg text-[#4ae176] font-black">
                {heatVelocity}°F 🔥
              </span>
            </div>
          </div>
        </div>

        {/* Hazard warning zone pill */}
        <div className="absolute bottom-16 right-4 sm:right-1/3 bg-[#93000a]/80 text-[#ffdad6] border border-[#ffb4ab] px-2 py-0.5 rounded text-[10px] font-mono-code flex items-center gap-1 uppercase pointer-events-none z-10">
          <span>⚠️</span> SOGGY BOT DUMP ZONE
        </div>

        {/* Bottom Telemetry Flight Deck */}
        <div className="relative z-20 flex justify-between items-end text-[#9a9078] font-mono-code text-[10px] sm:text-xs pointer-events-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4ae176] animate-pulse" />
            STATUS: ASCENDING TO THE DEEP FRYER MOON
          </span>
          <span className="text-[#facc15] font-bold uppercase tracking-wider">
            FIGHTER: {selectedFighter.name}
          </span>
        </div>

        {/* Start Overlay if not playing */}
        {!isPlaying && !isGameOver && !cashedOut && (
          <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#facc15] text-[#3c2f00] text-3xl font-headline flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_#000000] -rotate-3 mb-3 animate-bounce">
              🍟
            </div>
            <h3 className="font-headline text-2xl sm:text-3xl uppercase text-[#ffecb9] font-black tracking-tight mb-2">
              FRY CATCHER ROYALE
            </h3>
            <p className="text-sm text-[#d1c6ab] max-w-md mb-5 font-body">
              Move Pepe to catch falling crispy golden fries & butter boosts. Dodge red soggy dump
              puddles and cash out your gains before getting rekt!
            </p>
            <button
              id="game-overlay-start-btn"
              onClick={startGame}
              className="neo-brutal-btn bg-[#facc15] hover:bg-[#ffecb9] text-[#3c2f00] font-headline text-lg sm:text-xl uppercase px-8 py-3.5 rounded-xl flex items-center gap-2 font-black cursor-pointer"
            >
              <Rocket className="w-6 h-6" />
              <span>START RUN</span>
            </button>
            <span className="text-xs font-mono-code text-[#9a9078] mt-3">
              Desktop: Arrow Keys / A-D • Space: Butter Boost • Mobile: Touch Drag
            </span>
          </div>
        )}

        {/* Game Over Modal */}
        {isGameOver && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#93000a] text-[#ffdad6] text-3xl flex items-center justify-center border-2 border-black mb-2 animate-pulse">
              💥
            </div>
            <h3 className="font-headline text-2xl sm:text-3xl uppercase text-[#ffb4ab] font-black tracking-tight">
              REKT BY SOGGY DUMP!
            </h3>
            <p className="text-xs sm:text-sm text-[#d1c6ab] mb-3">
              You caught {friesCaught} fries and scored {score.toLocaleString()} points!
            </p>

            {/* Score submission form */}
            {!submitted ? (
              <form onSubmit={handleSubmitScore} className="w-full max-w-sm flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter Chef Tag (e.g. DegenFryer)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={18}
                  className="w-full bg-[#131b2e] border-2 border-[#facc15] text-[#ffecb9] px-3 py-2 rounded-lg font-mono-code text-sm outline-none text-center font-bold"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="neo-brutal-btn bg-[#facc15] text-[#3c2f00] font-headline uppercase py-2.5 rounded-lg font-black text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{submitting ? "SUBMITTING..." : "SUBMIT TO GLOBAL LEADERBOARD"}</span>
                </button>
              </form>
            ) : (
              <div className="text-sm font-mono-code text-[#4ae176] font-bold py-2">
                ✅ SCORE POSTED TO GLOBAL LEADERBOARD!
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={startGame}
                className="neo-brutal-btn bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] px-4 py-2 rounded-lg font-headline uppercase text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>
              <button
                onClick={onOpenLeaderboard}
                className="neo-brutal-btn bg-[#facc15] text-[#3c2f00] px-4 py-2 rounded-lg font-headline uppercase text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>LEADERBOARD</span>
              </button>
            </div>
          </div>
        )}

        {/* Cashout Modal */}
        {cashedOut && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#00b954] text-3xl flex items-center justify-center border-2 border-black mb-2 animate-bounce">
              💰
            </div>
            <h3 className="font-headline text-2xl sm:text-3xl uppercase text-[#4ae176] font-black tracking-tight">
              CASHOUT SECURED!
            </h3>
            <p className="text-sm text-[#ffecb9] font-mono-code mb-2">
              Multiplier: {multiplier.toFixed(2)}x • Fries: {friesCaught} • Score:{" "}
              {score.toLocaleString()}
            </p>

            {/* Score submission form */}
            {!submitted ? (
              <form onSubmit={handleSubmitScore} className="w-full max-w-sm flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter Chef Tag (e.g. DiamondCook)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={18}
                  className="w-full bg-[#131b2e] border-2 border-[#4ae176] text-[#ffecb9] px-3 py-2 rounded-lg font-mono-code text-sm outline-none text-center font-bold"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="neo-brutal-btn bg-[#4ae176] text-[#002109] font-headline uppercase py-2.5 rounded-lg font-black text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{submitting ? "RECORDING..." : "RECORD TO GLOBAL LEADERBOARD"}</span>
                </button>
              </form>
            ) : (
              <div className="text-sm font-mono-code text-[#4ae176] font-bold py-2">
                🎉 CRUNCH RECORD SECURED ON THE LEADERBOARD!
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={startGame}
                className="neo-brutal-btn bg-[#facc15] text-[#3c2f00] px-5 py-2 rounded-lg font-headline uppercase text-sm font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>NEXT ROUND</span>
              </button>
              <button
                onClick={onOpenLeaderboard}
                className="neo-brutal-btn bg-[#222a3d] text-[#ffecb9] px-4 py-2 rounded-lg font-headline uppercase text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>ROSTER</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-screen mobile touch buttons */}
      <div className="sm:hidden flex items-center justify-between gap-2 pt-3">
        <button
          onTouchStart={() => (keysRef.current.left = true)}
          onTouchEnd={() => (keysRef.current.left = false)}
          onMouseDown={() => (keysRef.current.left = true)}
          onMouseUp={() => (keysRef.current.left = false)}
          className="flex-1 py-3 bg-[#222a3d] border border-[#2d3449] rounded-xl text-lg font-black text-[#ffecb9] active:bg-[#facc15] active:text-[#3c2f00]"
        >
          ◀ LEFT
        </button>
        <button
          onClick={triggerBoost}
          className="py-3 px-4 bg-[#facc15] text-[#3c2f00] border-2 border-black rounded-xl text-sm font-black font-headline active:scale-95"
        >
          ⚡ BOOST ({boostCharges})
        </button>
        <button
          onTouchStart={() => (keysRef.current.right = true)}
          onTouchEnd={() => (keysRef.current.right = false)}
          onMouseDown={() => (keysRef.current.right = true)}
          onMouseUp={() => (keysRef.current.right = false)}
          className="flex-1 py-3 bg-[#222a3d] border border-[#2d3449] rounded-xl text-lg font-black text-[#ffecb9] active:bg-[#facc15] active:text-[#3c2f00]"
        >
          RIGHT ▶
        </button>
      </div>

      {/* Action Game Controls Console */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
        <button
          id="game-action-start-run-btn"
          onClick={startGame}
          className="neo-brutal-btn bg-[#facc15] hover:bg-[#ffecb9] text-[#3c2f00] font-headline text-base sm:text-lg uppercase py-3 rounded-xl flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000000] font-black cursor-pointer"
        >
          <Rocket className="w-5 h-5" />
          <span>{isPlaying ? "RESTART RUN" : "START RUN"}</span>
        </button>

        <button
          id="game-action-boost-butter-btn"
          onClick={triggerBoost}
          disabled={!isPlaying || boostCharges <= 0}
          className={`neo-brutal-btn bg-[#4ae176] text-[#002109] hover:bg-[#00b954] font-headline text-base sm:text-lg uppercase py-3 rounded-xl flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000000] font-black transition-all ${
            !isPlaying || boostCharges <= 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <Zap className="w-5 h-5 text-[#231b00]" />
          <span>BOOST BUTTER ({boostCharges})</span>
        </button>

        <button
          id="game-action-cashout-btn"
          onClick={triggerCashout}
          disabled={!isPlaying}
          className={`neo-brutal-btn bg-[#222a3d] text-[#ffecb9] hover:text-[#4ae176] font-headline text-base sm:text-lg uppercase py-3 rounded-xl flex items-center justify-center gap-2 border-2 border-[#2d3449] shadow-[4px_4px_0px_#000000] font-bold ${
            !isPlaying ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <PiggyBank className="w-5 h-5 text-[#facc15]" />
          <span>CASHOUT GAINS</span>
        </button>
      </div>
    </div>
  );
};
