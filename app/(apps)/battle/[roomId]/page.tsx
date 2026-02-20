"use client";

import { NavBarComp } from "@/app/components/Navbar";
import Background from "@/components/Background";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
};

type Room = {
  id: number | string;
  slug?: string;
  users?: User[];
  admin?: User;
  createdAt?: string;
};

export default function BattlePage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    async function fetchRoom() {
      try {
        console.log("fetchRoom: roomId =", roomId);
        // call id-based route when roomId is numeric, otherwise use slug route
        const isNumericId = /^\d+$/.test(roomId);
        const path = isNumericId ? `/room/id/${roomId}` : `/room/${roomId}`;
        const res = await api.get(path);
        if (!res || (res.status !== 200 && res.status !== 201)) {
          throw new Error(`Failed to fetch room, status ${res?.status}`);
        }
        const data = res.data;
        console.log("fetchRoom: raw data =", data);

        // normalize users: backend may return `users` or `admin` relation
        let normalizedUsers: User[] | undefined = undefined;
        if (Array.isArray(data?.users)) {
          normalizedUsers = data.users;
        } else if (data?.admin) {
          normalizedUsers = [{ id: data.admin.id, name: data.admin.name }];
        }

        setRoom({
          id: data?.id ?? roomId,
          slug: data?.slug,
          users: normalizedUsers,
          admin: data?.admin,
          createdAt: data?.createdAt,
        });
      } catch (err) {
        console.error("Error fetching room:", err);
        setRoom(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!room) {
    return <div className="min-h-screen flex items-center justify-center">Room not found</div>;
  }

  const usersToRender = room.users ?? (room.admin ? [room.admin] : []);

  return (
    <Background>
        <NavBarComp/>
        <div className="min-h-screen flex flex-col   text-amber-500 p-6">
        <div className=" flex justify-center items-center flex-col max-w-2xl  bg-black/10 backdrop-blur-lg p-6 border-amber-300 border rounded-lg mt-10  mx-auto">

            <h2 className="text-2xl mb-4">Room: {room.slug ?? room.id}</h2>
      <div>
        <h3 className="text-lg mb-2">Participants</h3>
        {usersToRender.length ? (
          <ul>
            {usersToRender.map((u) => (
              <li key={u.id} className="mb-1">
                {u.name ?? u.id}
              </li>
            ))}
          </ul>
        ) : (
          <p>No participants found.</p>
        )}
      </div>
        </div>
    </div>
    </Background>
  );
}
