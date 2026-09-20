import React, { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Fighter } from "../types";
import { sound } from "../audio";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  RefreshCw,
  Trophy,
} from "lucide-react";

interface PepeSubwayRunProps {
  selectedFighter: Fighter;
  onOpenLeaderboard: () => void;
  onRunFinish?: (score: number, distance: number) => void;
}

type Lane = 0 | 1 | 2; // Left, Center, Right
type ObstacleType = "burger" | "fud" | "cone";

interface Obstacle {
  lane: Lane;
  y: number;
  type: ObstacleType;
  height: number;
}

interface Fry {
  lane: Lane;
  y: number;
}

export const PepeSubwayRun: React.FC<PepeSubwayRunProps> = ({
  selectedFighter,
  onOpenLeaderboard,
  onRunFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [fries, setFries] = useState(0);

  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const gameRef = useRef({
    running: false,
    score: 0,
    distance: 0,
    fries: 0,
    speed: 8,
    lastTime: 0,
    spawnTimer: 0,
    fryTimer: 0,
  });

  const playerRef = useRef({
    lane: 1 as Lane, // Starts in center lane
    targetX: 0,
    currentX: 0,
    y: 0,
    width: 64,
    height: 80,
    isJumping: false,
    jumpVelocity: 0,
    isSliding: false,
    slideTimer: 0,
    frame: 0,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const friesRef = useRef<Fry[]>([]);
  const animationRef = useRef<number | null>(null);

  // Lane X coordinates calculated dynamically based on canvas width
  const getLaneX = (lane: Lane, canvasWidth:oons) => {
    const laneWidth = canvasWidth / 3;
    return laneWidth * lane + laneWidth / 2;
  };

  // --- CONTROLS ---
  const moveLeft = useCallback(() => {
    if (!gameRef.current.running) return;
    const player = playerRef.current;
    if (player.lane > 0) {
      player.lane = (player.lane - 1) as Lane;
      sound.playSlide?.();
    }
  }, []);

  const moveRight = useCallback(() => {
    if (!gameRef.current.running) return;
    const player = playerRef.current;
    if (player.lane < 2) {
      player.lane = (player.lane + 1) as Lane;
      sound.playSlide?.();
    }
  }, []);

  const jump = useCallback(() => {
    if (!gameRef.current.running) return;
    const player = playerRef.current;
    if (!player.isJumping && !player.isSliding) {
      player.isJumping = true;
      player.jumpVelocity = -12;
      sound.playJump();
    }
  }, []);

  const slide = useCallback(() => {
    if (!gameRef.current.running) return;
    const player = playerRef.current;
    if (!player.isJumping && !player.isSliding) {
      player.isSliding = true;
      player.slideTimer = 25;
      sound.playSlide();
    }
  }, []);

  // --- START GAME ---
  const startRun = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameRef.current = {
      running: true,
      score: 0,
      distance: 0,
      fries: 0,
      speed: 9,
      lastTime: performance.now(),
      spawnTimer: 600,
      fryTimer: 400,
    };

    playerRef.current = {
      lane: 1,
      targetX: canvas.width / 2,
      currentX: canvas.width / 2,
      y: canvas.height - 150,
      width: 64,
      height: 80,
      isJumping: false,
      jumpVelocity: 0,
      isSliding: false,
      slideTimer: 0,
      frame: 0,
    };

    obstaclesRef.current = [];
    friesRef.current = [];

    setScore(0);
    setDistance(0);
    setFries(0);
    setIsGameOver(false);
    setSubmitted(false);
    setIsPlaying(true);
    sound.playBoost();
  }, []);

  // --- CRASH ---
  const crash = useCallback(() => {
    if (!gameRef.current.running) return;
    gameRef.current.running = false;
    setIsPlaying(false);
    setIsGameOver(true);
    sound.playHit();

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    onRunFinish?.(gameRef.current.score, Math.floor(gameRef.current.distance));
  }, [onRunFinish]);

  // --- KEYBOARD LISTENERS ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        e.preventDefault();
        moveLeft();
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        e.preventDefault();
        moveRight();
      } else if (e.code === "ArrowUp" || e.code === "Space" || e.code === "KeyW") {
        e.preventDefault();
        if (!gameRef.current.running) startRun();
        else jump();
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        slide();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moveLeft, moveRight, jump, slide, startRun]);

  // --- MAIN RENDER & GAME LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      // Enforce a vertical portrait layout ideal for mobiles
      canvas.width = Math.min(450, Math.floor(rect.width));
      canvas.height = Math.min(650, Math.floor(window.innerHeight * 0.65));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const loop = (time: number) => {
      const width = canvas.width;
      const height = canvas.height;
      const game = gameRef.current;
      const player = playerRef.current;

      // 1. Perspective Background (Vertical Subway Grid)
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // Draw Perspective Track Lines converging upwards
      const horizonY = height * 0.25;
      const laneWidth = width / 3;

      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 4;
      for (let i = 0; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(i * laneWidth, height);
        ctx.stroke();
      }

      // Moving Grid Lines for Depth Illusion
      const gridOffset = (game.distance * 3) % 50;
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      for (let yPos = horizonY + gridOffset; yPos < height; yPos += 50) {
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.stroke();
      }

      if (game.running) {
        const dt = Math.min(32, time - game.lastTime);
        game.lastTime = time;

        game.distance += game.speed * (dt / 16);
        game.score += Math.floor(game.speed * 0.5);
        game.speed = Math.min(16, 8 + game.distance / 700);

        setScore(game.score);
        setDistance(Math.floor(game.distance));

        // Smooth lane interpolation
        const targetX = getLaneX(player.lane, width);
        player.currentX += (targetX - player.currentX) * 0.2;

        // Jump & Slide Physics
        if (player.isJumping) {
          player.y += player.jumpVelocity;
          player.jumpVelocity += 0.8;
          if (player.y >= height - 150) {
            player.y = height - 150;
            player.isJumping = false;
          }
        }

        if (player.isSliding) {
          player.slideTimer -= 1;
          if (player.slideTimer <= 0) player.isSliding = false;
        }

        player.frame++;

        // Spawn Obstacles
        game.spawnTimer -= dt;
        if (game.spawnTimer <= 0) {
          const lanes: Lane[] = [0, 1, 2];
          const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
          const types: ObstacleType[] = ["burger", "fud", "cone"];
          const type = types[Math.floor(Math.random() * types.length)];

          obstaclesRef.current.push({
            lane: randomLane,
            y: horizonY,
            type,
            height: 40,
          });

          game.spawnTimer = 900 - Math.min(400, game.distance / 5);
        }

        // Spawn Fries
        game.fryTimer -= dt;
        if (game.fryTimer <= 0) {
          const lanes: Lane[] = [0, 1, 2];
          const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
          friesRef.current.push({ lane: randomLane, y: horizonY });
          game.fryTimer = 700;
        }

        // Update Obstacles (Moving downward towards player)
        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          const obs = obstaclesRef.current[i];
          obs.y += game.speed * 1.2;
          obs.height += 0.4; // Perspective growth effect

          // Collision Check
          const obsX = getLaneX(obs.lane, width);
          const hitRangeY = height - 150;

          if (
            obs.lane === player.lane &&
            obs.y >= hitRangeY - 40 &&
            obs.y <= hitRangeY + 20
          ) {
            if (obs.type === "fud" && player.isSliding) {
              // Successfully slid under FUD barrier! Score bonus
              game.score += 100;
              obstaclesRef.current.splice(i, 1);
              sound.playFryCatch?.();
              continue;
            } else if (obs.type === "burger" && player.isJumping) {
              // Successfully jumped over burger!
              game.score += 100;
              obstaclesRef.current.splice(i, 1);
              sound.playFryCatch?.();
              continue;
            } else {
              crash();
              break;
            }
          }

          if (obs.y > height + 50) obstaclesRef.current.splice(i, 1);
        }

        // Update Fries
        for (let i = friesRef.current.length - 1; i >= 0; i--) {
          const fry = friesRef.current[i];
          fry.y += game.speed * 1.2;

          const fryX = getLaneX(fry.lane, width);
          const hitRangeY = height - 150;

          if (
            fry.lane === player.lane &&
            Math.abs(fry.y - hitRangeY) < 45
          ) {
            game.fries += 1;
            game.score += 50;
            setFries(game.fries);
            setScore(game.score);
            sound.playFryCatch();
            friesRef.current.splice(i, 1);
            continue;
          }

          if (fry.y > height + 50) friesRef.current.splice(i, 1);
        }
      }

      // --- RENDER OBSTACLES ---
      obstaclesRef.current.forEach((obs) => {
        const ox = getLaneX(obs.lane, width);
        ctx.save();
        ctx.translate(ox, obs.y);
        const scale = obs.height / 40;
        ctx.scale(scale, scale);

        if (obs.type === "burger") {
          ctx.font = "36px serif";
          ctx.textAlign = "center";
          ctx.fillText("🍔", 0, 0);
        } else if (obs.type === "fud") {
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(-35, -15, 70, 30);
          ctx.fillStyle = "#ffffff";
          ctx.font = "900 12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("FUD BARRIER", 0, 4);
        } else {
          ctx.fillStyle = "#f97316";
          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.lineTo(20, 15);
          ctx.lineTo(-20, 15);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      // --- RENDER FRIES ---
      friesRef.current.forEach((fry) => {
        const fx = getLaneX(fry.lane, width);
        ctx.save();
        ctx.font = "28px serif";
        ctx.textAlign = "center";
        ctx.fillText("🍟", fx, fry.y);
        ctx.restore();
      });

      // --- RENDER PLAYER (PEPE) ---
      const px = player.currentX;
      const py = player.isJumping ? height - 210 : height - 150;

      ctx.save();
      ctx.translate(px, py);

      // Pepe Body Suit
      ctx.fillStyle = selectedFighter.suitColor || "#0f172a";
      ctx.fillRect(-22, -40, 44, player.isSliding ? 35 : 55);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.strokeRect(-22, -40, 44, player.isSliding ? 35 : 55);

      // Pepe Head
      ctx.fillStyle = "#5ba138";
      ctx.beginPath();
      ctx.arc(0, player.isSliding ? -35 : -55, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sunglasses
      ctx.fillStyle = "#000";
      ctx.fillRect(-16, player.isSliding ? -42 : -62, 32, 12);

      ctx.restore();

      // Start screen prompt
      if (!game.running && !isGameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#facc15";
        ctx.font = "900 36px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PEPE SUBWAY", width / 2, height / 2 - 30);

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px monospace";
        ctx.fillText("TAP START OR USE ARROW KEYS", width / 2, height / 2 + 15);
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [selectedFighter, isGameOver, crash]);

  // --- SUBMIT SCORE FORM ---
  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || submitting || submitted) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player: playerName.trim(),
          score: gameRef.current.score,
          multiplier: 1,
          friesCaught: gameRef.current.fries,
          fighter: `${selectedFighter.name} (Subway Run)`,
          title: "Subway Degen",
          badge: "🚇",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        sound.playCashout();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto">
      {/* HEADER STATS */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="font-headline text-2xl font-black text-[#ffecb9] uppercase flex items-center gap-1">
            <span>🚇</span> SUBWAY PEPE
          </h2>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#131b2e] border-2 border-[#2d3449] rounded-xl px-3 py-1">
            <span className="block font-mono-code text-[8px] text-[#9a9078]">SCORE</span>
            <span className="font-headline text-sm font-black text-[#facc15]">{score.toLocaleString()}</span>
          </div>
          <div className="bg-[#131b2e] border-2 border-[#2d3449] rounded-xl px-3 py-1">
            <span className="block font-mono-code text-[8px] text-[#9a9078]">FRIES</span>
            <span className="font-headline text-sm font-black text-[#4ae176]">🍟 {fries}</span>
          </div>
        </div>
      </div>

      {/* GAME CANVAS CONTAINER */}
      <div className="relative w-full rounded-3xl border-4 border-black overflow-hidden bg-black shadow-[6px_6px_0px_#000]">
        <canvas
          ref={canvasRef}
          onClick={() => {
            if (!gameRef.current.running) startRun();
          }}
          className="block w-full h-auto cursor-pointer touch-none"
        />

        {/* GAME OVER MODAL */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full bg-[#131b2e] border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_#000] text-center">
              <div className="text-4xl mb-1">💥</div>
              <h3 className="font-headline text-2xl text-[#facc15] font-black uppercase">TRAIN HIT!</h3>
              <p className="font-mono-code text-xs text-[#d1c6ab] mt-1">
                {distance}m • {score.toLocaleString()} pts
              </p>

              {!submitted ? (
                <form onSubmit={submitScore} className="mt-4">
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={16}
                    placeholder="YOUR DEGEN NAME"
                    className="w-full bg-[#060e20] border-2 border-[#2d3449] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono-code mb-2"
                  />
                  <button
                    disabled={submitting || !playerName.trim()}
                    className="w-full bg-[#facc15] text-black border-2 border-black rounded-xl py-2 font-headline font-black text-sm shadow-[2px_2px_0px_#000]"
                  >
                    {submitting ? "SAVING..." : "SAVE SCORE"}
                  </button>
                </form>
              ) : (
                <div className="my-3 bg-[#4ae176]/10 border border-[#4ae176] rounded-xl p-2 text-[#4ae176] font-mono-code text-xs flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> SAVED
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={startRun}
                  className="flex-1 bg-[#4ae176] text-black border-2 border-black rounded-xl py-2 font-headline font-black text-xs shadow-[2px_2px_0px_#000]"
                >
                  <RefreshCw className="inline w-3 h-3 mr-1" /> AGAIN
                </button>
                <button
                  onClick={onOpenLeaderboard}
                  className="px-3 bg-[#222a3d] text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]"
                >
                  <Trophy className="w-4 h-4 text-[#facc15]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE TOUCH CONTROLS */}
      {isPlaying && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          <button
            onClick={moveLeft}
            className="bg-[#2563eb] text-white border-2 border-black rounded-xl py-3 font-headline font-black shadow-[3px_3px_0px_#000] active:translate-y-1 flex items-center justify-center"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={slide}
            className="bg-[#ef4444] text-white border-2 border-black rounded-xl py-3 font-headline font-black text-xs shadow-[3px_3px_0px_#000] active:translate-y-1 flex items-center justify-center"
          >
            <ArrowDown />
          </button>
          <button
            onClick={jump}
            className="bg-[#4ae176] text-black border-2 border-black rounded-xl py-3 font-headline font-black text-xs shadow-[3px_3px_0px_#000] active:translate-y-1 flex items-center justify-center"
          >
            <ArrowUp />
          </button>
          <button
            onClick={moveRight}
            className="bg-[#2563eb] text-white border-2 border-black rounded-xl py-3 font-headline font-black shadow-[3px_3px_0px_#000] active:translate-y-1 flex items-center justify-center"
          >
            <ArrowRight />
          </button>
        </div>
      )}

      {!isPlaying && (
        <button
          onClick={startRun}
          className="w-full mt-4 bg-[#facc15] text-black border-2 border-black rounded-2xl py-3 font-headline font-black shadow-[4px_4px_0px_#000]"
        >
          START SUBWAY RUN
        </button>
      )}
    </section>
  );
};