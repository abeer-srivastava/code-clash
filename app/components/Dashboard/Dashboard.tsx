import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Code2, BarChart3, Target, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useUserStore } from "@/store/useUserStore";
import { use } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const leetcodeData = [
    { name: "Mon", rating: 1600 },
    { name: "Tue", rating: 1620 },
    { name: "Wed", rating: 1645 },
    { name: "Thu", rating: 1670 },
    { name: "Fri", rating: 1690 },
  ];
  const router=useRouter();
  const user=useUserStore((state)=>state.user);
  return (
    <div className="h-full flex flex-col text-amber-200 p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-300">Welcome back! {user?.displayName}</h1>
          <p className="text-sm text-amber-200/70">Compete, practice, and track your progress.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-amber-600 hover:bg-amber-700 text-black" 
          onClick={()=>router.replace("/competitions")}
          >Start Match</Button>
          <Button variant="neutral" className="bg-black border-amber-500 text-amber-300 hover:bg-amber-500/10">Practice</Button>
        </div>
      </div>

      <div className="text-xl grid grid-cols-2 md:grid-cols-5 gap-4">
        {[{
          label: 'Total Matches', value: '132', icon: Users, tint: 'text-amber-300'
        },{
          label: 'Wins', value: '16', icon: Trophy, tint: 'text-green-400'
        },{
          label: 'Losses', value: '11', icon: Zap, tint: 'text-red-400'
        },{
          label: 'Draws', value: '105', icon: Target, tint: 'text-cyan-400'
        },{
          label: 'Win Rate', value: '12.1%', icon: BarChart3, tint: 'text-purple-300'
        }].map((s, idx) => (
          <Card key={idx} className="bg-black/30 border border-amber-500/30 backdrop-blur-sm">
            <CardContent className="p-2">
              <div className="flex items-center justify-between py-1 px-2.5">
                <p className="text-xs md:text-sm text-amber-200/80 ">{s.label}</p>
                <s.icon className={`${s.tint} w-6 h-6`} />
              </div>
              <h2 className="mt-2 text-xl md:text-2xl font-bold text-amber-300 {s.tint}">{s.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-black/30 border border-amber-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-300  text-2xl " ><Code2 className="text-amber-400"/> LeetCode Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-200/80">Total Solved: <span className="font-semibold text-amber-300">230</span></p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leetcodeData}>
                  <XAxis dataKey="name" stroke="#FBBF24" />
                  <YAxis stroke="#FBBF24" />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0b0b', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#FDE68A' }} />
                  <Line type="monotone" dataKey="rating" stroke="#F59E0B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border border-amber-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-300 text-2xl "><BarChart3 className="text-amber-400"/> GFG Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-amber-200/90">
            <p>Problems Solved: <span className="font-semibold text-amber-300">190</span></p>
            <p>Practice Streak: <span className="font-semibold text-amber-300">24 days</span></p>
            <p>Ranking: <span className="font-semibold text-amber-300">Top 12%</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/30 border border-amber-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-amber-300"><Trophy className="text-amber-400"/> Leaderboard Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-amber-100">
            <div className="flex justify-between"><span>@rishav</span><span className="text-amber-300">1780</span></div>
            <div className="flex justify-between"><span>@ananya</span><span className="text-amber-300">1720</span></div>
            <div className="flex justify-between"><span>@you</span><span className="text-amber-300">1450</span></div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border border-amber-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-amber-300"><Zap className="text-amber-400"/> Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-amber-100">
            <p>🏆 Won against <span className="text-amber-300">@rohan</span> in 5 mins (DP)</p>
            <p>💀 Lost to <span className="text-amber-300">@ananya</span> (Greedy)</p>
            <p>💡 Solved on LeetCode</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
