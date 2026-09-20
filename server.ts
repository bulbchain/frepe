import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  player: string;
  title: string;
  fighter: string;
  score: number;
  multiplier: number;
  friesCaught: number;
  solGain: string;
  createdAt: string;
  badge?: string;
}

export interface DuelRoom {
  id: string;
  creator: string;
  opponent?: string;
  wagerSol: number;
  status: "open" | "active" | "completed";
  winner?: string;
  potSol: number;
  createdAt: string;
}

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "lead-1",
    player: "FREPE_CEO",
    title: "Suit & Fries",
    fighter: "Wall Street Frepe",
    score: 84200,
    multiplier: 18.4,
    friesCaught: 4576,
    solGain: "48.20 SOL",
    badge: "👑",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "lead-2",
    player: "DiamondHands_Sol",
    title: "Golden King",
    fighter: "Golden King Frepe",
    score: 52140,
    multiplier: 9.2,
    friesCaught: 3200,
    solGain: "24.85 SOL",
    badge: "🍟",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "lead-3",
    player: "DegenSponge",
    title: "Cyber-Crunch",
    fighter: "Cyber-Crunch Frepe",
    score: 38900,
    multiplier: 6.5,
    friesCaught: 2410,
    solGain: "14.10 SOL",
    badge: "⚡",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "lead-4",
    player: "KetchupKingpin",
    title: "Trench Cook",
    fighter: "Trench Cook Frepe",
    score: 29400,
    multiplier: 5.1,
    friesCaught: 1850,
    solGain: "10.25 SOL",
    badge: "🧂",
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: "lead-5",
    player: "CryptoWhale_0x",
    title: "Crispy Baron",
    fighter: "Wall Street Frepe",
    score: 24300,
    multiplier: 4.8,
    friesCaught: 1620,
    solGain: "8.50 SOL",
    badge: "🐋",
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "lead-6",
    player: "FrenchFryApe",
    title: "Salty Degen",
    fighter: "Golden King Frepe",
    score: 18950,
    multiplier: 3.9,
    friesCaught: 1290,
    solGain: "6.20 SOL",
    badge: "🚀",
    createdAt: new Date(Date.now() - 36000000).toISOString(),
  },
  {
    id: "lead-7",
    player: "MoonFryer99",
    title: "Fry Cook",
    fighter: "Cyber-Crunch Frepe",
    score: 14200,
    multiplier: 3.2,
    friesCaught: 980,
    solGain: "4.15 SOL",
    badge: "🔥",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "lead-8",
    player: "Bot_0xSoggy",
    title: "Dumped",
    fighter: "Trench Cook Frepe",
    score: 0,
    multiplier: 0.0,
    friesCaught: 12,
    solGain: "-2.40 SOL",
    badge: "🤖",
    createdAt: new Date(Date.now() - 50400000).toISOString(),
  },
];

const INITIAL_DUELS: DuelRoom[] = [
  {
    id: "duel-0420",
    creator: "SolanaSalty",
    wagerSol: 1.0,
    potSol: 2.0,
    status: "open",
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "duel-0777",
    creator: "PepeTrenchGod",
    wagerSol: 0.5,
    potSol: 1.0,
    status: "open",
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "duel-0101",
    creator: "DegenChef",
    wagerSol: 0.1,
    potSol: 0.2,
    status: "open",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "duel-0888",
    creator: "DiamondCrisp",
    wagerSol: 5.0,
    potSol: 10.0,
    status: "open",
    createdAt: new Date(Date.now() - 2400000).toISOString(),
  },
];

// In-memory data store with file backup
const DATA_DIR = path.join(process.cwd(), "data");
const LEADERBOARD_FILE = path.join(DATA_DIR, "leaderboard.json");
const DUELS_FILE = path.join(DATA_DIR, "duels.json");

function loadData<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  } catch (err) {
    console.error(`Error loading file ${filePath}:`, err);
    return fallback;
  }
}

function saveData<T>(filePath: string, data: T) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error saving file ${filePath}:`, err);
  }
}

let leaderboard = loadData<LeaderboardEntry[]>(LEADERBOARD_FILE, INITIAL_LEADERBOARD);
let duels = loadData<DuelRoom[]>(DUELS_FILE, INITIAL_DUELS);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // GET Leaderboard
  app.get("/api/leaderboard", (req, res) => {
    // Sort descending by score
    const sorted = [...leaderboard]
      .sort((a, b) => b.score - a.score)
      .map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      }));
    res.json(sorted);
  });

  // POST new score to leaderboard
  app.post("/api/leaderboard", (req, res) => {
    const { player, fighter, score, multiplier, friesCaught, title } = req.body;
    if (!player || typeof score !== "number") {
      return res.status(400).json({ error: "Missing required player or score" });
    }

    const solMultiplier = (multiplier || 1) * 0.1;
    const solGainFormatted = `${(Math.min(99.9, solMultiplier * (score / 2000))).toFixed(2)} SOL`;

    const newEntry: LeaderboardEntry = {
      id: "lead-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      player: String(player).trim().substring(0, 24),
      title: title || "Fry Runner",
      fighter: fighter || "Wall Street Frepe",
      score: Math.floor(score),
      multiplier: Number(multiplier) || 1.0,
      friesCaught: Number(friesCaught) || 0,
      solGain: solGainFormatted,
      badge: score > 50000 ? "👑" : score > 25000 ? "🔥" : "🍟",
      createdAt: new Date().toISOString(),
    };

    leaderboard.push(newEntry);
    // Keep top 100
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 100) {
      leaderboard = leaderboard.slice(0, 100);
    }
    saveData(LEADERBOARD_FILE, leaderboard);

    const rank = leaderboard.findIndex((e) => e.id === newEntry.id) + 1;
    res.json({ success: true, entry: { ...newEntry, rank } });
  });

  // GET Duels
  app.get("/api/duels", (req, res) => {
    res.json(duels);
  });

  // POST create Duel
  app.post("/api/duels", (req, res) => {
    const { creator, wagerSol } = req.body;
    const wager = Number(wagerSol) || 0.5;
    const newDuel: DuelRoom = {
      id: "duel-" + Math.floor(1000 + Math.random() * 9000),
      creator: (creator || "AnonymousDegen").substring(0, 20),
      wagerSol: wager,
      potSol: wager * 2,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    duels.unshift(newDuel);
    saveData(DUELS_FILE, duels);
    res.json(newDuel);
  });

  // POST accept Duel
  app.post("/api/duels/:id/accept", (req, res) => {
    const { id } = req.params;
    const { opponent } = req.body;
    const duel = duels.find((d) => d.id === id);
    if (!duel) {
      return res.status(404).json({ error: "Duel not found" });
    }
    duel.opponent = opponent || "You";
    duel.status = "active";
    saveData(DUELS_FILE, duels);
    res.json(duel);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🍟 FREPE Server running on port ${PORT}`);
  });
}

startServer();
