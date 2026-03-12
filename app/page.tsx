"use client";
import { NavBarComp } from "./components/Navbar";
import { useUserStore } from "@/store/useUserStore";
import Hero from "./components/Landing/Hero";
import Dashboard from "./components/Dashboard/Dashboard";

export default function Home() {
  const user = useUserStore((state) => state.user);
  
  return (
   <div className="relative min-h-screen bg-background scanline">
      <NavBarComp />
      <div className="relative z-10 pt-20">
        {user ? (
          <Dashboard />
        ):(
          <Hero />
        )}
      </div>
    </div>
  );
}
