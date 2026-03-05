/**
 * LangContext — global language state + Google Translate integration.
 *
 * - Provides `lang` (the active hardcoded locale: "en" | "te") and
 *   `changeLang` / `toggleLang` for existing pages.
 * - Also injects the Google Translate widget hidden in the DOM so that
 *   `LanguagePicker` can trigger translation of ANY language without
 *   needing per-language hardcoded strings.
 *
 * How Google Translate works here:
 *   We load the Google Translate Element script once, initialise it on a
 *   hidden `<div id="google_translate_element">`, then call the
 *   `doGTranslate('en|<target>')` helper that the widget exposes to
 *   programmatically switch language — exactly what the free-tier widget
 *   uses when a user picks from its own dropdown.
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Lang } from "@/lib/translations";

// ── types ──────────────────────────────────────────────────────────────────
interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
  changeLang: (l: Lang) => void;
  /** Translate the whole page to any BCP-47 code, e.g. "hi", "ta", "kn" */
  translateTo: (googleLangCode: string) => void;
  /** The currently active Google Translate language code (empty = original) */
  gtLang: string;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  toggleLang: () => {},
  changeLang: () => {},
  translateTo: () => {},
  gtLang: "",
});

export function useLang() {
  return useContext(LangContext);
}

// ── Google Translate helpers ───────────────────────────────────────────────
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          opts: { pageLanguage: string; autoDisplay: boolean },
          id: string
        ) => void;
      };
    };
    doGTranslate?: (lang_pair: string) => void;
  }
}

function loadGoogleTranslateScript() {
  if (document.getElementById("gt-script")) return;
  const script = document.createElement("script");
  script.id = "gt-script";
  script.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

function initGoogleTranslate() {
  if (window.google?.translate?.TranslateElement) {
    new window.google.translate.TranslateElement(
      { pageLanguage: "en", autoDisplay: false },
      "google_translate_element"
    );
  }
}

/**
 * Programmatically switch the Google Translate widget to a language.
 * Uses the same internal function the widget's own select element calls.
 */
function doTranslate(targetCode: string) {
  // Try the doGTranslate shortcut first (available after widget fully loads)
  if (typeof window.doGTranslate === "function") {
    window.doGTranslate(`en|${targetCode}`);
    return;
  }
  // Fallback: manipulate the hidden select element the widget renders
  const select = document.querySelector<HTMLSelectElement>(
    ".goog-te-combo"
  );
  if (select) {
    select.value = targetCode;
    select.dispatchEvent(new Event("change"));
  }
}

function restoreOriginal() {
  // Clicking the "Show original" link or resetting the select to "en" restores
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = "en";
    select.dispatchEvent(new Event("change"));
  }
  // Remove Google Translate cookie so page reloads cleanly
  document.cookie =
    "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// ── Provider ──────────────────────────────────────────────────────────────
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("gramrakshak-lang") as Lang) || "en";
  });
  const [gtLang, setGtLang] = useState<string>("");

  // Inject Google Translate once on mount
  useEffect(() => {
    // Register the callback BEFORE loading the script
    window.googleTranslateElementInit = initGoogleTranslate;
    loadGoogleTranslateScript();
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", next);
      return next;
    });
    // When toggling back to en/te hardcoded strings, restore GT
    setGtLang("");
    restoreOriginal();
  }, []);

  const changeLang = useCallback((l: Lang) => {
    setLang(l);
    localStorage.setItem("gramrakshak-lang", l);
    setGtLang("");
    restoreOriginal();
  }, []);

  const translateTo = useCallback((code: string) => {
    if (code === "en") {
      setGtLang("");
      restoreOriginal();
      return;
    }
    if (code === "te") {
      // For Telugu use the existing hardcoded translations
      changeLang("te");
      return;
    }
    setGtLang(code);
    doTranslate(code);
  }, [changeLang]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, changeLang, translateTo, gtLang }}>
      {/* Hidden div required by Google Translate widget */}
      <div id="google_translate_element" style={{ display: "none" }} />
      {children}
    </LangContext.Provider>
  );
}
