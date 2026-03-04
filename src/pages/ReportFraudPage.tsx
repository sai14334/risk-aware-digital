import { useState, useCallback } from "react";
import {
  ShieldAlert,
  Upload,
  Send,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";
import Layout from "@/components/Layout";

const ReportFraudPage = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const [submitted, setSubmitted] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", newLang);
      return newLang;
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-10">

        {/* 🔷 Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-500/10 text-red-600">
              <ShieldAlert size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Report a Fraud
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Your report helps protect others from scams and fraudulent activities.
            All submissions are confidential and securely handled.
          </p>
        </div>

        {/* 🔒 Security Notice */}
        <div className="flex items-start gap-3 bg-yellow-100 border border-yellow-300 p-4 rounded-lg">
          <AlertTriangle className="text-yellow-600 mt-1" size={20} />
          <p className="text-sm text-yellow-800">
            Please provide accurate details. False reporting may lead to legal consequences.
            Do not share sensitive banking passwords or OTPs in this form.
          </p>
        </div>

        {/* ✅ Success Message */}
        {submitted ? (
          <div className="bg-green-100 border border-green-300 p-6 rounded-xl text-center space-y-4">
            <CheckCircle className="text-green-600 mx-auto" size={40} />
            <h2 className="text-xl font-semibold text-green-800">
              Report Submitted Successfully
            </h2>
            <p className="text-green-700 text-sm">
              Thank you for helping build a safer community. Our team will review your report shortly.
            </p>
          </div>
        ) : (

        /* 📝 Report Form */
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm"
        >

          {/* Fraud Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Fraud Category
            </label>
            <select className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none">
              <option>Online Scam</option>
              <option>UPI / Payment Fraud</option>
              <option>Identity Theft</option>
              <option>Investment Scam</option>
              <option>Job Fraud</option>
              <option>Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Describe the Incident
            </label>
            <textarea
              rows={5}
              required
              placeholder="Provide detailed information about what happened..."
              className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none"
            />
          </div>

          {/* Upload Evidence */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Upload Evidence (Optional)
            </label>
            <div className="flex items-center gap-3 border border-dashed border-input p-4 rounded-lg">
              <Upload size={20} className="text-muted-foreground" />
              <input type="file" className="text-sm" />
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Urgency Level
            </label>
            <select className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            />
            <label className="text-sm">
              Submit anonymously
            </label>
          </div>

          {/* Contact Info (Hidden if Anonymous) */}
          {!anonymous && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone / Email
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Send size={18} />
            Submit Report
          </button>

        </form>
        )}

      </div>
    </Layout>
  );
};

export default ReportFraudPage;