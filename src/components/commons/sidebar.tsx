"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { IoChevronDownOutline, IoChevronForwardOutline } from "react-icons/io5";
import appLogo from "@/../public/logo/logo-inline.png";
import Image from "next/image";
import { iconsDictionary } from "../store/icon";
import HttpClient from "@/utils/http-client";

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
  const [displayChildrens, setDisplayChildrens] = useState<boolean>(false);
  const ChivronComponent = () => {
    return displayChildrens ? (
      <IoChevronDownOutline />
    ) : (
      <IoChevronForwardOutline />
    );
  };
  const router = useRouter();
  const pathname = usePathname();
  const Icon: IconType | null = iconsDictionary[icon]?.component || null;
  return (
    <>
      <div
        onClick={() => {
          if (actions.length > 0) setDisplayChildrens(!displayChildrens);
          else if (path) {
            if (path == "/auth/login") {
              localStorage.removeItem("dp-sk-moto-user");
              localStorage.removeItem("dp-sk-moto-token");
            }
            router.push(path);
          }
        }}
        className={
          `px-2.5 py-2 text-nowrap rounded-md flex gap-2 cursor-pointer ${
            panding > 0 && "hover:translate-x-1"
          } ${path == pathname && "text-primary !font-bold"} transition-all`
          // (path == pathname && "border-x-2 border-green-500 bg-gray-100")
        }
        style={{
          marginLeft: `${panding}px`,
        }}
      >
        <span className="flex justify-between w-full items-center gap-3">
          <span className="flex gap-2 items-center font-extralight">
            {Icon !== null ? <Icon size={16} /> : false} {name}
          </span>
          {actions.length > 0 ? <ChivronComponent /> : false}
        </span>
      </div>
      {displayChildrens && actions.length > 0 ? (
        <>
          {actions.map((subMenu) => {
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
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  }>();
  const [loading, setLoading] = useState(true);

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
    const requester = async () => {
      try {
        setLoading(true);
        const httpClient = new HttpClient();
        const data: { code: number; message: string; data: MenuDataType[] } =
          await httpClient.get("load/menu");
        if (!data && httpClient.error !== null) setError(httpClient.error);
        else if (!data.data && httpClient.error !== null)
          setError(httpClient.error);
        else {
          setMenus(data.data);
        }
      } catch (error: any) {
        setError({
          code: error.code || 500,
          message: error.message || "une erreur s'est produite",
        });
      } finally {
        setLoading(false);
      }
    };
    requester();
  }, []);

  if (["/auth/login"].includes(path)) return false;
  
  return (
    <div className="bg-background text-foreground shadow-md w-1/5 p-5 flex flex-col gap-10">
      <div className="container mx-auto flex items-center justify-between my-5">
        <Image src={appLogo} alt="digipublic logo" width={120} height={70} />
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          {isDarkMode ? <>🌙</> : <>☀️</>}
        </button>
      </div>
      <nav className="flex flex-col gap-2">
        {menus.map((menu) => (
          <NavSection {...menu} key={menu.name} />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
