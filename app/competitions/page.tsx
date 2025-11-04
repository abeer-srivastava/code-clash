"use client";
import Background from "@/components/Background";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NavBarComp } from "../components/Navbar";
import Shuffle from "@/components/Shuffle";

export default function Competition() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(""); // "create" or "join"
  const [roomId, setRoomId] = useState("");

  type RoomMode = "create" | "join";

  const openModal = (type: RoomMode): void => {
    setMode(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRoomId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      console.log("Creating Room with ID:", roomId || "(auto-generate)");
    } else {
      console.log("Joining Room with ID:", roomId);
    }
    closeModal();
  };

  return (
    <Background>
        <NavBarComp></NavBarComp>
        <div className="z-50 flex flex-col items-center justify-center min-h-screen text-amber-300">
        <div className=" h-5/4 w-lg flex flex-col items-center justify-center bg-black/10 border border-[#BA8B02] backdrop-blur-md bg-opacity-10 p-8 rounded-xl">
       
          <Shuffle
            text="COMPETE  CODE  CONQUER"
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
          />
        
        <p className="text-lg mb-8 text-amber-100 font-semibold">
          Get Match up with other coders and solve algorithmic challenges in real time.
        </p>
        <div>
        <Button
          onClick={() => openModal("create")}
          className="m-1 bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded">
          Create a Room
        </Button>
        <Button
          onClick={() => openModal("join")}
          className="m-1 bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded">
          Join a Room
        </Button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-lg bg-opacity-60 p-4 z-50">
          <div className="bg-black p-6 rounded-xl w-80 shadow-xl border border-[#BA8B02]">
            <h2 className="text-xl mb-4 font-semibold text-[#BA8B02]">
              {mode === "create" ? "Create Room" : "Join Room"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              {mode === "join" && (
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="p-2 rounded bg-black  border border-[#BA8B02] text-white focus:outline-none focus:ring-2 focus:ring-[#BA8B02]"
                  required
                />
              )}

              {mode === "create" && (
                <input
                  type="text"
                  placeholder="Optional: Enter Custom Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="p-2 rounded bg-black  border border-[#BA8B02] text-white focus:outline-none focus:ring-2 focus:ring-[#BA8B02]"
                />
              )}

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-2 bg-gray-950 hover:bg-gray-950 border-amber-200 rounded text-amber-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 rounded"
                >
                  {mode === "create" ? "Create" : "Join"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </Background>
  );
}
