import Layout from "@/components/Layout";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

const ReportingGuide = ({ lang = "en" as Lang }) => {
  const t = translations[lang];

  return (
    <Layout lang={lang} onToggleLang={() => {}}>
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Live Cybercrime Reporting Guide</h1>
        <p className="text-sm text-muted-foreground">Use this guide to report cybercrimes quickly and safely.</p>

        <div className="govt-card">
          <h2 className="text-lg font-semibold mb-2">Quick Steps</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Do not respond to the sender or click any links.</li>
            <li>Collect screenshots and the message text.</li>
            <li>Note the sender's number and any transaction IDs.</li>
            <li>Contact your bank or service provider immediately if money was involved.</li>
            <li>Use the National Cyber Crime Helpline: 1930 to file an official complaint.</li>
          </ol>
        </div>

        <div className="govt-card">
          <h2 className="text-lg font-semibold mb-2">What to include in your report</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Full message text (copy/paste).</li>
            <li>Sender's number and time of message.</li>
            <li>Any links, transaction references or UPI IDs.</li>
            <li>Screenshots of the message and any follow-ups.</li>
          </ul>
        </div>

        <div className="govt-card">
          <h2 className="text-lg font-semibold mb-2">Emergency contact</h2>
          <p className="text-sm font-bold">{t.helplineNumber} — {t.helpline}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ReportingGuide;
