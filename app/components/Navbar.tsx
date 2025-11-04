"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Home, User, Briefcase, NotebookText, 
  Swords, Globe, Codesandbox, Menu, X, LogIn, UserPlus 
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function NavBarComp() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clearUser } = useUserStore();
  const user=useUserStore((state)=>state.user);
  const router=useRouter();
  console.log(user);
  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about", icon: User },
    { name: "Activity", url: "/activity", icon: Briefcase },
    { name: "Problems", url: "/problems", icon: NotebookText },
    { name: "Competitions", url: "/competitions", icon: Swords },
    { name: "Leaderboard", url: "/leaderboard", icon: Globe },
  ];

  return (
    <nav className="w-full bg-gradient-to-r from-[#060502] to-[#120c06] shadow-md fixed top-0 left-0 z-50 code-editor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between  items-center py-4 h-16">
          <div className="flex items-center space-x-2 mr-2 pr-2">
            <Codesandbox className="w-8 h-8 text-amber-600 mr-1.5" />
            <h1 className="text-2xl font-bold text-amber-600">code-clash</h1>
          </div>

          
          <div className="hidden md:flex space-x-6 items-center text-amber-300">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                className="flex items-center space-x-1 text-amber-700 hover:text-amber-600 transition"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Search bar */}
            <input
              type="text"
              placeholder="Search problems..."
              className="px-3 py-1 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            {/* Auth Buttons */}
            <div className="flex space-x-3">
            {user ?<Button 
            className="flex items-center px-3 py-1 rounded-md border hover:bg-amber-200 transition"
            onClick={async ()=>{
              await signOut(auth);
              clearUser();
            }}
            >
                <LogIn className="w-4 h-4 mr-1" /> SignOut
              </Button>:
              <Button 
              className="flex items-center px-3 py-1 rounded-md bg-amber-600 text-black hover:bg-amber-700 transition"
              onClick={()=>{router.replace("/signin")}}
              >
                <UserPlus className="w-4 h-4 mr-1" />SignIn
              </Button>}
            </div>
          </div>

          <div className="md:hidden">
            <Button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-3 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.url}
              className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}

          <input
            type="text"
            placeholder="Search problems..."
            className="w-full px-3 py-1 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="flex space-x-3">
            <Button className="flex items-center w-1/2 justify-center px-3 py-1 rounded-md border hover:bg-gray-100 transition">
              <LogIn className="w-4 h-4 mr-1" /> Login
            </Button>
            <Button  className="flex items-center w-1/2 justify-center px-3 py-1 rounded-md bg-amber-600 text-white hover:bg-amber-800 transition">
              <UserPlus className="w-4 h-4 mr-1" /> Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
