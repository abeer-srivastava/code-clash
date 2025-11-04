"use client";
import { NavBarComp } from "./components/Navbar";
import { useUserStore } from "@/store/useUserStore";
import Background from "@/components/Background";
import Hero from "./components/Landing/Hero";
import Dashboard from "./components/Dashboard/Dashboard";
export default function Home() {
  const user=useUserStore((state)=>state.user);
  console.log(user?.displayName,user?.email);
  return (

   <div className="relative flex flex-col min-h-screen w-screen">
      <NavBarComp></NavBarComp>
      <Background>
        <div className="relative z-10 pt-20">
          {user ? (
            <Dashboard />
          ):(
            <Hero></Hero>
          )}
        </div>
      </Background>
    </div>
  );
}
