import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";
import { BookOpen, Shield, Lightbulb, AlertCircle, ArrowRight } from "lucide-react";

const AwarenessPage = () => {

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

  const t = translations[lang];

  const awarenessTopics = [
    {
      id: 1,
      icon: <AlertCircle size={30} />,
      title: "Recognition of Phishing",
      description:
        "Learn to identify phishing attacks and suspicious emails designed to steal your personal information.",
      tips: [
        "Check sender email address carefully",
        "Look for urgent language and threats",
        "Hover over links to see actual URL",
        "Be wary of unexpected attachments",
      ],
    },
    {
      id: 2,
      icon: <Shield size={30} />,
      title: "Password Security",
      description:
        "Best practices for creating and protecting strong passwords to safeguard your accounts.",
      tips: [
        "Use at least 12 characters with mixed types",
        "Avoid common words and personal information",
        "Use unique passwords for each account",
        "Enable two-factor authentication",
      ],
    },
    {
      id: 3,
      icon: <Lightbulb size={30} />,
      title: "Online Safety Tips",
      description:
        "Essential safety practices when using the internet and conducting online transactions.",
      tips: [
        "Verify website security (HTTPS)",
        "Never share OTP or banking details",
        "Keep your device software updated",
        "Use public WiFi cautiously",
      ],
    },
    {
      id: 4,
      icon: <BookOpen size={30} />,
      title: "Scam Awareness",
      description:
        "Understanding common scams and how to protect yourself from becoming a victim.",
      tips: [
        "Verify unexpected job offers independently",
        "Never pay upfront for free services",
        "Be cautious with investment opportunities",
        "Verify caller identity before sharing information",
      ],
    },
  ];

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>

      {/* Header */}
      <section className="bg-card border-b border-border py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Cyber Awareness Center
          </h1>

          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Learn how cybercriminals operate and how you can stay protected.
            Awareness is the first step to preventing fraud.
          </p>
        </div>
      </section>

      {/* Awareness Topics */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {awarenessTopics.map((topic) => (

            <div
              key={topic.id}
              className="group border rounded-xl p-6 bg-white shadow-sm hover:shadow-xl transition duration-300 flex flex-col h-full"
            >

              {/* Icon */}
              <div className="mb-4">
                {topic.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition">
                {topic.title}
              </h3>

              {/* Description */}
              <p className="text-foreground/70 text-sm mb-4">
                {topic.description}
              </p>

              {/* Tips */}
              <ul className="space-y-2 text-sm text-foreground/80 mb-5">
                {topic.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => (window.location.href = "/report")}
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Report Similar Fraud
                <ArrowRight size={16} />
              </button>

            </div>

          ))}

        </div>
      </section>

      {/* Report Fraud CTA */}
      <section className="bg-primary/5 py-8 px-4 mb-8">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Have You Encountered a Fraud?
          </h2>

          <p className="mb-8 text-foreground/70">
            Reporting fraud helps protect others from becoming victims.
            Share your experience and help build a safer digital community.
          </p>

          <button
            onClick={() => (window.location.href = "/report")}
            className="bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition"
          >
            Report a Fraud
          </button>

        </div>

      </section>

    </Layout>
  );
};

export default AwarenessPage;