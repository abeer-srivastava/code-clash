"use client";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import TextType from '@/components/TextType';
import { Terminal, Swords, Target, Zap } from "lucide-react";

export default function Hero(){
    const user = useUserStore((state) => state.user);
    
    return (
      <main className="z-10 relative pt-24 min-h-screen bg-background text-foreground">
        <section className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 py-16">
          <div className="flex-1 space-y-8">
            <div className="inline-block bg-main border-2 border-border px-4 py-1 shadow-shadow mb-4">
              <span className="text-sm font-black uppercase tracking-widest text-black">Season 1: Zero Day</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-none">
              <span className="block">CLASH.</span>
              <span className="block text-main drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">CODE.</span>
              <span className="block">CONQUER.</span>
            </h1>

            <p className="text-xl md:text-2xl font-bold text-foreground/80 max-w-xl leading-tight border-l-8 border-main pl-6">
              The ultimate high-stakes arena for competitive developers. No fluff. Just logic.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="h-16 px-8 text-xl font-black uppercase tracking-tighter bg-black text-white border-4 border-black shadow-shadow">
                <Link href="/competitions">
                  <Swords className="mr-2 h-6 w-6" /> Join Arena
                </Link>
              </Button>
              <Button asChild variant="neutral" size="lg" className="h-16 px-8 text-xl font-black uppercase tracking-tighter bg-white text-black border-4 border-black shadow-shadow">
                <Link href="/problems">
                  Practice Mode
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 border-2 border-black bg-main shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                ))}
              </div>
              <p className="text-sm font-black uppercase tracking-tighter">
                <span className="text-main">2,400+</span> Coders active now
              </p>
            </div>
          </div>

          {/* Terminal UI */}
          <div className="flex-1 w-full lg:max-w-xl">
            <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-black p-3 border-b-4 border-black flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 border border-black" />
                  <div className="w-3 h-3 bg-yellow-500 border border-black" />
                  <div className="w-3 h-3 bg-green-500 border border-black" />
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> solution.js
                </span>
                <div className="w-10" />
              </div>
              <div className="p-6 bg-[#111] font-mono text-sm md:text-base leading-relaxed overflow-auto">
                <pre className="text-green-400">
{`// ARENA CHALLENGE #402
function arenaBattle(coders, level) {
  const meta = coders.filter(c => c.rank > 900);
  
  if (meta.length > 0) {
    return "INITIATING CLASH...";
  }
  
  return "STAY SHARP.";
}

// Result: [SUCCESS]
// Execution: 0.002ms`}
                </pre>
              </div>
              <div className="bg-main p-4 border-t-4 border-black flex justify-between items-center text-black">
                <span className="text-xs font-black uppercase text-black">Tests Passed: 12/12</span>
                <div className="h-4 w-32 bg-black/20 border-2 border-black relative overflow-hidden">
                   <div className="absolute top-0 left-0 h-full w-full bg-black animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "LIVE BATTLES", desc: "Face off in 1v1 or team-based timed challenges.", icon: Zap, color: "bg-cyan-400" },
              { title: "GLOBAL RANK", desc: "Climb the ELO-based leaderboard and claim your spot.", icon: Target, color: "bg-red-400" },
              { title: "XP REWARDS", desc: "Earn tokens for every successful match and unlock gear.", icon: Swords, color: "bg-main" }
            ].map((f, i) => (
              <div key={i} className={`border-4 border-black p-8 shadow-shadow ${f.color} hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all text-black`}>
                <f.icon className="w-12 h-12 text-black mb-6" />
                <h3 className="text-2xl font-black uppercase mb-4 text-black">{f.title}</h3>
                <p className="font-bold text-black/80 uppercase tracking-tighter">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto py-12 pb-32">
          <div className="border-4 border-black bg-black p-12 text-center shadow-[16px_16px_0px_0px_#FFBF00]">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-6 italic">Enter the Arena</h2>
            <p className="text-xl text-main font-bold mb-10 max-w-2xl mx-auto uppercase tracking-tighter">
              The next global tournament starts in 04:22:15. Will you be ready?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {user ? (
                <Button asChild variant="default" className="h-16 px-12 text-2xl font-black uppercase bg-main text-black border-4 border-black shadow-shadow">
                  <Link href="/competitions">Join Tournament</Link>
                </Button>
              ) : (
                <Button asChild className="h-16 px-12 text-2xl font-black uppercase bg-main text-black border-4 border-black shadow-shadow">
                  <Link href="/signin">Create Account</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
    );
}
