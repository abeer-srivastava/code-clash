"use client";
import { NavBarComp } from "./components/Navbar";
import { useUserStore } from "@/store/useUserStore";
import Background from "@/components/Background";
import Link from "next/link";
import { Button } from "../components/ui/button";
import Hero from "./components/Hero";
export default function Home() {
  const user=useUserStore((state)=>state.user);
  console.log(user?.displayName,user?.email);
  return (

   <div className="relative flex flex-col min-h-screen w-screen">
   <NavBarComp></NavBarComp>
   <Background>
    <Hero></Hero>
   </Background>
    
   </div>
  );
}
