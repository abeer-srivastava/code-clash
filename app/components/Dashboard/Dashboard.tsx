"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Code2, BarChart3, Target, Zap, Loader2, ArrowUpRight, Swords, Wifi, WifiOff } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useSocket } from "@/lib/useSocket";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const leetcodeData = [
    { name: "Mon", rating: 1600 },
    { name: "Tue", rating: 1620 },
    { name: "Wed", rating: 1645 },
    { name: "Thu", rating: 1670 },
    { name: "Fri", rating: 1690 },
  ];
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { isConnected, sendMessage, socket } = useSocket();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "MATCH_FOUND") {
          setIsSearching(false);
          router.push(`/battle/${message.payload.roomId}`);
        } else if (message.type === "ERROR") {
          console.error("Matchmaking Error:", message.payload);
          setIsSearching(false);
        }
      } catch (e) {
        console.error("Error parsing socket message:", e);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, router]);

  // Reset searching if socket disconnects
  useEffect(() => {
    if (!isConnected) {
      setIsSearching(false);
    }
  }, [isConnected]);

  // Timeout for searching (optional but recommended)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSearching) {
      timeout = setTimeout(() => {
        setIsSearching(false);
        console.warn("Matchmaking timed out");
      }, 30000); // 30 seconds timeout
    }
    return () => clearTimeout(timeout);
  }, [isSearching]);

  const handleStartMatch = () => {
    if (isConnected) {
      setIsSearching(true);
      sendMessage("JOIN_MATCHMAKING", { elo: 1200 });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8 space-y-10 font-heading">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-8 border-black pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
            OPERATOR: <span className="text-main drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{user?.displayName?.split(' ')[0] || "USER"}</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xl font-bold uppercase tracking-widest text-muted-foreground">
              Status: 
            </span>
            <div className={`flex items-center gap-2 px-3 py-1 border-2 border-black font-black text-sm uppercase ${isConnected ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" /> ONLINE // READY
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" /> OFFLINE // DISCONNECTED
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            variant="default"
            className="h-16 px-10 text-xl font-black uppercase tracking-widest grow md:grow-0" 
            onClick={handleStartMatch}
            disabled={!isConnected || isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
                SEARCHING...
              </>
            ) : (
              <>
                <Swords className="mr-2 h-6 w-6" /> QUICK MATCH
              </>
            )}
          </Button>
          <Button 
            variant="neutral" 
            className="h-16 px-10 text-xl font-black uppercase tracking-widest grow md:grow-0 bg-white text-black border-4 border-black"
            onClick={() => router.push("/problems")}
          >
            PRACTICE
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[{
          label: 'MATCHES', value: '132', icon: Users, color: 'bg-white'
        },{
          label: 'WINS', value: '16', icon: Trophy, color: 'bg-main'
        },{
          label: 'LOSSES', value: '11', icon: Zap, color: 'bg-red-400'
        },{
          label: 'STREAK', value: '5', icon: Target, color: 'bg-cyan-400'
        },{
          label: 'WIN RATE', value: '12%', icon: BarChart3, color: 'bg-green-400'
        }].map((s, idx) => (
          <div key={idx} className={`border-4 border-black p-6 shadow-shadow ${s.color} hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-black`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-tighter text-black/60">{s.label}</span>
              <s.icon className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-black">{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 border-4 border-black bg-white shadow-shadow p-8 text-black">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black uppercase flex items-center gap-2 text-black">
              <Code2 className="text-main w-8 h-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" /> RATING PROGRESSION
            </h3>
            <div className="bg-black text-white px-4 py-1 text-xs font-black uppercase tracking-widest">
              LIVE FEED
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leetcodeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={{ stroke: '#000', strokeWidth: 4 }} 
                  tick={{ fill: '#000', fontWeight: 'bold' }}
                />
                <YAxis 
                  axisLine={{ stroke: '#000', strokeWidth: 4 }}
                  tick={{ fill: '#000', fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '4px solid #000', 
                    borderRadius: '0px',
                    color: '#000',
                    fontWeight: 'bold'
                  }} 
                  itemStyle={{ color: '#000' }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="rating" 
                  stroke="#FFBF00" 
                  strokeWidth={6} 
                  dot={{ r: 8, fill: '#000', strokeWidth: 2, stroke: '#FFBF00' }} 
                  activeDot={{ r: 12, fill: '#FFBF00', stroke: '#000', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-8">
          <div className="border-4 border-black bg-main p-8 shadow-shadow text-black">
            <h3 className="text-2xl font-black uppercase flex items-center gap-2 mb-6 text-black">
              <Trophy className="w-8 h-8 text-black" /> LEADERBOARD
            </h3>
            <div className="space-y-4">
              {[
                { name: "RISHAV", rank: 1, elo: 1780 },
                { name: "ANANYA", rank: 2, elo: 1720 },
                { name: "YOU", rank: 142, elo: 1450, highlight: true }
              ].map((p, i) => (
                <div key={i} className={`flex justify-between items-center p-3 border-2 border-black ${p.highlight ? 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black' : 'bg-transparent text-black'}`}>
                  <span className="font-black">#{p.rank} {p.name}</span>
                  <span className="font-black bg-black text-white px-2 py-0.5 text-xs">{p.elo}</span>
                </div>
              ))}
            </div>
            <Button variant="neutral" className="w-full mt-6 font-black uppercase border-2 border-black bg-white text-black" onClick={() => router.push("/leaderboard")}>VIEW ALL</Button>
          </div>

          <div className="border-4 border-black bg-cyan-400 p-8 shadow-shadow text-black">
            <h3 className="text-2xl font-black uppercase flex items-center gap-2 mb-6 text-black">
              <Zap className="w-8 h-8 text-black" /> ACTIVITY
            </h3>
            <div className="space-y-3 font-bold text-sm text-black">
              <p className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-black" /> Won vs @rohan (+12 XP)</p>
              <p className="flex items-center gap-2 opacity-60"><ArrowUpRight className="w-4 h-4 text-black" /> Lost vs @ananya (-8 XP)</p>
              <p className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-black" /> Solved "Two Sum" (Easy)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
