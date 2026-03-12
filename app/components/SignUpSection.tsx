import { Codesandbox } from "lucide-react";

export default function SignUpSection() {
  return (
    <div className="hidden md:flex w-2/5 min-h-screen bg-main border-r-8 border-black justify-center items-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border-4 border-black rotate-12 opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 border-8 border-black -rotate-45 opacity-10"></div>
      
      <div className="flex flex-col justify-center items-center text-center px-12 z-10">
        <div className="bg-white border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-3">
          <Codesandbox className="w-24 h-24 text-black" />
        </div>
        
        <h1 className="text-7xl font-black uppercase tracking-tighter text-black leading-none mb-4 italic">
          CODE<br/>CLASH
        </h1>
        
        <div className="bg-black text-white px-4 py-1 text-xs font-black uppercase tracking-[0.3em] mb-8">
          EST. 2026 // PROTOCAL_v1
        </div>
        
        <p className="text-xl font-bold uppercase tracking-tight text-black/80 max-w-[280px]">
          Join the elite circle of competitive developers.
        </p>
        
        <div className="mt-12 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3 h-3 bg-black"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
