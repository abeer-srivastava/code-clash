"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Home, User, Briefcase, NotebookText, 
  Swords, Globe, Codesandbox, Menu, X, LogIn, UserPlus, LogOut
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function NavBarComp() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clearUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const navItems = [
    { name: "ARENA", url: "/competitions", icon: Swords },
    { name: "PROBLEMS", url: "/problems", icon: NotebookText },
    { name: "RANKINGS", url: "/leaderboard", icon: Globe },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    clearUser();
    router.push("/");
  };

  return (
    <nav className="w-full bg-background border-b-4 border-border fixed top-0 left-0 z-50 font-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-main border-2 border-border p-1 shadow-shadow group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
              <Codesandbox className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-foreground">
              CODE<span className="text-main">CLASH</span>
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <div className="flex items-center space-x-1 mr-4">
               <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <span className="text-xs font-black text-red-600 uppercase">Live Matches</span>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                className="text-sm font-black uppercase tracking-widest hover:text-main transition-colors border-b-2 border-transparent hover:border-main"
              >
                {item.name}
              </Link>
            ))}

            <div className="h-8 w-[2px] bg-border mx-2"></div>

            {/* Auth Buttons */}
            <div className="flex space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Logged in as</span>
                    <span className="text-xs font-black uppercase">{user.displayName || "User"}</span>
                  </div>
                  <Button 
                    variant="reverse"
                    size="sm"
                    className="h-10 px-4 uppercase font-black"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" /> Exit
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default"
                  className="h-10 px-6 uppercase font-black tracking-widest"
                  onClick={() => router.push("/signin")}
                >
                  <UserPlus className="w-4 h-4" /> Enter Arena
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="neutral"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="border-2 border-border shadow-shadow"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b-4 border-border p-6 space-y-6 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.url}
              className="flex items-center space-x-4 text-xl font-black uppercase tracking-tighter hover:text-main"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          ))}
          
          <div className="pt-4 border-t-2 border-border">
            {user ? (
              <Button 
                variant="reverse" 
                className="w-full py-6 text-lg font-black uppercase"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-5 w-5" /> Sign Out
              </Button>
            ) : (
              <Button 
                variant="default" 
                className="w-full py-6 text-lg font-black uppercase"
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/signin");
                }}
              >
                <UserPlus className="mr-2 h-5 w-5" /> Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
