import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark and light theme"
      className="fixed bottom-4 right-4 z-50 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gemini-border bg-gemini-surface text-gemini-text shadow-lg transition hover:-translate-y-0.5 hover:bg-gemini-surface-hover focus:outline-none focus:ring-2 focus:ring-gemini-accent/70"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
