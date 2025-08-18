import { THEMES } from "../constant";
import React from "react";
import useThemeStore from "../store/useThemeStore";
import { PaletteIcon } from "lucide-react";

const ThemeSelector = () => {
  const { mytheme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-circle" tabIndex={0}>
        <PaletteIcon />
      </button>
      <div
        className="dropdown-content  mt-2 bg-base-200 overflow-y-auto p-1 max-h-80 w-56 rounded-2xl  shadow-2xl backdrop-blur-lg"
        tabIndex={0}
      >
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            className={`w-full flex items-center px-4 py-3 gap-3  ${
              mytheme === themeOption.name
                ? "bg-primary/10 text-primary"
                : "hover:bg-base-content/5"
            }`}
            onClick={() => setTheme(themeOption.name)}
          >
            <PaletteIcon />
            <span>{themeOption.label}</span>
            <div className="flex gap-1 ml-auto">
              {themeOption.colors.map((color, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: color }}
                  className="size-2 rounded-full"
                ></span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
