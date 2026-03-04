import { useState, useCallback, useEffect } from "react";
import Layout from "@/components/Layout";
import Statistics from "./Statistics";
import { Lang } from "@/lib/translations";

const StatisticsPage = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", newLang);
      return newLang;
    });
  }, []);

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // always use tunnel backend by default; override with VITE_API_URL if you need a different server
        const base = import.meta.env.VITE_API_URL || "https://m2pc2m1j-8000.inc1.devtunnels.ms";
    const resp = await fetch(`${base}/api/stats`);
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Failed to fetch stats: ${resp.status} ${text}`);
        }
        const json = await resp.json();
        setData(json);
      } catch (err: any) {
        setError(typeof err === "string" ? err : err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const listener = () => fetchStats();
    window.addEventListener('refreshStats', listener);
    return () => window.removeEventListener('refreshStats', listener);
  }, []);

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-12">Loading statistics...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600 space-y-4">
            <div>Error loading statistics: {error}</div>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                setData(null);
                // trigger fetch again
                const fetchStats = async () => {
                  try {
                    const base =
                      import.meta.env.VITE_API_URL ||
                      "https://m2pc2m1j-8000.inc1.devtunnels.ms";
                    const resp = await fetch(`${base}/api/stats`);
                    if (!resp.ok) {
                      const text = await resp.text();
                      throw new Error(`Failed to fetch stats: ${resp.status} ${text}`);
                    }
                    const json = await resp.json();
                    setData(json);
                  } catch (err: any) {
                    setError(typeof err === "string" ? err : err.message || String(err));
                  } finally {
                    setLoading(false);
                  }
                };
                fetchStats();
              }}
              className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        {data && <Statistics data={data} />}

        {!loading && !error && !data && (
          <div className="text-center py-12 text-muted-foreground">No statistics available.</div>
        )}
      </div>
    </Layout>
  );
};

export default StatisticsPage;
