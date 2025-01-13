"use client";
import { useStore } from "zustand";
import { connectedUserStore } from "../store/connectedUser";
import { FaUserGraduate } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { sidebarState } from "../store/sidebarState";
import { IoMenu } from "react-icons/io5";

const TopBanner = () => {
  const { user, setter } = useStore(connectedUserStore);
  const { isOpen, setIsOpen } = useStore(sidebarState);
  const [loading, setLoading] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user || user == null) {
      setLoading(true);
      const localStorageUser =
        localStorage.getItem("dp-sk-moto-user") &&
        localStorage.getItem("dp-sk-moto-user") !== null
          ? JSON.parse(String(localStorage.getItem("dp-sk-moto-user")))
          : undefined;
      if (localStorageUser) {
        setter(localStorageUser);
      }
      setLoading(false);
    }
  }, [user, setter]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <span></span>;
  if (["/auth/login"].includes(path)) return false;
  return (
    <div className="flex justify-between items-center py-5 lg:mx-10 mx-5 gap-10">
      <span className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <IoMenu size={30} />
      </span>
      <div className="flex-1">
        {user && user?.agent?.organization ? (
          <span className="font-semibold">{user?.agent.organization.name}</span>
        ) : (
          <span className="text-red-500 text-lg border px-3 py-2 border-red-500 flex items-center rounded-lg gap-5 cursor-pointer">
            <IoIosWarning size={25} /> Aucune organisation trouvée
          </span>
        )}
      </div>
      <div className="flex gap-5 items-center relative">
        <div className="flex flex-col">
          <span className="text-lg font-[700]">
            {user && user?.agent !== null
              ? `${user?.agent?.firstName} ${user?.agent?.lastName}`
              : user?.name}
          </span>
          <span>role : {user?.role?.name || "---"}</span>
        </div>
        <div
          className="rounded-full bg-background text-foreground p-3 flex items-center justify-center cursor-pointer"
          onClick={() => setMenuVisible((prev) => !prev)}
        >
          <FaUserGraduate size={30} />
        </div>
        {menuVisible && (
          <div
            ref={menuRef}
            className="absolute top-14 right-0 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-10"
          >
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("dp-sk-moto-user");
                  localStorage.removeItem("dp-sk-moto-token");
                  router.push("/auth/login");
                }}
              >
                Déconnexion
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBanner;
