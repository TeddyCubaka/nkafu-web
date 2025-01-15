"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./commons/sidebar";
import TopBanner from "./commons/topBanner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (localStorage) {
      let connectedUser = localStorage.getItem("dp-sk-moto-user");
      if (!connectedUser || connectedUser == null) {
        router.push("/auth/login");
        return;
      }
      connectedUser = JSON.parse(connectedUser);
      if (!connectedUser || connectedUser == null) {
        router.push("/auth/login");
        return;
      }
    }
  });

  return (
    <>
      {!["/auth/login"].includes(path) ? <Sidebar /> : false}
      <div className=" w-full bg-bg-secondary overflow-y-auto h-full">
        <TopBanner />
        {children}
      </div>
    </>
  );
}
