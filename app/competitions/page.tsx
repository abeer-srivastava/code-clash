"use client";
import Background from "@/components/Background";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NavBarComp } from "../components/Navbar";
import Shuffle from "@/components/Shuffle";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Swords, Plus, Users, Zap, Terminal, X } from "lucide-react";

export default function Competition() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "join">("create");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const openModal = (type: "create" | "join"): void => {
    setMode(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRoomId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      try {
        const response = await api.post("/room", { roomName: roomId });
        const newId = response.data?.roomSlug ?? response.data?.roomId ?? response.data?.id;
        if (newId) router.replace(`/battle/${newId}`);
      } catch (error: any) {
        if (error?.response?.status === 409 && error.response.data?.roomSlug) {
          router.replace(`/battle/${error.response.data.roomSlug}`);
        } else {
          console.error("Error creating room:", error);
        }
      }
    } else {
      try {
        const response = await api.get(`/room/${roomId}`);
        if (response.data) router.replace(`/battle/${roomId}`);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          alert("ARENA NOT FOUND! Check your ID.");
        } else {
          router.replace(`/battle/${roomId}`);
        }
      }
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-background font-heading">
      <NavBarComp />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="border-8 border-black bg-main p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] mb-16 relative overflow-hidden text-black">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Swords size={350} className="text-black" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="bg-black text-white inline-block px-4 py-1 text-sm font-black uppercase mb-6 tracking-widest">
              Live Tournament Access
            </div>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 text-black">
              BATTLE <span className="bg-white px-2 border-4 border-black inline-block transform rotate-2">GROUND</span>
            </h1>

            <div className="text-2xl font-bold uppercase tracking-tight text-black/80 mb-10 max-w-xl">
              COMPETE . CODE . CONQUER
            </div>

            <div className="flex flex-wrap gap-6">
              <Button
                onClick={() => openModal("create")}
                className="h-20 px-10 text-2xl font-black uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all bg-black text-white border-4 border-black"
              >
                <Plus className="mr-2 h-8 w-8" /> Create Arena
              </Button>
              <Button
                variant="neutral"
                onClick={() => openModal("join")}
                className="h-20 px-10 text-2xl font-black uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all bg-white text-black border-4 border-black"
              >
                <Users className="mr-2 h-8 w-8" /> Join Arena
              </Button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "1v1 DUELS", desc: "Classic head-to-head algorithm battles.", color: "bg-cyan-400" },
            { title: "TEAM CLASH", desc: "Collaborate to solve complex systems.", color: "bg-red-400" },
            { title: "BLITZ MODE", desc: "5-minute sprints for maximum efficiency.", color: "bg-white" }
          ].map((item, i) => (
            <div key={i} className={`border-4 border-black p-8 shadow-shadow ${item.color} text-black`}>
              <Zap className="w-10 h-10 mb-6 text-black" />
              <h3 className="text-2xl font-black uppercase mb-2 text-black">{item.title}</h3>
              <p className="font-bold text-black/70 uppercase text-sm tracking-tighter">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Neobrutalist Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-grayscale-[0.5] p-4 z-[100]">
          <div className="bg-white border-8 border-black p-10 max-w-md w-full shadow-[20px_20px_0px_0px_rgba(255,191,0,1)] animate-in zoom-in-95 duration-200 text-black">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-black">
                {mode === "create" ? "NEW_ARENA" : "JOIN_COMBAT"}
              </h2>
              <Button variant="neutral" size="icon" onClick={closeModal} className="border-2 border-black text-black bg-white">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black/60">IDENTIFIER_KEY</label>
                <input
                  type="text"
                  placeholder={mode === "join" ? "ARENA_ID_REQUIRED" : "OPTIONAL_CUSTOM_ID"}
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full p-4 border-4 border-black bg-secondary-background font-mono font-bold text-lg focus:outline-none focus:bg-main transition-colors text-black placeholder:text-black/30"
                  required={mode === "join"}
                />
              </div>

              <div className="bg-black p-4 text-green-500 font-mono text-xs">
                <p>{">"} INITIALIZING_PROTOCOL...</p>
                <p>{">"} WAITING_FOR_HANDSHAKE</p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 h-16 text-xl font-black uppercase tracking-widest bg-black text-white border-4 border-black"
                >
                  {mode === "create" ? "START_MATCH" : "ENTER_ROOM"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
