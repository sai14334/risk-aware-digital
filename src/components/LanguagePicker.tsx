/**
 * LanguagePicker — Google-Translate-style language selector.
 *
 * Shows a globe icon button. On click, opens a searchable dropdown with
 * 20+ languages. Selecting "English" or "Telugu" uses existing hardcoded
 * strings; any other language triggers Google Translate on the full page.
 */
import { useState, useRef, useEffect } from "react";
import { Globe, Check, Search } from "lucide-react";
import { useLang } from "@/lib/LangContext";

interface Language {
  code: string;       // Google Translate lang code
  label: string;      // Native name
  english: string;    // English name (for search)
  flag: string;       // emoji flag
}

const LANGUAGES: Language[] = [
  { code: "en",    label: "English",       english: "English",    flag: "🇬🇧" },
  { code: "te",    label: "తెలుగు",         english: "Telugu",     flag: "🇮🇳" },
  { code: "hi",    label: "हिन्दी",          english: "Hindi",      flag: "🇮🇳" },
  { code: "ta",    label: "தமிழ்",           english: "Tamil",      flag: "🇮🇳" },
  { code: "kn",    label: "ಕನ್ನಡ",           english: "Kannada",    flag: "🇮🇳" },
  { code: "ml",    label: "മലയാളം",         english: "Malayalam",  flag: "🇮🇳" },
  { code: "mr",    label: "मराठी",           english: "Marathi",    flag: "🇮🇳" },
  { code: "bn",    label: "বাংলা",           english: "Bengali",    flag: "🇧🇩" },
  { code: "gu",    label: "ગુજરાતી",         english: "Gujarati",   flag: "🇮🇳" },
  { code: "pa",    label: "ਪੰਜਾਬੀ",          english: "Punjabi",    flag: "🇮🇳" },
  { code: "or",    label: "ଓଡ଼ିଆ",           english: "Odia",       flag: "🇮🇳" },
  { code: "ur",    label: "اردو",            english: "Urdu",       flag: "🇵🇰" },
  { code: "ar",    label: "العربية",         english: "Arabic",     flag: "🇸🇦" },
  { code: "zh-CN", label: "中文(简体)",       english: "Chinese",    flag: "🇨🇳" },
  { code: "es",    label: "Español",         english: "Spanish",    flag: "🇪🇸" },
  { code: "fr",    label: "Français",        english: "French",     flag: "🇫🇷" },
  { code: "de",    label: "Deutsch",         english: "German",     flag: "🇩🇪" },
  { code: "pt",    label: "Português",       english: "Portuguese", flag: "🇧🇷" },
  { code: "ru",    label: "Русский",         english: "Russian",    flag: "🇷🇺" },
  { code: "ja",    label: "日本語",           english: "Japanese",   flag: "🇯🇵" },
  { code: "ko",    label: "한국어",           english: "Korean",     flag: "🇰🇷" },
  { code: "id",    label: "Bahasa Indonesia", english: "Indonesian", flag: "🇮🇩" },
  { code: "sw",    label: "Kiswahili",       english: "Swahili",    flag: "🇰🇪" },
];

export default function LanguagePicker() {
  const { lang, gtLang, translateTo, changeLang } = useLang();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Derive the active code
  const activeCode = gtLang || lang;

  const activeLanguage =
    LANGUAGES.find((l) => l.code === activeCode) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.english.toLowerCase().includes(search.toLowerCase()) ||
      l.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (l: Language) => {
    if (l.code === "en") {
      changeLang("en");
    } else if (l.code === "te") {
      changeLang("te");
    } else {
      translateTo(l.code);
    }
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm font-medium transition hover:bg-primary-foreground/10 text-primary-foreground"
        title="Change language"
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{activeLanguage.flag} {activeLanguage.english}</span>
        <span className="sm:hidden">{activeLanguage.flag}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card shadow-xl z-[200] overflow-hidden animate-fade-up"
        >
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            />
          </div>

          {/* List */}
          <ul className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground text-center">
                No results
              </li>
            )}
            {filtered.map((l) => {
              const isActive = l.code === activeCode;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(l)}
                    className={[
                      "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted/50",
                    ].join(" ")}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="flex-1 text-left">
                      <span className="block leading-tight">{l.label}</span>
                      <span className="block text-xs text-muted-foreground leading-tight">
                        {l.english}
                      </span>
                    </span>
                    {isActive && (
                      <Check size={14} className="text-primary shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer note */}
          <div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground text-center">
            Powered by Google Translate
          </div>
        </div>
      )}
    </div>
  );
}
