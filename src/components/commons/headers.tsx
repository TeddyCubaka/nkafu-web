"use client";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Bascule le thème et stocke la préférence dans localStorage
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

  // Charger le thème depuis localStorage ou respecter la préférence système
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

  return (
    <header className="bg-background text-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <h1 className="text-xl font-bold">Mon Application</h1>

        {/* Bouton de basculement du thème */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          {isDarkMode ? (
            <>
              🌙 <span>Thème Sombre</span>
            </>
          ) : (
            <>
              ☀️ <span>Thème Clair</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
