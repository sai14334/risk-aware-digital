import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";
import {
  ShieldAlert,
  Phone,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle2,
} from "lucide-react";

const ReportingGuide = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const t = translations[lang];

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", newLang);
      return newLang;
    });
  }, []);

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-12">

        {/* HERO SECTION */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <ShieldAlert size={40} className="text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold">
            Live Cybercrime Reporting Guide
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Act quickly if you suspect fraud. Follow these official steps to
            protect your money and report cybercrime effectively.
          </p>
        </div>

        {/* QUICK ACTION STEPS */}
        <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            Immediate Action Steps
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Do NOT reply or click any suspicious links.",
              "Take screenshots of messages and transaction details.",
              "Note sender number, UPI ID, and timestamps.",
              "Immediately contact your bank if money was debited.",
              "Call 1930 within 30 minutes for faster recovery.",
            ].map((step, index) => (
              <div
                key={index}
                className="flex gap-4 p-5 rounded-xl border border-border bg-background hover:shadow-md transition duration-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* REPORT CONTENT SECTION */}
        <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            What to Include in Your Report
          </h2>

          <div className="grid gap-4">
            {[
              "Complete message text (copy & paste).",
              "Sender number and time of message.",
              "UPI ID, transaction ID, or suspicious links.",
              "Screenshots of conversations and payment receipts.",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <CheckCircle2
                  size={18}
                  className="text-green-600 mt-0.5"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE FLOW */}
        <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            Reporting Flow Timeline
          </h2>

          <div className="space-y-6 text-sm text-muted-foreground">
            <div className="flex gap-4">
              <div className="w-2 bg-primary rounded-full"></div>
              <div>
                <strong>Step 1:</strong> Call 1930 immediately.
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-2 bg-primary rounded-full"></div>
              <div>
                <strong>Step 2:</strong> Visit National Cybercrime Portal.
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-2 bg-primary rounded-full"></div>
              <div>
                <strong>Step 3:</strong> Submit complaint with full evidence.
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-2 bg-primary rounded-full"></div>
              <div>
                <strong>Step 4:</strong> Track complaint status online.
              </div>
            </div>
          </div>
        </section>

        {/* EMERGENCY CALL SECTION */}
        <section className="rounded-2xl bg-red-600 text-white p-10 shadow-xl text-center space-y-6">
          <div className="flex justify-center">
            <Phone size={40} />
          </div>

          <h2 className="text-2xl font-bold">Emergency Helpline</h2>

          <p className="text-lg font-semibold">
            {t.helplineNumber} — {t.helpline}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:1930"
              className="bg-white text-red-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Call 1930 Now
            </a>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-red-600 transition flex items-center justify-center gap-2"
            >
              Visit Cybercrime Portal
              <ExternalLink size={16} />
            </a>
          </div>

          <p className="text-xs opacity-80">
            Reporting within the first 30 minutes significantly increases the
            chances of fund recovery.
          </p>
        </section>

      </div>
    </Layout>
  );
};

export default ReportingGuide;