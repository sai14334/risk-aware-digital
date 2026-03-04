import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";
import Layout from "@/components/Layout";

const FAQPage = () => {
  const [lang, setLang] = useState<Lang>("en");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = translations[lang];

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "te" : "en"));
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="govt-card">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t.faqTitle}</h2>
          <div className="space-y-3">
            {t.faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-input rounded-lg overflow-hidden hover:border-primary/50 transition-colors animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
                >
                  <span className="font-semibold text-foreground text-base">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground transition-transform duration-300 shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="p-4 bg-background border-t border-input animate-in fade-in">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
