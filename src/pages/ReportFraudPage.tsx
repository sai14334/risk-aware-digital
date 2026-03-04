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

const DEFAULT_API_BASE = "https://m2pc2m1j-8000.inc1.devtunnels.ms";

const ReportFraudPage = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form field states
  const [fraudType, setFraudType] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [urgency, setUrgency] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", newLang);
      return newLang;
    });
  }, []);

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("fraudType", fraudType);
      formData.append("description", description);
      formData.append("urgency", urgency);
      formData.append("anonymous", String(anonymous));
      
      if (evidence) {
        formData.append("evidence", evidence);
      }
      
      if (!anonymous) {
        formData.append("fullName", fullName);
        formData.append("contact", contact);
      }

      const base = import.meta.env.VITE_API_URL || DEFAULT_API_BASE;
      const url = `${base}/api/reports/submit-fraud`;

      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to submit report: ${response.status}`);
      }

      setSubmitted(true);
      // Reset form
      setFraudType("");
      setDescription("");
      setEvidence(null);
      setUrgency("");
      setAnonymous(false);
      setFullName("");
      setContact("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Report submission error:", err);
    } finally {
      setIsLoading(false);
    }
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
            {t.reportTitle}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.reportSubtitle}
          </p>
        </div>

        {/* 🔒 Security Notice */}
        <div className="flex items-start gap-3 bg-yellow-100 border border-yellow-300 p-4 rounded-lg">
          <AlertTriangle className="text-yellow-600 mt-1" size={20} />
          <div className="text-sm text-yellow-800">
            <p>{t.securityNotice}</p>
            <p className="mt-1">{t.securityNoticeDetails}</p>
          </div>
        </div>

        {/* ❌ Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* ✅ Success Message */}
        {submitted ? (
          <div className="bg-green-100 border border-green-300 p-6 rounded-xl text-center space-y-4">
            <CheckCircle className="text-green-600 mx-auto" size={40} />
            <h2 className="text-xl font-semibold text-green-800">
              {t.reportSubmittedTitle}
            </h2>
            <p className="text-green-700 text-sm">
              {t.reportSubmittedMessage}
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
              {t.fraudCategoryLabel}
            </label>
            <select 
              value={fraudType}
              onChange={(e) => setFraudType(e.target.value)}
              required
              className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none">
              <option value="">Select a category</option>
              {t.fraudOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {t.describeLabel}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              placeholder={t.descriptionPlaceholder}
              className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none"
            />
          </div>

          {/* Upload Evidence */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {t.uploadEvidenceLabel}
            </label>
            <div className="flex items-center gap-3 border border-dashed border-input p-4 rounded-lg">
              <Upload size={20} className="text-muted-foreground" />
              <input 
                type="file" 
                onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                className="text-sm" 
              />
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {t.urgencyLabel}
            </label>
            <select 
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
              className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none">
              <option value="">Select urgency</option>
              {t.urgencyOptions.map((u) => (
                <option key={u}>{u}</option>
              ))}
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
              {t.submitAnonymously}
            </label>
          </div>

          {/* Contact Info (Hidden if Anonymous) */}
          {!anonymous && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t.contactLabel}
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full border border-input rounded-lg p-3 bg-background focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {isLoading ? "Submitting..." : t.submitReportButton}
          </button>

        </form>
        )}

      </div>
    </Layout>
  );
};

export default ReportFraudPage;