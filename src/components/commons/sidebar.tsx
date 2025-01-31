"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { IoChevronDownOutline, IoChevronForwardOutline } from "react-icons/io5";
import appLogo from "@/../public/logo/logo-inline.png";
import Image from "next/image";
import { iconsDictionary } from "../store/icon";
import HttpClient from "@/utils/http-client";
import Link from "next/link";
import { sidebarState } from "../store/sidebarState";
import { useStore } from "zustand";
import translate from "../store/dictionary";
import Button from "./button";

const SidebarLoader = () => {
  return (
    <div className="w-full animate-pulse p-5 flex flex-col gap-5">
      {Array(8)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="h-6 bg-bg-secondary rounded-md w-full mx-auto"
          ></div>
        ))}
    </div>
  );
};

type MenuDataType = {
  id: string;
  name: string;
  icon: string;
  path?: string;
  actions: { id: string; name: string; icon: string; path?: string }[];
};
interface SideBarContent extends MenuDataType {
  panding?: number;
}

const NavSection = ({
  name,
  icon,
  path,
  actions,
  panding = 0,
}: SideBarContent) => {
  const [displaychildren, setDisplaychildren] = useState<boolean>(false);
  const ChivronComponent = () => {
    return displaychildren ? (
      <IoChevronDownOutline />
    ) : (
      <IoChevronForwardOutline />
    );
  };

  const pathname = usePathname();
  const Icon: IconType | null = iconsDictionary[icon]?.component || null;
  return (
    <>
      <Link
        href={path || ""}
        onClick={() => {
          if (actions && actions.length > 0)
            setDisplaychildren(!displaychildren);
          else if (path) {
            if (path == "/auth/logout") {
              localStorage.removeItem("dp-sk-moto-user");
              localStorage.removeItem("dp-sk-moto-token");
            }
          }
        }}
        className={`px-2.5 py-2 text-nowrap rounded-md flex gap-2 cursor-pointer ${
          panding > 0 ? "hover:translate-x-1" : "hover:bg-bg-secondary"
        } ${path == pathname && "text-primary !font-bold"} transition-all`}
        style={{
          marginLeft: `${panding}px`,
        }}
      >
        <span className="flex justify-between w-full items-center gap-3">
          <span className="flex gap-2 items-center font-light">
            {Icon !== null ? <Icon size={16} /> : false} {translate(name, true)}
          </span>
          {actions && actions.length > 0 ? <ChivronComponent /> : false}
        </span>
      </Link>
      {displaychildren && actions.length > 0 ? (
        <>
          {actions &&
            actions.map((subMenu) => {
              return (
                <NavSection
                  {...subMenu}
                  icon={""}
                  actions={[]}
                  key={subMenu.path}
                  panding={panding + 30}
                />
              );
            })}
        </>
      ) : (
        false
      )}
    </>
  );
};

const Sidebar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const path = usePathname();
  const [menus, setMenus] = useState<MenuDataType[]>([]);
  const [error, setError] = useState<
    | {
        code: number;
        message: string;
        [key: string]: any;
      }
    | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [fetchMenu, setFetchMenu] = useState(true);
  const { isOpen, setIsOpen } = useStore(sidebarState);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsOpen]);

  useEffect(() => {
    const requester = async () => {
      try {
        setLoading(true);
        const httpClient = new HttpClient();
        const data: { code: number; message: string; data: any[] } =
          await httpClient.get("load/menu");
        if (!data && httpClient.error !== null) setError(httpClient.error);
        else if (!data.data && httpClient.error !== null)
          setError(httpClient.error);
        else {
          setError(undefined);
          setMenus(
            data.data.map((menu) => ({
              ...menu,
              actions: menu.menuActions
                ? menu.menuActions.map(
                    (action: {
                      id: string;
                      action: {
                        id: string;
                        name: string;
                        path: string;
                        method: string;
                      };
                    }) => action.action
                  )
                : menu.actions,
            }))
          );
        }
      } catch (error: any) {
        if (menus.length > 0) {
          setError({
            code: error.code || 500,
            message: error.message || "une erreur s'est produite",
          });
        }
      } finally {
        setLoading(false);
        setFetchMenu(false);
      }
    };
    if (path == "/auth/login") setMenus([]);
    if (fetchMenu && path !== "/auth/login") requester();
  }, [fetchMenu, path]);

  if (["/auth/login"].includes(path)) {
    return <div></div>;
  }

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden absolute bg-[#00000086] dark:bg-[#ffffff86] h-screen w-screen z-10"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`max-lg:fixed z-20 bg-background overflow-auto text-foreground shadow-md w-3/4 lg:w-1/5 h-full p-5  flex-col gap-10 transition-transform ${
          isOpen ? " translate-x-0 flex" : "-translate-x-full hidden"
        }`}
      >
        <div className="">
          <div className="container mx-auto flex items-center justify-between my-5">
            <Image
              src={appLogo}
              alt="digipublic logo"
              width={120}
              height={70}
            />
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              {isDarkMode ? <>🌙</> : <>☀️</>}
            </button>
          </div>
          <nav className="flex flex-col gap-2 overflow-x-hidden overflow-y-auto h-full">
            {loading ? (
              <SidebarLoader />
            ) : error ? (
              <div className="w-full flex flex-col gap-5 items-center">
                <span>une erreur s&apos;est produite</span>
                <span>{error.message}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    setFetchMenu(true);
                  }}
                  isLoading={loading}
                  className="p-3 !rounded-full"
                >
                  refresh
                </Button>
              </div>
            ) : menus.length == 0 ? (
              <div className="w-full flex flex-col gap-5 items-center my-10">
                <span>
                  Aucun menu trouvé verifiez que vous avez les accès nécessaires
                  ou contactez votre chef
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    setFetchMenu(true);
                  }}
                  isLoading={loading}
                  className="p-3 !rounded-full"
                >
                  refresh
                </Button>
              </div>
            ) : (
              menus.map((menu) => <NavSection {...menu} key={menu.name} />)
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
