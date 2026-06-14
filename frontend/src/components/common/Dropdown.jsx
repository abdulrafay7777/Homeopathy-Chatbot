import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const DropdownContext = createContext();

export const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger = ({ children }) => {
  const { setOpen } = useContext(DropdownContext);

  return (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="outline-none"
    >
      {children}
    </button>
  );
};

export const DropdownContent = ({ children, align = "right" }) => {
  const { open } = useContext(DropdownContext);

  if (!open) return null;

  return (
    <div
      className={[
        "absolute mt-12 w-56 bg-gemini-surface",
        "border border-gemini-border",
        "rounded-xl shadow-[0_8px_24px_rgba(15,23,42,0.18)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
        "overflow-hidden z-50 animate-fadeIn",
        align === "right" ? "right-0" : "left-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, danger }) => {
  const { setOpen } = useContext(DropdownContext);

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors text-[15px] font-medium cursor-pointer ${
        danger 
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" 
          : "text-gemini-text hover:bg-gemini-surface-hover"
      }`}
    >
      {children}
    </button>
  );
};