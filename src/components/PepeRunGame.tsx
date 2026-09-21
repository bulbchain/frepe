import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { Fighter, LeaderboardEntry } from "../types";
import { sound } from "../audio";
import { drawGentlemanPepe } from "../utils/drawGentlemanPepe";
import {
  Rocket,
  Zap,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Trophy,
  Shield,
  Award,
  Sparkles,
  Flame,
  Check,
  Footprints,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface PepeRunGameProps {
  selectedFighter: Fighter;
  onOpenLeaderboard: () => void;
  onRunFinish?: (score: number, distance: number) => void;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "red_candle" | "puddle" | "overhead_fud" | "dump_bot";
  passed?: boolean;
}

interface Collectible {
  x: number;
  y: number;
  size: number;
  type: "fry" | "fry_box" | "green_candle" | "shield" | "rocket";
  collected?: boolean;
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

export const PepeRunGame: React.FC<PepeRunGameProps> = ({
  selectedFighter,
  onOpenLeaderboard,
  onRunFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High-level game states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [cashedOut, setCashedOut] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Live HUD metrics
  const [distance, setDistance] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [friesCount, setFriesCount] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [lives, setLives] = useState<number>(3);
  const [shieldActive, setShieldActive] = useState<boolean>(selectedFighter.hasShield);
  const [rocketActive, setRocketActive] = useState<boolean>(false);
  const [rocketTimer, setRocketTimer] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [speedDisplay, setSpeedDisplay] = useState<number>(45);

  // Score submission
  const [playerName, setPlayerName] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Internal physics & runner refs
  const runnerRef = useRef({
    x: 100,
    y: 200,
    width: 52,
    height: 68,
    normalHeight: 68,
    slideHeight: 36,
    vy: 0,
    isGrounded: true,
    isJumping: false,
    isSliding: false,
    jumpCount: 0,
    maxJumps: 2, // Double jump capability!
    slideTimer: 0,
    runFrame: 0,
  });

  const worldRef = useRef({
    speed: 7,
    baseSpeed: 7,
    distance: 0,
    groundY: 260,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnDistRef = useRef<number>(0);

  // Sync refs for loop access
  const isPlayingRef = useRef(false);
  const scoreRef = useRef(0);
  const distanceRef = useRef(0);
  const friesRef = useRef(0);
  const multRef = useRef(1.0);
  const comboRef = useRef(0);
  const livesRef = useRef(3);
  const shieldRef = useRef(selectedFighter.hasShield);
  const rocketRef = useRef(false);

  // Keep shield in sync when fighter changes
  useEffect(() => {
    setShieldActive(selectedFighter.hasShield);
    shieldRef.current = selectedFighter.hasShield;
  }, [selectedFighter]);

  // Handle Fullscreen & Landscape request on mobile play
  const toggleFullscreenPlay = async () => {
    const elem = containerRef.current;
    if (!elem) return;

    try {
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        }
        // Attempt to lock screen orientation to landscape on supported mobile devices
        if (screen.orientation && (screen.orientation as any).lock) {
          try {
            await (screen.orientation as any).lock("landscape");
          } catch (err) {
            // Orientation lock might fail if not fully permitted by browser/device settings
            console.warn("Orientation lock not supported or allowed:", err);
          }
        }
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error("Error attempting to enable full-screen mode:", err);
    }
  };

  // Listen to external fullscreen changes (e.g. user pressing escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle jump
  const triggerJump = useCallback(() => {
    if (!isPlayingRef.current) return;
    const r = runnerRef.current;
    if (r.jumpCount < r.maxJumps) {
      r.vy = r.jumpCount === 0 ? -13.5 : -11.5;
      r.isGrounded = false;
      r.isJumping = true;
      r.jumpCount += 1;
      r.isSliding = false; // cancel slide on jump
      sound.playJump();

      // Spawn jump dust particles
      for (let i = 0; i < 6; i++) {
        particlesRef.current.push({
          x: r.x + r.width / 2,
          y: r.y + r.height,
          vx: (Math.random() - 0.5) * 4 - 2,
          vy: Math.random() * -2,
          life: 0,
          maxLife: 15,
          color: "#facc15",
          size: 3 + Math.random() * 3,
        });
      }
    }
  }, []);

  // Handle slide
  const triggerSlide = useCallback(() => {
    if (!isPlayingRef.current) return;
    const r = runnerRef.current;
    if (r.isGrounded && !r.isSliding) {
      r.isSliding = true;
      r.slideTimer = 35; // ~35 frames of sliding
      sound.playSlide();

      // Slide sparks
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          x: r.x + 10,
          y: worldRef.current.groundY,
          vx: -(Math.random() * 6 + 3),
          vy: (Math.random() - 0.7) * 3,
          life: 0,
          maxLife: 20,
          color: Math.random() > 0.5 ? "#facc15" : "#ffecb9",
          size: 2.5 + Math.random() * 2,
        });
      }
    }
  }, []);

  // Handle start run
  const startRun = async () => {
    // Automatically trigger fullscreen horizontal mode on mobile/click
    await toggleFullscreenPlay();

    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsGameOver(false);
    setCashedOut(false);
    setSubmitted(false);

    // Initial stats with fighter perks
    const initialMult = 1.0 + (selectedFighter.multiplierBonus || 0);
    setScore(0);
    scoreRef.current = 0;
    setDistance(0);
    distanceRef.current = 0;
    setFriesCount(0);
    friesRef.current = 0;
    setMultiplier(initialMult);
    multRef.current = initialMult;
    setCombo(0);
    comboRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setShieldActive(selectedFighter.hasShield);
    shieldRef.current = selectedFighter.hasShield;
    setRocketActive(false);
    rocketRef.current = false;
    setRocketTimer(0);

    const canvas = canvasRef.current;
    const groundY = canvas ? canvas.height - 85 : 260;
    worldRef.current.groundY = groundY;
    worldRef.current.baseSpeed = 7 + (selectedFighter.speedBonus || 0) * 3;
    worldRef.current.speed = worldRef.current.baseSpeed;
    worldRef.current.distance = 0;

    runnerRef.current = {
      x: 90,
      y: groundY - runnerRef.current.normalHeight,
      width: 52,
      height: 68,
      normalHeight: 68,
      slideHeight: 36,
      vy: 0,
      isGrounded: true,
      isJumping: false,
      isSliding: false,
      jumpCount: 0,
      maxJumps: selectedFighter.id === "cyber-frepe" ? 3 : 2, // Cyber Frepe triple jump!
      slideTimer: 0,
      runFrame: 0,
    };

    obstaclesRef.current = [];
    collectiblesRef.current = [];
    particlesRef.current = [];
    lastSpawnDistRef.current = 0;

    sound.playBoost();
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "KeyW"
      ) {
        e.preventDefault();
        if (!isPlayingRef.current) {
          startRun();
        } else {
          triggerJump();
        }
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        triggerSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerJump, triggerSlide]);

  // Cashout run safely
  const handleCashout = () => {
    if (!isPlayingRef.current) return;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCashedOut(true);
    sound.playCashout();

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#facc15", "#4ae176", "#ffffff"],
    });

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    if (onRunFinish) {
      onRunFinish(scoreRef.current, Math.floor(distanceRef.current));
    }
  };

  // End run on crash
  const handleCrash = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsGameOver(true);
    sound.playHit();

    // Spawn explosion particles
    const r = runnerRef.current;
    for (let i = 0; i < 25; i++) {
      particlesRef.current.push({
        x: r.x + r.width / 2,
        y: r.y + r.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: 35,
        color: i % 2 === 0 ? "#facc15" : "#ff3b30",
        size: 3 + Math.random() * 5,
      });
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    if (onRunFinish) {
      onRunFinish(scoreRef.current, Math.floor(distanceRef.current));
    }
  };

  // Submit run score
  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || submitting || submitted) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player: playerName.trim(),
          score: scoreRef.current,
          multiplier: parseFloat(multRef.current.toFixed(2)),
          friesCaught: friesRef.current,
          fighter: `${selectedFighter.name} (Pepe Run)`,
          title: "Speed Trench Runner",
          badge: "🏃💨",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        sound.playCashout();
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ["#facc15", "#4ae176", "#38bdf8"],
        });
      }
    } catch (err) {
      console.error("Failed to submit score:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Main game animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localAnimId: number;

    const gameLoop = () => {
      const width = canvas.width;
      const height = canvas.height;
      const groundY = height - 85;
      worldRef.current.groundY = groundY;

      // 1. CLEAR & DRAW DYNAMIC PARALLAX BACKGROUND
      ctx.clearRect(0, 0, width, height);

      // Sky gradient (Midnight neon trenches)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#060a14");
      skyGrad.addColorStop(0.65, "#0d1b38");
      skyGrad.addColorStop(1, "#172344");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant Stars / Neon Grid
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 40; i++) {
        const starX = (i * 47 - (worldRef.current.distance * 0.1) % width + width) % width;
        const starY = (i * 19) % (groundY - 60);
        ctx.globalAlpha = 0.4 + (i % 3) * 0.2;
        ctx.fillRect(starX, starY, (i % 2) + 1.2, (i % 2) + 1.2);
      }
      ctx.globalAlpha = 1.0;

      // Golden French Fry Moon
      ctx.save();
      const moonX = width - 90;
      const moonY = 55;
      ctx.fillStyle = "#facc15";
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 26, 0, Math.PI * 2);
      ctx.fill();

      // Moon Fry Smile & Crown
      ctx.fillStyle = "#e53e3e";
      ctx.fillRect(moonX - 10, moonY - 32, 20, 7);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(moonX - 8, moonY - 38, 3, 7);
      ctx.fillRect(moonX - 2, moonY - 42, 4, 11);
      ctx.fillRect(moonX + 5, moonY - 39, 3, 8);

      ctx.strokeStyle = "#3c2f00";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(moonX, moonY + 4, 10, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.restore();

      // Parallax Skyscraper Skyline with Green/Red Candlestick Charts
      const dist = worldRef.current.distance;
      const skylineOffset = (dist * 0.35) % 180;
      ctx.fillStyle = "#0c152a";
      for (let x = -skylineOffset; x < width + 100; x += 90) {
        const bldgHeight = 70 + ((x * 13) % 90);
        ctx.fillRect(x, groundY - bldgHeight, 75, bldgHeight);

        // Skyscraper glowing windows
        ctx.fillStyle = "#facc15";
        ctx.globalAlpha = 0.35;
        for (let wy = groundY - bldgHeight + 10; wy < groundY - 10; wy += 15) {
          for (let wx = x + 8; wx < x + 65; wx += 14) {
            if ((wx + wy) % 5 !== 0) {
              ctx.fillRect(wx, wy, 6, 8);
            }
          }
        }
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "#0c152a";
      }

      // Neon Billboard Signs in the background
      const signX = ((width * 1.5 - (dist * 0.7)) % (width * 2)) - 100;
      ctx.save();
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(signX, 40, 110, 32);
      ctx.strokeStyle = "#4ae176";
      ctx.lineWidth = 2;
      ctx.strokeRect(signX, 40, 110, 32);
      ctx.fillStyle = "#4ae176";
      ctx.font = "bold 11px 'Space Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("🚀 $FREPE RUN", signX + 55, 60);
      ctx.restore();

      // Parallax Candle chart lines across the horizon
      ctx.strokeStyle = "rgba(74, 225, 118, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 40) {
        const py = groundY - 50 - Math.sin((x + dist * 0.5) * 0.015) * 25;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();

      // 2. DRAW GROUND / RUNNING TRACK
      ctx.fillStyle = "#090f1d";
      ctx.fillRect(0, groundY, width, height - groundY);

      ctx.fillStyle = "#facc15";
      ctx.fillRect(0, groundY, width, 5);

      const curbOffset = (dist * 1.5) % 32;
      for (let x = -curbOffset; x < width + 32; x += 32) {
        ctx.fillStyle = ((x + curbOffset) / 32) % 2 === 0 ? "#facc15" : "#1e293b";
        ctx.fillRect(x, groundY + 5, 32, 7);
      }

      const dashOffset = (dist * 2.2) % 50;
      ctx.fillStyle = "#38bdf8";
      ctx.globalAlpha = 0.5;
      for (let x = -dashOffset; x < width + 50; x += 50) {
        ctx.fillRect(x, groundY + 35, 24, 4);
      }
      ctx.globalAlpha = 1.0;

      // 3. GAMEPLAY SIMULATION (WHEN ACTIVE)
      if (isPlayingRef.current) {
        const speedBonus = Math.min(6, (worldRef.current.distance / 1500) * 4);
        worldRef.current.speed = (worldRef.current.baseSpeed + speedBonus) * (rocketRef.current ? 1.5 : 1);
        worldRef.current.distance += worldRef.current.speed * 0.3;

        const currentDist = worldRef.current.distance;
        distanceRef.current = currentDist;
        setDistance(Math.floor(currentDist));
        setSpeedDisplay(Math.round(worldRef.current.speed * 8));

        scoreRef.current += Math.round((worldRef.current.speed / 2) * multRef.current);
        setScore(scoreRef.current);

        const r = runnerRef.current;
        r.runFrame += 0.25;

        if (r.isSliding) {
          r.height = r.slideHeight;
          r.slideTimer -= 1;
          if (r.slideTimer <= 0) {
            r.isSliding = false;
            r.height = r.normalHeight;
          }
        } else {
          r.height = r.normalHeight;
        }

        r.vy += 0.68;
        r.y += r.vy;

        const currentGroundY = groundY - r.height;
        if (r.y >= currentGroundY) {
          r.y = currentGroundY;
          r.vy = 0;
          r.isGrounded = true;
          r.isJumping = false;
          r.jumpCount = 0;
        }

        if (rocketRef.current) {
          setRocketTimer((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              rocketRef.current = false;
              setRocketActive(false);
            }
            return Math.max(0, next);
          });
        }

        if (currentDist - lastSpawnDistRef.current > 180 + Math.random() * 120) {
          lastSpawnDistRef.current = currentDist;
          const roll = Math.random();

          if (roll < 0.55) {
            const obsRoll = Math.random();
            if (obsRoll < 0.4) {
              obstaclesRef.current.push({
                x: width + 40,
                y: groundY - 50,
                width: 26,
                height: 50,
                type: "red_candle",
              });
            } else if (obsRoll < 0.7) {
              obstaclesRef.current.push({
                x: width + 40,
                y: groundY - 82,
                width: 45,
                height: 30,
                type: "overhead_fud",
              });
            } else if (obsRoll < 0.88) {
              obstaclesRef.current.push({
                x: width + 40,
                y: groundY - 12,
                width: 55,
                height: 14,
                type: "puddle",
              });
            } else {
              obstaclesRef.current.push({
                x: width + 40,
                y: groundY - 45,
                width: 34,
                height: 45,
                type: "dump_bot",
              });
            }
          }

          const collRoll = Math.random();
          if (collRoll < 0.7) {
            const fryCount = 3 + Math.floor(Math.random() * 3);
            const startArcX = width + 70;
            for (let f = 0; f < fryCount; f++) {
              collectiblesRef.current.push({
                x: startArcX + f * 34,
                y: groundY - 60 - Math.sin((f / fryCount) * Math.PI) * 45,
                size: 20,
                type: "fry",
              });
            }
          } else if (collRoll < 0.85) {
            collectiblesRef.current.push({
              x: width + 60,
              y: groundY - 55,
              size: 28,
              type: "fry_box",
            });
          } else if (collRoll < 0.93) {
            collectiblesRef.current.push({
              x: width + 60,
              y: groundY - 50,
              size: 26,
              type: "green_candle",
            });
          } else {
            const isRocket = Math.random() > 0.5;
            collectiblesRef.current.push({
              x: width + 60,
              y: groundY - 65,
              size: 28,
              type: isRocket ? "rocket" : "shield",
            });
          }
        }
      }

      // 4. UPDATE & DRAW COLLECTIBLES
      const runner = runnerRef.current;
      for (let i = collectiblesRef.current.length - 1; i >= 0; i--) {
        const c = collectiblesRef.current[i];
        if (isPlayingRef.current) {
          c.x -= worldRef.current.speed;

          if (rocketRef.current) {
            const dx = runner.x + runner.width / 2 - c.x;
            const dy = runner.y + runner.height / 2 - c.y;
            c.x += dx * 0.15;
            c.y += dy * 0.15;
          }

          const collides =
            runner.x < c.x + c.size &&
            runner.x + runner.width > c.x - c.size &&
            runner.y < c.y + c.size &&
            runner.y + runner.height > c.y - c.size;

          if (collides) {
            collectiblesRef.current.splice(i, 1);
            comboRef.current += 1;
            setCombo(comboRef.current);

            if (comboRef.current % 10 === 0) {
              multRef.current = parseFloat((multRef.current + 0.2).toFixed(2));
              setMultiplier(multRef.current);
              sound.playBoost();
            }

            if (c.type === "fry") {
              friesRef.current += 1;
              setFriesCount(friesRef.current);
              scoreRef.current += Math.round(15 * multRef.current);
              setScore(scoreRef.current);
              sound.playFryCatch();
            } else if (c.type === "fry_box") {
              friesRef.current += 5;
              setFriesCount(friesRef.current);
              scoreRef.current += Math.round(80 * multRef.current);
              setScore(scoreRef.current);
              sound.playJackpot();
            } else if (c.type === "green_candle") {
              scoreRef.current += Math.round(150 * multRef.current);
              setScore(scoreRef.current);
              multRef.current = parseFloat((multRef.current + 0.5).toFixed(2));
              setMultiplier(multRef.current);
              sound.playJackpot();
            } else if (c.type === "shield") {
              shieldRef.current = true;
              setShieldActive(true);
              sound.playPowerup();
            } else if (c.type === "rocket") {
              rocketRef.current = true;
              setRocketActive(true);
              setRocketTimer(220);
              sound.playBoost();
            }

            for (let p = 0; p < 8; p++) {
              particlesRef.current.push({
                x: c.x,
                y: c.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 0,
                maxLife: 18,
                color: c.type === "fry" || c.type === "fry_box" ? "#facc15" : "#4ae176",
                size: 3 + Math.random() * 3,
              });
            }
            continue;
          }
        }

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (c.type === "fry") {
          ctx.font = "20px serif";
          ctx.fillText("🍟", c.x, c.y);
        } else if (c.type === "fry_box") {
          ctx.font = "24px serif";
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 10;
          ctx.fillText("🍟✨", c.x, c.y);
        } else if (c.type === "green_candle") {
          ctx.font = "22px serif";
          ctx.fillText("🕯️", c.x, c.y);
        } else if (c.type === "shield") {
          ctx.font = "22px serif";
          ctx.fillText("🛡️", c.x, c.y);
        } else if (c.type === "rocket") {
          ctx.font = "24px serif";
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 12;
          ctx.fillText("🚀", c.x, c.y);
        }
        ctx.restore();

        if (c.x < -60) {
          collectiblesRef.current.splice(i, 1);
        }
      }

      // 5. UPDATE & DRAW OBSTACLES
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        if (isPlayingRef.current) {
          obs.x -= worldRef.current.speed;

          if (!obs.passed && obs.x + obs.width < runner.x) {
            obs.passed = true;
            scoreRef.current += Math.round(25 * multRef.current);
            setScore(scoreRef.current);
          }

          const hit =
            runner.x + 8 < obs.x + obs.width &&
            runner.x + runner.width - 8 > obs.x &&
            runner.y + 6 < obs.y + obs.height &&
            runner.y + runner.height > obs.y + 4;

          if (hit) {
            if (rocketRef.current) {
              obstaclesRef.current.splice(i, 1);
              sound.playHit();
              for (let p = 0; p < 12; p++) {
                particlesRef.current.push({
                  x: obs.x + obs.width / 2,
                  y: obs.y + obs.height / 2,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  life: 0,
                  maxLife: 20,
                  color: "#ff3b30",
                  size: 4,
                });
              }
              continue;
            } else if (shieldRef.current) {
              shieldRef.current = false;
              setShieldActive(false);
              obstaclesRef.current.splice(i, 1);
              sound.playHit();
              comboRef.current = 0;
              setCombo(0);
              continue;
            } else {
              livesRef.current -= 1;
              setLives(livesRef.current);
              comboRef.current = 0;
              setCombo(0);
              obstaclesRef.current.splice(i, 1);

              if (livesRef.current <= 0) {
                handleCrash();
                break;
              } else {
                sound.playHit();
              }
              continue;
            }
          }
        }

        ctx.save();
        if (obs.type === "red_candle") {
          ctx.fillStyle = "#ff3b30";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.fillRect(obs.x + 4, obs.y + 8, obs.width - 8, obs.height - 8);
          ctx.strokeRect(obs.x + 4, obs.y + 8, obs.width - 8, obs.height - 8);
          ctx.strokeStyle = "#ff3b30";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + 8);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width / 2, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height + 6);
          ctx.stroke();
        } else if (obs.type === "overhead_fud") {
          ctx.fillStyle = "#93000a";
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = "#ff3b30";
          ctx.lineWidth = 2;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px 'Space Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillText("! FUD !", obs.x + obs.width / 2, obs.y + 14);
          ctx.fillText("SLIDE ⬇️", obs.x + obs.width / 2, obs.y + 24);
        } else if (obs.type === "puddle") {
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.ellipse(
            obs.x + obs.width / 2,
            obs.y + obs.height / 2,
            obs.width / 2,
            obs.height / 2,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.strokeStyle = "#0284c7";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.font = "14px serif";
          ctx.fillText("💦", obs.x + 12, obs.y + 10);
        } else if (obs.type === "dump_bot") {
          ctx.font = "28px serif";
          ctx.textAlign = "center";
          ctx.fillText("🤖", obs.x + obs.width / 2, obs.y + 32);
        }
        ctx.restore();

        if (obs.x < -70) {
          obstaclesRef.current.splice(i, 1);
        }
      }

      // 6. DRAW PEPE THE EXECUTIVE FRY RUNNER
      const px = runner.x;
      const py = runner.y;
      const isSliding = runner.isSliding;
      const isJumping = !runner.isGrounded;

      ctx.save();

      if (shieldRef.current) {
        ctx.strokeStyle = "#4ae176";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#4ae176";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.ellipse(
          px + runner.width / 2,
          py + runner.height / 2,
          runner.width / 2 + 12,
          runner.height / 2 + 8,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      if (rocketRef.current) {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(
          px + runner.width / 2,
          py + runner.height / 2,
          runner.width / 2 + 14,
          runner.height / 2 + 10,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        ctx.fillStyle = Math.random() > 0.5 ? "#facc15" : "#ff3b30";
        ctx.beginPath();
        ctx.moveTo(px, py + runner.height / 2);
        ctx.lineTo(px - 25 - Math.random() * 15, py + runner.height / 2 + (Math.random() - 0.5) * 8);
        ctx.lineTo(px, py + runner.height / 2 + 10);
        ctx.closePath();
        ctx.fill();
      }

      drawGentlemanPepe({
        ctx,
        x: px,
        y: py,
        width: runner.width,
        height: runner.height,
        runFrame: runner.runFrame,
        isSliding,
        isJumping,
        suitColor: selectedFighter.suitColor || "#111624",
        boostActive: rocketRef.current,
        shieldActive: shieldRef.current,
        mode: "run",
      });

      ctx.restore();

      // 7. DRAW PARTICLES
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // 8. IDLE PROMPT OVERLAY (BEFORE RUN STARTS)
      if (!isPlayingRef.current && !isGameOver && !cashedOut) {
        ctx.save();
        ctx.fillStyle = "rgba(6, 14, 32, 0.75)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#ffecb9";
        ctx.font = "900 24px 'Syne', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PEPE RUN: WALL STREET SPRINT", width / 2, height / 2 - 25);

        ctx.fillStyle = "#facc15";
        ctx.font = "bold 13px 'Space Mono', monospace";
        ctx.fillText("SPACE / TAP TO JUMP  •  DOWN ARROW / S TO SLIDE", width / 2, height / 2 + 10);

        ctx.fillStyle = "#4ae176";
        ctx.font = "bold 11px 'Space Mono', monospace";
        ctx.fillText("DODGE RED CANDLES • SLIDE UNDER FUD • COLLECT CRISPY FRIES", width / 2, height / 2 + 35);
        ctx.restore();
      }

      localAnimId = requestAnimationFrame(gameLoop);
    };

    localAnimId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(localAnimId);
  }, [isGameOver, cashedOut, selectedFighter]);

  return (
    <div
      ref={containerRef}
      id="pepe-run-game-container"
      className={`bg-[#131b2e] rounded-3xl border-4 border-black p-3 sm:p-6 shadow-[8px_8px_0px_#000000] flex flex-col gap-3 relative overflow-hidden transition-all ${
        isFullscreen ? "w-screen h-screen justify-center items-center z-50 rounded-none p-2" : ""
      }`}
    >
      {/* Top HUD Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#060e20] p-2.5 sm:p-4 rounded-2xl border-2 border-[#2d3449] w-full">
        {/* Distance & Score */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <span className="font-mono-code text-[9px] sm:text-[10px] text-[#9a9078] block">DISTANCE</span>
            <div className="flex items-baseline gap-1 font-headline font-black text-lg sm:text-2xl text-[#facc15]">
              <Footprints className="w-4 h-4 sm:w-5 sm:h-5 text-[#facc15]" />
              <span>{distance}</span>
              <span className="text-[10px] sm:text-xs font-mono-code text-[#ffecb9]">m</span>
            </div>
          </div>

          <div className="h-7 sm:h-8 w-[2px] bg-[#2d3449]" />

          <div>
            <span className="font-mono-code text-[9px] sm:text-[10px] text-[#9a9078] block">SCORE</span>
            <span className="font-headline font-black text-lg sm:text-2xl text-[#ffecb9] block">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="h-7 sm:h-8 w-[2px] bg-[#2d3449] hidden sm:block" />

          <div className="hidden sm:block">
            <span className="font-mono-code text-[10px] text-[#9a9078] block">FRIES</span>
            <span className="font-headline font-black text-lg text-[#facc15]">
              🍟 {friesCount}
            </span>
          </div>
        </div>

        {/* Speed, Multiplier & Lives */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#222a3d] border border-[#facc15] font-mono-code font-black text-[11px] sm:text-xs text-[#facc15] flex items-center gap-1 shadow-[2px_2px_0px_#000000]">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff3b30]" />
            <span>{multiplier.toFixed(1)}x</span>
          </div>

          <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#222a3d] border border-[#2d3449] font-mono-code text-[11px] sm:text-xs text-[#38bdf8] flex items-center gap-1">
            <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#38bdf8]" />
            <span>{speedDisplay} km/h</span>
          </div>

          <div className="flex items-center gap-1 bg-[#090f1d] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-[#2d3449]">
            {[...Array(3)].map((_, idx) => (
              <span
                key={idx}
                className={`text-xs sm:text-sm ${idx < lives ? "opacity-100" : "opacity-20 saturate-0"}`}
              >
                ❤️
              </span>
            ))}
            {shieldActive && <span className="text-xs sm:text-sm">🛡️</span>}
            {rocketActive && <span className="text-xs sm:text-sm animate-bounce">🚀</span>}
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className={`relative w-full overflow-hidden rounded-2xl border-4 border-black bg-[#060a14] ${isFullscreen ? "flex-1 flex items-center justify-center max-h-[85vh]" : ""}`}>
        <canvas
          ref={canvasRef}
          width={800}
          height={320}
          onClick={isPlaying ? triggerJump : startRun}
          className="w-full h-auto max-h-[360px] object-cover cursor-pointer block"
        />

        {/* Compact Mobile On-Canvas Controls */}
        {isPlaying && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerSlide();
              }}
              className="px-3 py-2 bg-[#93000a] text-white border-2 border-black rounded-xl font-headline font-black text-[10px] uppercase shadow-[2px_2px_0px_#000000] active:translate-y-0.5 flex items-center gap-1 opacity-90 hover:opacity-100"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>SLIDE</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerJump();
              }}
              className="px-3.5 py-2 bg-[#4ae176] text-[#002109] border-2 border-black rounded-xl font-headline font-black text-[10px] uppercase shadow-[2px_2px_0px_#000000] active:translate-y-0.5 flex items-center gap-1 opacity-90 hover:opacity-100"
            >
              <ArrowUp className="w-3.5 h-3.5 font-black" />
              <span>JUMP</span>
            </button>
          </div>
        )}

        {/* Start Button Overlay (If Not Playing) with Fullscreen/Landscape Launcher */}
        {!isPlaying && !isGameOver && !cashedOut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={startRun}
              className="pointer-events-auto neo-brutal-btn bg-[#facc15] hover:bg-[#ffecb9] text-[#3c2f00] font-headline text-base sm:text-lg uppercase px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl border-4 border-black font-black flex items-center gap-2.5 shadow-[6px_6px_0px_#000000] cursor-pointer"
            >
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-[#93000a]" />
              <span>START PEPE RUN</span>
            </button>
          </div>
        )}

        {/* Game Over / Crash Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-30">
            <div className="bg-[#131b2e] border-4 border-black rounded-3xl p-5 max-w-sm w-full shadow-[8px_8px_0px_#000000] flex flex-col items-center text-center gap-2.5">
              <span className="text-3xl">💥</span>
              <h3 className="font-headline text-xl uppercase text-[#ff3b30] font-black">
                RUGGED BY THE DIP!
              </h3>
              <p className="text-xs font-mono-code text-[#d1c6ab]">
                Ran <strong className="text-[#facc15]">{distance}m</strong> and scored{" "}
                <strong className="text-[#4ae176]">{score.toLocaleString()} PTS</strong>!
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmitScore} className="w-full flex flex-col gap-2 mt-1">
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Enter Degen Handle..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-[#060e20] border-2 border-[#2d3449] focus:border-[#facc15] rounded-xl px-3 py-2 text-xs font-mono-code text-[#ffecb9] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !playerName.trim()}
                    className="w-full neo-brutal-btn bg-[#facc15] text-[#3c2f00] font-headline text-xs uppercase py-2.5 rounded-xl border-2 border-black font-black shadow-[2px_2px_0px_#000000] cursor-pointer"
                  >
                    {submitting ? "RECORDING RUN..." : "SUBMIT TO LEADERBOARD"}
                  </button>
                </form>
              ) : (
                <div className="w-full py-2 bg-[#00b954]/20 border border-[#4ae176] rounded-xl text-[#4ae176] text-xs font-mono-code font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> SCORE SAVED TO RUNNER BOARD!
                </div>
              )}

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={startRun}
                  className="flex-1 neo-brutal-btn bg-[#4ae176] text-[#002109] font-headline text-xs uppercase py-2.5 rounded-xl border-2 border-black font-black flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000000] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RUN AGAIN</span>
                </button>
                <button
                  onClick={onOpenLeaderboard}
                  className="px-3 bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] rounded-xl border-2 border-black text-xs font-headline font-bold flex items-center justify-center cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#facc15]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cashed Out Banner Overlay */}
        {cashedOut && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-30">
            <div className="bg-[#131b2e] border-4 border-black rounded-3xl p-5 max-w-sm w-full shadow-[8px_8px_0px_#000000] flex flex-col items-center text-center gap-2.5">
              <span className="text-3xl">💰</span>
              <h3 className="font-headline text-xl uppercase text-[#4ae176] font-black">
                GAINS CASHED OUT!
              </h3>
              <p className="text-xs font-mono-code text-[#d1c6ab]">
                Secured <strong className="text-[#facc15]">{distance}m</strong> sprint &{" "}
                <strong className="text-[#4ae176]">{score.toLocaleString()} PTS</strong>!
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmitScore} className="w-full flex flex-col gap-2 mt-1">
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Enter Degen Handle..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-[#060e20] border-2 border-[#2d3449] focus:border-[#facc15] rounded-xl px-3 py-2 text-xs font-mono-code text-[#ffecb9] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !playerName.trim()}
                    className="w-full neo-brutal-btn bg-[#facc15] text-[#3c2f00] font-headline text-xs uppercase py-2.5 rounded-xl border-2 border-black font-black shadow-[2px_2px_0px_#000000] cursor-pointer"
                  >
                    {submitting ? "RECORDING RUN..." : "LOCK IN HIGHSCORE"}
                  </button>
                </form>
              ) : (
                <div className="w-full py-2 bg-[#00b954]/20 border border-[#4ae176] rounded-xl text-[#4ae176] text-xs font-mono-code font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> GAINS SAFELY BANKED!
                </div>
              )}

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={startRun}
                  className="flex-1 neo-brutal-btn bg-[#4ae176] text-[#002109] font-headline text-xs uppercase py-2.5 rounded-xl border-2 border-black font-black flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000000] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>SPRINT AGAIN</span>
                </button>
                <button
                  onClick={onOpenLeaderboard}
                  className="px-3 bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] rounded-xl border-2 border-black text-xs font-headline font-bold flex items-center justify-center cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#facc15]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={handleCashout}
              className="neo-brutal-btn bg-[#4ae176] hover:bg-[#22c55e] text-[#002109] font-headline text-xs uppercase px-4 py-2 rounded-xl border-2 border-black font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#000000] cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>CASHOUT ({score.toLocaleString()} PTS)</span>
            </button>
          ) : (
            <button
              onClick={startRun}
              className="neo-brutal-btn bg-[#facc15] hover:bg-[#ffecb9] text-[#3c2f00] font-headline text-xs uppercase px-4 py-2 rounded-xl border-2 border-black font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#000000] cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-[#93000a]" />
              <span>{isGameOver || cashedOut ? "RUN AGAIN" : "START PEPE RUN"}</span>
            </button>
          )}
        </div>

        {/* Keyboard Instructions Guide */}
        <div className="hidden md:flex items-center gap-2 font-mono-code text-[11px] text-[#9a9078]">
          <span className="px-2 py-1 rounded bg-[#060e20] border border-[#2d3449] text-[#ffecb9] font-bold">
            SPACE / W / UP
          </span>
          <span>Jump (Double Jump)</span>
          <span className="px-2 py-1 rounded bg-[#060e20] border border-[#2d3449] text-[#ffecb9] font-bold ml-2">
            S / DOWN
          </span>
          <span>Slide / Duck</span>
        </div>
      </div>
    </div>
  );
};