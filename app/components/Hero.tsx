import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";

export default function Hero(){
      const user=useUserStore((state)=>state.user);
      console.log(user?.displayName,user?.email);
    return  <main className="z-10 relative pt-24 h-full ">
        <section className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 py-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-amber-400">
              Compete. Code. Conquer.
            </h1>
            <p className="mt-4 text-base md:text-lg text-amber-100/90 max-w-2xl">
              Solve algorithmic challenges, climb the leaderboard, and join competitions in real time. Built for speed, learning, and fun.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-amber-600 hover:bg-amber-700 text-black">
                <Link href="/competitions">Join a competition</Link>
              </Button>
              <Button asChild variant="neutral" className="border-amber-500 bg-gray-950 text-amber-300 hover:bg-amber-500/10">
                <Link href="/problems">Practice problems</Link>
              </Button>
            </div>
            <div className="mt-6 text-amber-200/70 text-sm">
              Live rankings • Code in your browser • Detailed explanations
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="rounded-xl border border-amber-500/30 bg-black/10 backdrop-blur p-4 md:p-6">
              <pre className="text-amber-200 text-xs md:text-sm leading-relaxed overflow-auto">
{`// Sample challenge
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return [];
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border  border-amber-500/30 bg-black/10 backdrop-blur p-6">
              <h3 className="text-amber-300 font-semibold text-lg">Real-time Competitions</h3>
              <p className="mt-2 text-amber-100/80 text-sm">Face off in timed battles with live rankings and instant feedback.</p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-black/10 backdrop-blur p-6">
              <h3 className="text-amber-300 font-semibold text-lg">Curated Problem Sets</h3>
              <p className="mt-2 text-amber-100/80 text-sm">From beginner to expert, sharpen skills with editorials and hints.</p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-black/10 backdrop-blur p-6">
              <h3 className="text-amber-300 font-semibold text-lg">Leaderboard & Profile</h3>
              <p className="mt-2 text-amber-100/80 text-sm">Track progress, earn badges, and show up on the global board.</p>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto py-12">
          <div className="rounded-xl border border-amber-500/30 bg-black/10 backdrop-blur p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-300">Ready to enter the arena?</h2>
            <p className="mt-3 text-amber-100/80">Sign in to save your progress and compete with the community.</p>
            <div className="mt-6 flex justify-center gap-3">
              {user ? (
                <Button asChild className="bg-amber-600 hover:bg-amber-700 text-black">
                  <Link href="/competitions">Find a competition</Link>
                </Button>
              ) : (
                <Button asChild className="bg-amber-600 hover:bg-amber-700 text-black">
                  <Link href="/signin">Sign in to get started</Link>
                </Button>
              )}
              <Button asChild variant="neutral" className="border-amber-500 bg-gray-950 text-amber-300 hover:bg-amber-500/10">
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto py-10 text-amber-200/70 text-sm">
          <div className="flex justify-between flex-col md:flex-row gap-4">
            <span>© {new Date().getFullYear()} code-clash</span>
            <div className="flex gap-4">
              <Link href="/problems" className="hover:text-amber-300">Problems</Link>
              <Link href="/competitions" className="hover:text-amber-300">Competitions</Link>
              <Link href="/leaderboard" className="hover:text-amber-300">Leaderboard</Link>
            </div>
          </div>
        </footer>
      </main>
}