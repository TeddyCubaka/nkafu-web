"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
      //   let connectedUserToken = localStorage.getItem("dp-sk-moto-user");
    }
  });

  return <>{children}</>;
}
