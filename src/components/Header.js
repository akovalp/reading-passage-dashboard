import React from "react";
import { useTheme } from "../context/ThemeContext";

const Header = ({ title }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header>
      <h1>{title}</h1>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? "🌞" : "🌙"}
      </button>
    </header>
  );
};

export default Header;
