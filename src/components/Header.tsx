import {
  ShieldCheck,
  ShieldAlert,
  Menu,
  HelpCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";
import LanguagePicker from "@/components/LanguagePicker";

interface HeaderProps {
  lang: Lang;
  onToggleLang: () => void;
  onAnalyzeClick?: () => void;
}

const Header = ({ lang, onToggleLang, onAnalyzeClick }: HeaderProps) => {

    const t = translations[lang];
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 500);
  };

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
          <span className="text-lg font-semibold">{t.brandName}</span>
        </Link>

        {/* CENTER: Main Navigation (Desktop Only) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
  
          <button
            onClick={() => {
              if (onAnalyzeClick) {
                onAnalyzeClick();
              } else {
                navigate("/analyze");
              }
            }}
            className="transition hover:opacity-80"
          >
            {t.navAnalyze}
          </button>
          <button
            onClick={() => {
              navigate("/statistics");
              // notify stats page to refresh if already mounted
              window.dispatchEvent(new Event('refreshStats'));
            }}
            className="transition hover:opacity-80"
          >
            {t.navStats}
          </button>
          <button onClick={() => navigate("/faq")} className="transition hover:opacity-80">
            {t.navFAQs}
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          
          {/* Cybercrime Portal */}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            title={t.nationalPortalText}
            className="inline-flex items-center justify-center rounded-md bg-danger p-2 text-danger-foreground hover:opacity-95"
          >
            <ShieldAlert size={18} />
  
          </a>

          {/* Language Picker — multi-language via Google Translate */}
          <LanguagePicker />

          {/* Menu Dropdown */}
          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-lg border border-primary-foreground/30 p-2 transition hover:bg-primary-foreground/20 hover:border-primary-foreground/50 hover:scale-110"
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
                    {t.menuFaq}
                  </button>

                  <button
                    onClick={() => handleMenuClick("/report")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition"
                  >
                    <ShieldAlert size={16} />
                    {t.reportTitle}
                  </button>

                  <button
                    onClick={() => handleMenuClick("/reporting-guide")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition"
                  >
                    <HelpCircle size={16} />
                    {t.menuReportingGuide}
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