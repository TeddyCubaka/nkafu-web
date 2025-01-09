"use client";

import { connectedUserStore } from "@/components/store/connectedUser";
import { FaUserGraduate } from "react-icons/fa";
import { useStore } from "zustand";

export default function Home() {
  const { user } = useStore(connectedUserStore);

  return (
    <div className="w-full h-full flex flex-col p-5">
      dashboard here
      <div>{user?.name}</div>
    </div>
  );
}
