
import { ExternalLink, Linkedin, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";

const Footer = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <footer className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Created by Abdul Razak Bilal
          </p>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {theme === 'light' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-indigo-400" />}
            </span>
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-indigo-600"
              aria-label="Toggle dark mode"
            />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {theme === 'light' ? 'Light' : 'Dark'}
            </span>
          </div>
          
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Play11 Prism: Cricket Analytics
          </div>
          
          <a 
            href="https://www.linkedin.com/in/abdul-razak-bilal/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-cricket-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Connect on LinkedIn <Linkedin size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
