import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import FraudStoriesSection from "@/components/FraudStoriesSection";
import { Lang } from "@/lib/translations";
import StatisticsPanel from "../components/StatisticsPanel";
import CarouselSection from "../components/CarouselSection";

const Index = () => {
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

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      
      {/* ================= FULL WIDTH CAROUSEL ================= */}
      <CarouselSection />

      {/* ================= FULL WIDTH STATISTICS PANEL ================= */}
      <StatisticsPanel />

      {/* ================= FRAUD STORIES SECTION ================= */}
      <section className="bg-background py-20">
        <div className="mx-auto w-full max-w-6xl px-4">
          <FraudStoriesSection />
        </div>
      </section>



    </Layout>
  );
};

export default Index;