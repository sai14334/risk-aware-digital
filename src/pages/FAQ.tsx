import { useState, useCallback, useMemo } from "react";
import { ChevronDown, Search, HelpCircle, Phone, Mail } from "lucide-react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const t = translations[lang];

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", newLang);
      return newLang;
    });
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 🔍 Filter FAQs based on search
  const filteredFaqs = useMemo(() => {
    return t.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, t.faqs]);

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-10">

        {/* 🔷 Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <HelpCircle size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t.faqTitle}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find answers to common questions about reporting fraud,
            safety guidelines, and how GramRakshak protects citizens.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        {/* <div className="relative max-w-xl mx-auto">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search your question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div> */}

         
        {/* 📌 FAQ Section */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 && (
            <div className="text-center text-muted-foreground py-6">
              No matching questions found.
            </div>
          )}

          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-card"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-foreground text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 text-muted-foreground ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border animate-in fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 📞 Contact Support Section */}
        <div className="bg-muted/30 border border-border rounded-2xl p-6 text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Still have questions?
          </h3>
          <p className="text-sm text-muted-foreground">
            If you cannot find your answer here, please contact our support team.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Phone size={16} />
              <span>Helpline: 1800-XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Mail size={16} />
              <span>support@gramrakshak.in</span>
            </div>
          </div>
        </div>

       {/* 🚀 CTA Section */}
        <div className="text-center space-y-3">
          <h4 className="text-lg font-semibold text-foreground">
            Help Us Build a Safer Community
          </h4>
          <p className="text-sm text-muted-foreground">
            Report suspicious activities and stay informed about the latest fraud alerts.
          </p>
         
         <Link
  to="/report"
  className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
>
  Report a Fraud
</Link>

        </div>


      </div>
    </Layout>
  );
};

export default FAQPage;