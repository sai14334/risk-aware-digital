import {
  ShieldCheck,
  ShieldAlert,
  Globe,
  Menu,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

interface HeaderProps {
  lang: Lang;
  onToggleLang: () => void;
}

const Header = ({ lang, onToggleLang }: HeaderProps) => {
  const t = translations[lang];
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary py-4 px-4 text-primary-foreground shadow-md">
      <div className="mx-auto max-w-6xl flex items-center justify-between">

        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-2 focus:outline-none" aria-label="Home">
          <div className="rounded-xl bg-primary-foreground/15 p-2 transition-transform hover:scale-105">
            <ShieldCheck size={26} strokeWidth={1.8} />
          </div>
          <span className="text-lg font-semibold">GramRakshak</span>
        </Link>

        {/* CENTER: Main Navigation (Desktop Only) */}
        {/* <div className="hidden md:flex items-center gap-6 text-sm font-medium">
  
          <button onClick={() => navigate("/history")} className="hover:underline">
            History
          </button>
          <button onClick={() => navigate("/awareness")} className="hover:underline">
            Awareness
          </button>
          <button onClick={() => navigate("/trends")} className="hover:underline">
            Trends
          </button>
        </div> */}

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          
          {/* Cybercrime Portal */}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            title="Report Cybercrime"
            className="inline-flex items-center justify-center rounded-md bg-danger p-2 text-danger-foreground hover:opacity-95"
          >
            <ShieldAlert size={18} />
  
          </a>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm font-medium transition hover:bg-primary-foreground/10"
          >
            <Globe size={14} />
            {t.langToggle}
          </button>

          {/* Menu Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-lg border border-primary-foreground/30 p-2 hover:bg-primary-foreground/10 transition"
            >
              <Menu size={18} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-card border border-input shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2">

                  <button
                    onClick={() => handleMenuClick("/faq")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition"
                  >
                    <HelpCircle size={16} />
                    FAQs
                  </button>

                  <button
                    onClick={() => handleMenuClick("/reporting-guide")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition"
                  >
                    <HelpCircle size={16} />
                    Reporting Guide
                  </button>

                  <button
                    onClick={() => handleMenuClick("/about")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition"
                  >
                    <HelpCircle size={16} />
                    About
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;