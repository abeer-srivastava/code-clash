"use client";

import { NavBarComp } from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search, Filter, Code2, CheckCircle2, Circle, Clock, Zap, Target, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockProblems = [
   { id: 1, title: "Two Sum", difficulty: "EASY", solved: true, category: "ARRAYS", accuracy: "98%", points: 100 },
   { id: 2, title: "Longest Substring", difficulty: "MEDIUM", solved: false, category: "STRINGS", accuracy: "72%", points: 250 },
   { id: 3, title: "Median of Two Arrays", difficulty: "HARD", solved: false, category: "ALGORITHMS", accuracy: "45%", points: 500 },
   { id: 4, title: "Reverse Integer", difficulty: "EASY", solved: true, category: "MATH", accuracy: "92%", points: 100 },
   { id: 5, title: "Container With Water", difficulty: "MEDIUM", solved: true, category: "TWO POINTERS", accuracy: "68%", points: 250 },
   { id: 6, title: "Regular Expression", difficulty: "HARD", solved: false, category: "DP", accuracy: "31%", points: 500 },
   { id: 7, title: "Merge K Lists", difficulty: "HARD", solved: false, category: "HEAPS", accuracy: "52%", points: 500 },
   { id: 8, title: "Valid Parentheses", difficulty: "EASY", solved: true, category: "STACKS", accuracy: "95%", points: 100 },
];

export default function ProblemsPage() {
   const [searchTerm, setSearchTerm] = useState("");

   const difficultyStyles = {
      EASY: "bg-green-400 text-black",
      MEDIUM: "bg-yellow-400 text-black",
      HARD: "bg-red-400 text-black",
   };

   return (
      <div className="min-h-screen bg-background font-heading">
         <NavBarComp />

         <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="border-8 border-black bg-main p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] mb-12 relative overflow-hidden text-black">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Code2 size={300} className="text-black" />
               </div>

               <div className="relative z-10">
                  <div className="bg-white text-black inline-block px-4 py-1 text-sm font-black uppercase mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                     Training Grounds
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4 text-black">
                     PROBLEM <span className="bg-white px-2 border-4 border-black inline-block transform -rotate-1">ARCHIVE</span>
                  </h1>
                  <p className="text-2xl font-bold uppercase tracking-tight text-black/80 max-w-2xl">
                     Sharpen your blade. Solve challenges across 20+ categories and level up your ELO.
                  </p>
               </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12">
               <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black w-6 h-6" />
                  <input
                     type="text"
                     placeholder="SEARCH_BY_TITLE_OR_TAG..."
                     className="w-full h-20 pl-16 pr-6 border-4 border-black bg-white font-mono font-bold text-xl focus:outline-none focus:bg-main transition-colors text-black placeholder:text-black/30 shadow-shadow"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="flex gap-4">
                  <Button variant="neutral" className="h-20 px-8 text-xl font-black uppercase border-4 border-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                     DIFFICULTY
                  </Button>
                  <Button variant="neutral" className="h-20 px-8 text-xl font-black uppercase border-4 border-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                     CATEGORY
                  </Button>
                  <Button className="h-20 px-8 text-xl font-black uppercase bg-cyan-400 text-black border-4 border-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                     <Zap className="mr-2 h-6 w-6" /> SURPRISE ME
                  </Button>
               </div>
            </div>

            {/* Problems Grid/List */}
            <div className="grid grid-cols-1 gap-6">
               {mockProblems.map((problem) => (
                  <div key={problem.id} className="border-4 border-black bg-white shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all group overflow-hidden">
                     <div className="flex flex-col md:flex-row md:items-center">
                        {/* Status Indicator */}
                        <div className={`md:w-20 h-16 md:h-auto flex items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black ${problem.solved ? 'bg-green-400' : 'bg-secondary-background opacity-50'}`}>
                           {problem.solved ? <CheckCircle2 className="w-8 h-8 text-black" /> : <Circle className="w-8 h-8 text-black/20" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-black bg-black text-white px-2 py-0.5 tracking-widest italic">#{problem.id}</span>
                                 <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">{problem.category}</span>
                              </div>
                              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black group-hover:text-main transition-colors">
                                 {problem.title}
                              </h3>
                           </div>

                           <div className="flex flex-wrap items-center gap-4">
                              <div className={`px-4 py-1 border-2 border-black font-black text-sm uppercase ${difficultyStyles[problem.difficulty as keyof typeof difficultyStyles]}`}>
                                 {problem.difficulty}
                              </div>
                              <div className="flex items-center gap-2 bg-secondary-background border-2 border-black px-4 py-1">
                                 <Target className="w-4 h-4 text-black" />
                                 <span className="font-black text-sm text-black">{problem.accuracy} ACC</span>
                              </div>
                              <div className="flex items-center gap-2 bg-black text-white px-4 py-1 border-2 border-black">
                                 <Star className="w-4 h-4 text-main" />
                                 <span className="font-black text-sm">{problem.points} PTS</span>
                              </div>
                              <Button asChild className="h-12 px-8 font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                 <Link href={`/battle/practice-${problem.id}`}>SOLVE_NOW</Link>
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Pagination/Load More */}
            <div className="mt-16 flex justify-center">
               <Button variant="neutral" className="h-16 px-12 text-xl font-black uppercase border-4 border-black shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                  LOAD_MORE_CHALLENGES
               </Button>
            </div>
         </main>
      </div>
   );
}
