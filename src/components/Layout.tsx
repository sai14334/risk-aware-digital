import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Lang } from "@/lib/translations";

interface LayoutProps {
  children: ReactNode;
  lang: Lang;
  onToggleLang: () => void;
}

const Layout = ({ children, lang, onToggleLang }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} onToggleLang={onToggleLang} />
      <main className="flex-1">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
};

export default Layout;
