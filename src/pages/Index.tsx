import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import MessageInput from "@/components/MessageInput";
import ResultsSection from "@/components/ResultsSection";
import { analyzeMessage, AnalysisResult } from "@/lib/analyzer";
import { analyzeRemote } from "@/lib/api";
import { Lang } from "@/lib/translations";

const Index = () => {
  const [lang, setLang] = useState<Lang>("en");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [originalMessage, setOriginalMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "te" : "en"));
  }, []);

  const handleAnalyze = useCallback((message: string) => {
    setIsAnalyzing(true);
    setResult(null);

    // try remote first, fall back to the local analyzer if something
    // goes wrong (network failure, server error, etc.).
    setError(null);
    analyzeRemote(message)
      .then((analysisResult) => {
        setResult(analysisResult);
        setOriginalMessage(message);
      })
      .catch((err) => {
        console.warn("remote analyze failed", err);
        setError("Remote request failed; using local analysis instead.");
        // remote call failed; keep showing the fake delay so the UI
        // doesn't feel like it immediately gave up.
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
      <div className="mx-auto w-full max-w-3xl px-4 py-8 space-y-6">
        <MessageInput lang={lang} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        {error && (
          <p className="mt-2 text-sm text-danger">{error}</p>
        )}

        {result && (
          <ResultsSection result={result} originalMessage={originalMessage} lang={lang} />
        )}
      </div>
    </Layout>
  );
};

export default Index;
