import { ShieldCheck, Globe, Menu, HelpCircle, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <header className="sticky top-0 z-50 relative overflow-visible bg-primary py-10 px-4 text-primary-foreground shadow-md">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-primary-foreground/20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-primary-foreground/10 translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              aria-label="Home"
              className="flex items-center gap-2 bg-transparent p-0 m-0 focus:outline-none"
            >
              <div className="rounded-2xl bg-primary-foreground/15 p-2">
                <ShieldCheck size={32} strokeWidth={1.8} />
              </div>
              <span className="text-lg font-semibold text-primary-foreground">GramRakshak</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              title="Report Cybercrime (opens in new tab)"
              className="inline-flex items-center justify-center rounded-md bg-danger p-2 text-danger-foreground hover:opacity-95"
              aria-label="Report Cybercrime"
            >
              <ExternalLink size={18} />
            </a>
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
            >
              <Globe size={14} />
              {t.langToggle}
            </button>
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center rounded-lg border border-primary-foreground/30 p-2 transition-colors hover:bg-primary-foreground/10"
                title="Menu"
              >
                <Menu size={18} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-card border border-input shadow-lg z-50 animate-in fade-in">
                  <div className="py-2">
                        <button
                          onClick={() => handleMenuClick("/faq")}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <HelpCircle size={16} />
                          FAQs
                        </button>
                        <button
                          onClick={() => handleMenuClick("/reporting-guide")}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <HelpCircle size={16} />
                          Live Cybercrime Reporting Guide
                        </button>
                      </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
