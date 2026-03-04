import { ReactNode, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AnalyzerModal from "./AnalyzerModal";
import { Lang } from "@/lib/translations";

interface LayoutProps {
  children: ReactNode;
  lang: Lang;
  onToggleLang: () => void;
}

const Layout = ({ children, lang, onToggleLang }: LayoutProps) => {
  const [isAnalyzerOpen, setAnalyzerOpen] = useState(false);

  const openAnalyzer = () => setAnalyzerOpen(true);
  const closeAnalyzer = () => setAnalyzerOpen(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} onToggleLang={onToggleLang} onAnalyzeClick={openAnalyzer} />
      <main className="flex-1">
        {children}
      </main>
      <AnalyzerModal isOpen={isAnalyzerOpen} onClose={closeAnalyzer} />
      <Footer lang={lang} />
    </div>
  );
};

export default Layout;
