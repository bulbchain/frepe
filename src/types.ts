export interface Fighter {
  id: string;
  name: string;
  tier: string;
  tierBadgeColor: string;
  bonus: string;
  description: string;
  crunch: number;
  saltiness: number;
  specialStatName: string;
  specialStatValue: number;
  emoji: string;
  suitColor: string;
  multiplierBonus: number;
  speedBonus: number;
  jackpotChance: number;
  hasShield: boolean;
}

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
  badge?: string;
  createdAt: string;
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

export interface GameStats {
  score: number;
  friesCaught: number;
  multiplier: number;
  heatVelocity: number;
  saltinessLevel: number;
  combo: number;
  highestCombo: number;
  solGained: number;
}
