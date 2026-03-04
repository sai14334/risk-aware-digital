import { useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import MessageInput from "@/components/MessageInput";
import ResultsSection from "@/components/ResultsSection";
import FraudStoriesSection from "@/components/FraudStoriesSection";
import { analyzeMessage, AnalysisResult } from "@/lib/analyzer";
import { analyzeRemote } from "@/lib/api";
import { Lang } from "@/lib/translations";
import { Carousel } from "@/components/ui/carousel";

const Index = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [originalMessage, setOriginalMessage] = useState("");
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", newLang);
      return newLang;
    });
  }, []);

  const handleAnalyze = useCallback((message: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setErrorInfo(null);
    setLastMessage(message);

    analyzeRemote(message)
      .then((analysisResult) => {
        setResult(analysisResult);
        setOriginalMessage(message);
      })
      .catch((err) => {
        console.warn("remote analyze failed", err);
        setError("Remote request failed; using local analysis instead.");

        try {
          setErrorInfo(typeof err === "string" ? err : JSON.stringify(err));
        } catch {
          setErrorInfo(String(err));
        }

        setTimeout(() => {
          const analysisResult = analyzeMessage(message);
          setResult(analysisResult);
          setOriginalMessage(message);
        }, 1200);
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  }, []);

  return (
  <Layout lang={lang} onToggleLang={toggleLang}>
    
    {/* ================= ANALYZER SECTION ================= */}
    <section className="bg-background py-20">
      <div className="mx-auto w-full max-w-3xl px-4 space-y-6">
        
    {/* <Carousel/> */}
        <MessageInput
          lang={lang}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        {error && (
          <div className="govt-card bg-warning/5 border-l-4 border-l-warning animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="text-warning shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-warning mb-1">
                    Connection Issue
                  </p>
                  <p className="text-sm text-muted-foreground">{error}</p>

                  {showErrorDetails && errorInfo && (
                    <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted/50 p-2 text-xs">
                      {errorInfo}
                    </pre>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {lastMessage && (
                  <button
                    onClick={() => lastMessage && handleAnalyze(lastMessage)}
                    className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:opacity-90"
                  >
                    Retry
                  </button>
                )}

                <button
                  onClick={() => setShowErrorDetails((s) => !s)}
                  className="rounded-md border border-input px-3 py-1 text-sm text-muted-foreground hover:bg-muted/50"
                >
                  {showErrorDetails ? "Hide Details" : "Details"}
                </button>

                <button
                  onClick={() => {
                    setError(null);
                    setErrorInfo(null);
                    setShowErrorDetails(false);
                  }}
                  className="rounded-md border border-input px-3 py-1 text-sm text-muted-foreground hover:bg-muted/50"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {result && (
          <ResultsSection
            result={result}
            originalMessage={originalMessage}
            lang={lang}
          />
        )}

      </div>
    </section>


    {/* ================= TRANSITION DIVIDER ================= */}
    {/* <div className="h-24 bg-gradient-to-b from-background to-blue-50" /> */}


    {/* ================= FRAUD STORIES SECTION ================= */}
    <FraudStoriesSection />

  </Layout>
);
}

export default Index;