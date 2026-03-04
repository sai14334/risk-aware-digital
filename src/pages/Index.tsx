import { useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import MessageInput from "@/components/MessageInput";
import ResultsSection from "@/components/ResultsSection";
import FraudStoriesSection from "@/components/FraudStoriesSection";
import { analyzeMessage, AnalysisResult } from "@/lib/analyzer";
import { analyzeRemote } from "@/lib/api";
import { Lang } from "@/lib/translations";


const Index = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [originalMessage, setOriginalMessage] = useState("");
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
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

  // handle image file analysis by uploading to server endpoint
  const handleAnalyzeFile = useCallback((file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setErrorInfo(null);
    setLastMessage(`[image] ${file.name}`);

    // use the tunnel backend URL by default (no localhost calls)
    const base = import.meta.env.VITE_API_URL || "https://m2pc2m1j-8000.inc1.devtunnels.ms";
    const url = `${base}/api/analyze-image`;

    const form = new FormData();
    form.append("file", file);

    fetch(url, { method: "POST", body: form })
      .then(async (resp) => {
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Image analyze failed: ${resp.status} ${text}`);
        }
        return resp.json();
      })
      .then((data) => {
        // map remote response shape to AnalysisResult
        const mapped: AnalysisResult = {
          score: data.risk_score ?? data.spam_score ?? 0,
          classification:
            typeof data.risk_level === "string"
              ? data.risk_level.toLowerCase() === "safe"
                ? "safe"
                : data.risk_level.toLowerCase() === "high risk" ||
                  data.risk_level.toLowerCase() === "high_risk" ||
                  data.risk_level.toLowerCase() === "highrisk"
                ? "highRisk"
                : "suspicious"
              : "suspicious",
          fraudType: data.fraud_type ?? "",
          keywords: data.entities_detected ?? [],
          explanation: Array.isArray(data.reasoning) ? data.reasoning.join(" ") : data.reasoning || "",
          message: data.message || "",
          spam_score: data.spam_score,
          fraud_confidence: data.fraud_confidence,
          risk_score: data.risk_score,
          risk_level: data.risk_level,
          entities_detected: data.entities_detected,
          reasoning: data.reasoning,
          safety_advice: data.safety_advice,
          helpline: data.helpline,
          timestamp: data.timestamp,
        };

        setResult(mapped);
        setOriginalMessage(mapped.message || `[image] ${file.name}`);
      })
      .catch((err) => {
        console.warn("image analyze failed", err);
        setError("Image analyze failed; please try again.");
        setErrorInfo(typeof err === "string" ? err : JSON.stringify(err));
      })
      .finally(() => setIsAnalyzing(false));
  }, []);

  return (
  <Layout lang={lang} onToggleLang={toggleLang} onNavbarAnalyze={() => handleAnalyze(message)}>
    
    {/* ================= ANALYZER SECTION ================= */}
    <section className="bg-background py-20">
      <div className="mx-auto w-full max-w-3xl px-4 space-y-6">
        
    {/* <Carousel/> */}
        <MessageInput
          lang={lang}
          message={message}
          onMessageChange={setMessage}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          onAnalyzeFile={handleAnalyzeFile}
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