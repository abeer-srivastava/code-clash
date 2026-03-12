"use client";

import { NavBarComp } from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Star, ArrowUpRight, Search, Filter, Swords } from "lucide-react";
import { useState } from "react";

const mockLeaderboard = [
  { rank: 1, name: "ByteMaster", elo: 2840, wins: 412, streak: 15, avatar: "BM" },
  { rank: 2, name: "LogicGhost", elo: 2715, wins: 385, streak: 8, avatar: "LG" },
  { rank: 3, name: "SyntaxError", elo: 2690, wins: 352, streak: 4, avatar: "SE" },
  { rank: 4, name: "NullPointer", elo: 2540, wins: 310, streak: 0, avatar: "NP" },
  { rank: 5, name: "BinaryBard", elo: 2420, wins: 298, streak: 2, avatar: "BB" },
  { rank: 6, name: "CodeCrusher", elo: 2380, wins: 275, streak: 1, avatar: "CC" },
  { rank: 7, name: "AlgoRhythm", elo: 2310, wins: 260, streak: 0, avatar: "AR" },
  { rank: 8, name: "DataDaemon", elo: 2250, wins: 245, streak: 5, avatar: "DD" },
  { rank: 9, name: "PixelPunk", elo: 2190, wins: 230, streak: 3, avatar: "PP" },
  { rank: 10, name: "GitGud", elo: 2150, wins: 215, streak: 0, avatar: "GG" },
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background font-heading">
      <NavBarComp />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="border-8 border-black bg-white p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] mb-12 relative overflow-hidden text-black">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Trophy size={300} className="text-black" />
          </div>
          
          <div className="relative z-10">
            <div className="bg-main text-black inline-block px-4 py-1 text-sm font-black uppercase mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Global Rankings
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4 text-black italic">
              HALL OF <span className="text-main drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">FAME</span>
            </h1>
            <p className="text-2xl font-bold uppercase tracking-tight text-black/60 max-w-2xl">
              The top 1% of coders in the arena. Where logic meets legends.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black w-6 h-6" />
            <input 
              type="text" 
              placeholder="SEARCH_OPERATOR_BY_TAG..."
              className="w-full h-20 pl-16 pr-6 border-4 border-black bg-white font-mono font-bold text-xl focus:outline-none focus:bg-main transition-colors text-black placeholder:text-black/30 shadow-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="h-20 px-10 text-xl font-black uppercase tracking-widest bg-cyan-400 text-black border-4 border-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
            <Filter className="mr-2 h-6 w-6" /> Filters
          </Button>
        </div>

        {/* Podium Section (Top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 border-4 border-black bg-white p-8 shadow-shadow flex flex-col items-center text-black">
            <div className="w-24 h-24 border-4 border-black bg-secondary-background flex items-center justify-center font-black text-3xl mb-4 relative">
              {mockLeaderboard[1].avatar}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-slate-400 border-4 border-black flex items-center justify-center text-white text-xl">2</div>
            </div>
            <h3 className="text-2xl font-black uppercase">{mockLeaderboard[1].name}</h3>
            <p className="text-main font-black text-xl mb-4 italic">{mockLeaderboard[1].elo} ELO</p>
            <div className="w-full h-2 bg-black/10 border-2 border-black">
              <div className="h-full bg-slate-400" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="order-1 md:order-2 border-8 border-black bg-main p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-black transform md:scale-110">
            <div className="w-32 h-32 border-4 border-black bg-white flex items-center justify-center font-black text-4xl mb-6 relative">
              {mockLeaderboard[0].avatar}
              <Trophy className="absolute -top-8 -right-8 w-16 h-16 text-black drop-shadow-[4px_4px_0px_white]" />
              <div className="absolute -bottom-4 bg-black text-white px-4 py-1 font-black italic">CHAMPION</div>
            </div>
            <h3 className="text-3xl font-black uppercase">{mockLeaderboard[0].name}</h3>
            <p className="text-black font-black text-2xl mb-6 italic">{mockLeaderboard[0].elo} ELO</p>
            <div className="w-full h-4 bg-black/20 border-2 border-black">
              <div className="h-full bg-black" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 md:order-3 border-4 border-black bg-white p-8 shadow-shadow flex flex-col items-center text-black">
            <div className="w-24 h-24 border-4 border-black bg-secondary-background flex items-center justify-center font-black text-3xl mb-4 relative">
              {mockLeaderboard[2].avatar}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-amber-700 border-4 border-black flex items-center justify-center text-white text-xl">3</div>
            </div>
            <h3 className="text-2xl font-black uppercase">{mockLeaderboard[2].name}</h3>
            <p className="text-main font-black text-xl mb-4 italic">{mockLeaderboard[2].elo} ELO</p>
            <div className="w-full h-2 bg-black/10 border-2 border-black">
              <div className="h-full bg-amber-700" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="border-8 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden text-black">
          <div className="bg-black text-white p-6 grid grid-cols-12 gap-4 font-black uppercase tracking-widest text-sm">
            <div className="col-span-1">RK</div>
            <div className="col-span-5">OPERATOR</div>
            <div className="col-span-2 text-center">ELO</div>
            <div className="col-span-2 text-center">WINS</div>
            <div className="col-span-2 text-center">STREAK</div>
          </div>
          <div className="divide-y-4 divide-black">
            {mockLeaderboard.slice(3).map((player) => (
              <div key={player.rank} className="p-6 grid grid-cols-12 gap-4 items-center hover:bg-main/10 transition-colors font-bold group">
                <div className="col-span-1 font-black text-2xl">#{player.rank}</div>
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-12 h-12 border-2 border-black bg-secondary-background flex items-center justify-center font-black text-sm group-hover:bg-main transition-colors">
                    {player.avatar}
                  </div>
                  <span className="text-xl uppercase tracking-tighter">{player.name}</span>
                </div>
                <div className="col-span-2 text-center text-2xl font-black">{player.elo}</div>
                <div className="col-span-2 text-center text-xl">{player.wins}</div>
                <div className="col-span-2 text-center">
                  <span className={`px-3 py-1 border-2 border-black font-black text-sm italic ${player.streak > 0 ? 'bg-green-400' : 'bg-red-400'}`}>
                    {player.streak > 0 ? `+${player.streak}` : 'OFF'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 p-12 border-4 border-black bg-black text-center shadow-[12px_12px_0px_0px_rgba(255,191,0,1)]">
           <h2 className="text-4xl font-black text-white uppercase italic mb-6">Want to see your name here?</h2>
           <Button className="h-16 px-12 text-2xl font-black uppercase tracking-tighter bg-main text-black border-4 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
              <Swords className="mr-2 h-6 w-6" /> Find Match
           </Button>
        </div>
      </main>
    </div>
  );
}
