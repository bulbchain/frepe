import React, { useState, useEffect } from "react";
import { LeaderboardEntry } from "../types";
import { X, Search, Trophy, RefreshCw, Sparkles, Award } from "lucide-react";
import { sound } from "../audio";

interface GlobalLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFighter?: () => void;
}

export const GlobalLeaderboardModal: React.FC<GlobalLeaderboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "top10" | "highrollers">("all");

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.player.toLowerCase().includes(search.toLowerCase()) ||
      e.fighter.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "top10") return (e.rank || 0) <= 10;
    if (filter === "highrollers") return e.score >= 30000;
    return true;
  });

  return (
    <div
      id="global-leaderboard-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="global-leaderboard-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#131b2e] border-4 border-black rounded-3xl w-full max-w-4xl shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-[#060e20] border-b-2 border-[#2d3449] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#facc15] text-[#3c2f00] flex items-center justify-center text-2xl font-black border-2 border-black -rotate-3">
              🏆
            </div>
            <div>
              <span className="font-mono-code text-[11px] text-[#4ae176] font-black uppercase tracking-wider block">
                OFFICIAL HALL OF CRUNCH
              </span>
              <h2 className="font-headline text-2xl sm:text-3xl uppercase text-[#ffecb9] font-black">
                GLOBAL LEADERBOARD
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-leaderboard-btn"
              onClick={fetchLeaderboard}
              className="p-2 rounded-lg bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] border border-[#2d3449] transition-colors cursor-pointer"
              title="Refresh Scores"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#facc15]" : ""}`} />
            </button>
            <button
              id="close-leaderboard-modal-btn"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#222a3d] hover:bg-[#93000a] text-[#dae2fd] border border-[#2d3449] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 bg-[#171f33] border-b border-[#2d3449] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[#facc15] text-[#3c2f00] border border-black shadow-[2px_2px_0px_#000000]"
                  : "bg-[#222a3d] text-[#dae2fd] hover:text-[#ffecb9]"
              }`}
            >
              All Scores ({entries.length})
            </button>
            <button
              onClick={() => setFilter("top10")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                filter === "top10"
                  ? "bg-[#facc15] text-[#3c2f00] border border-black shadow-[2px_2px_0px_#000000]"
                  : "bg-[#222a3d] text-[#dae2fd] hover:text-[#ffecb9]"
              }`}
            >
              Top 10 Legends
            </button>
            <button
              onClick={() => setFilter("highrollers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                filter === "highrollers"
                  ? "bg-[#facc15] text-[#3c2f00] border border-black shadow-[2px_2px_0px_#000000]"
                  : "bg-[#222a3d] text-[#dae2fd] hover:text-[#ffecb9]"
              }`}
            >
              High Rollers 🔥
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9a9078] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Chef or Fighter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-[#131b2e] border border-[#2d3449] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#ffecb9] font-mono-code outline-none focus:border-[#facc15]"
            />
          </div>
        </div>

        {/* Leaderboard Table Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#9a9078] font-mono-code text-sm">
              <RefreshCw className="w-8 h-8 animate-spin text-[#facc15]" />
              <span>FETCHING GLOBAL HIGH SCORES FROM DEEP FRYER...</span>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-16 text-center text-[#9a9078] font-mono-code text-sm">
              No crunchers found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono-code text-xs">
                <thead>
                  <tr className="text-[#9a9078] uppercase border-b border-[#2d3449] pb-2">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Player / Chef</th>
                    <th className="py-2.5 px-3">Fighter Skin</th>
                    <th className="py-2.5 px-3 text-right">Fries</th>
                    <th className="py-2.5 px-3 text-right">Mult</th>
                    <th className="py-2.5 px-3 text-right">Score</th>
                    <th className="py-2.5 px-3 text-right">Gains</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222a3d]">
                  {filteredEntries.map((e) => {
                    const isTop1 = e.rank === 1;
                    const isTop3 = (e.rank || 0) <= 3;
                    return (
                      <tr
                        key={e.id}
                        className={`hover:bg-[#171f33] transition-colors ${
                          isTop1 ? "bg-[#facc15]/10 font-bold" : ""
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-black text-xs ${
                              e.rank === 1
                                ? "bg-[#facc15] text-[#3c2f00]"
                                : e.rank === 2
                                ? "bg-[#e2e8f0] text-[#0f172a]"
                                : e.rank === 3
                                ? "bg-[#b45309] text-white"
                                : "bg-[#222a3d] text-[#9a9078]"
                            }`}
                          >
                            {e.rank}
                          </span>
                        </td>

                        {/* Player */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{e.badge || "🍟"}</span>
                            <div>
                              <span className="text-[#ffecb9] font-bold block">{e.player}</span>
                              <span className="text-[10px] text-[#9a9078]">{e.title}</span>
                            </div>
                          </div>
                        </td>

                        {/* Fighter */}
                        <td className="py-3 px-3 text-[#dae2fd]">{e.fighter}</td>

                        {/* Fries */}
                        <td className="py-3 px-3 text-right text-[#facc15] font-bold">
                          🍟 {e.friesCaught.toLocaleString()}
                        </td>

                        {/* Multiplier */}
                        <td className="py-3 px-3 text-right text-[#4ae176]">
                          {e.multiplier.toFixed(1)}x
                        </td>

                        {/* Score */}
                        <td className="py-3 px-3 text-right text-[#ffecb9] font-black text-sm">
                          {e.score.toLocaleString()}
                        </td>

                        {/* Gains */}
                        <td className="py-3 px-3 text-right text-[#4ae176] font-bold">
                          {e.solGain}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#060e20] border-t-2 border-[#2d3449] flex items-center justify-between text-xs font-mono-code text-[#9a9078]">
          <span>Synced with Global Blockchain State</span>
          <span className="text-[#facc15] font-bold">TOP CRUNCH MULTIPLIER: 18.4x</span>
        </div>
      </div>
    </div>
  );
};
