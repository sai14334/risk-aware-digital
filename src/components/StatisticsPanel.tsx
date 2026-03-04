"use client";

import { useEffect, useState } from "react";

interface StatItem {
  label: string;
  value: number;
}

const StatisticsPanel = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        const data = await resp.json();

        const transformedStats: StatItem[] = [
          { label: "Total Analyzed", value: data.total_messages_analyzed || 0 },
          { label: "High Risk", value: data.high_risk || 0 },
          { label: "Suspicious", value: data.suspicious || 0 },
          { label: "Safe", value: data.safe || 0 },
        ];

        setStats(transformedStats);
      } catch (err: any) {
        setError(typeof err === "string" ? err : err.message || String(err));
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    // Counter animation
    stats.forEach((_, index) => {
      const el = document.getElementById(`stat-${index}`);
      if (!el) return;
      let start = 0;
      const end = stats[index].value;
      const duration = 1500;
      const increment = end / (duration / 30);
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          el.textContent = end.toString();
          clearInterval(counter);
        } else {
          el.textContent = Math.floor(start).toString();
        }
      }, 30);
    });
  }, [stats]);

  return (
    <section className="w-full bg-blue-50 py-12 px-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-8 text-center">
        Our Achievements
      </h2>

      {loading && <div className="text-gray-600 py-8 text-center">Loading statistics...</div>}

      {error && <div className="text-red-600 py-8 text-center">Error loading statistics: {error}</div>}

      {!loading && !error && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition hover:-translate-y-1 flex flex-col items-center"
            >
              <div
                id={`stat-${index}`}
                className="text-3xl font-extrabold text-blue-700 mb-1"
              >
                0
              </div>
              <div className="text-gray-600 font-medium text-sm text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default StatisticsPanel;