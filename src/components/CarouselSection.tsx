"use client";
import { useEffect, useState } from "react";

interface Slide {
  tag: string;
  title: string;
  description: string;
  icon: string;
  stat: string;
  statLabel: string;
}

const slides: Slide[] = [
  {
    tag: "Email Threat",
    title: "Phishing Email Scam",
    description:
      "Fraudsters send fake emails pretending to be your bank or government. Never click unknown links — always visit official sites directly.",
    icon: "📧",
    stat: "3.4B",
    statLabel: "phishing emails sent daily",
  },
  {
    tag: "Identity Theft",
    title: "OTP Sharing Fraud",
    description:
      "Your One-Time Password is the last line of defence. Never share OTPs with anyone, even if they claim to be support.",
    icon: "🔐",
    stat: "₹1.25L",
    statLabel: "avg loss per OTP fraud victim",
  },
  {
    tag: "Job Scam",
    title: "Fake Job Offers",
    description:
      "No legitimate employer asks for money upfront. Verify every offer through official channels.",
    icon: "💼",
    stat: "68%",
    statLabel: "job scam victims are under 35",
  },
  {
    tag: "App Fraud",
    title: "Loan App Harassment",
    description:
      "Predatory apps promise instant loans but harvest your personal data. Only use RBI-registered lenders.",
    icon: "📱",
    stat: "500+",
    statLabel: "illegal loan apps removed in 2024",
  },
];

const DURATION = 5000;
const BG =
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80&fit=crop";

export default function CarouselSection() {
  const [current, setCurrent] = useState<number>(0);
  const [animKey, setAnimKey] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const goTo = (index: number) => {
    setCurrent(index);
    setAnimKey((k) => k + 1);
    setProgress(0);
  };

  const next = (): void => goTo((current + 1) % slides.length);

  useEffect(() => {
    const t = setInterval(next, DURATION);
    return () => clearInterval(t);
  }, [current]);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const t = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / DURATION) * 100, 100));
    }, 30);
    return () => clearInterval(t);
  }, [current]);

  const s: Slide = slides[current];

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden py-16"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onMouseEnter={next}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/90 via-blue-50/80 to-blue-100/90 z-10" />

      {/* Inner Card with rounded corners */}
      <div
        key={animKey}
        className="relative z-20 w-full max-w-7xl mx-6 md:mx-12 flex flex-col md:flex-row items-center justify-between gap-10 bg-white/80 p-8 shadow-xl rounded-xl"
        style={{
          transform: "translateY(20px)",
          animation: "slideInFade 0.6s forwards",
        }}
      >
        {/* Left: Text */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left gap-4">
          <span className="inline-block text-xs md:text-sm font-mono font-medium text-blue-600 bg-white/70 px-4 py-1 border border-blue-200 rounded-lg">
            ⚑ Fraud Awareness · Stay Protected
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-blue-900">
            {s.title}
          </h2>
          <p className="text-gray-700 md:text-lg">{s.description}</p>
        </div>

        {/* Right: Icon + Stats with rounded corners */}
        <div className="flex-1 relative bg-gradient-to-tr from-blue-600 to-blue-400 p-6 flex flex-col items-center gap-4 shadow-lg overflow-hidden rounded-lg">
          <span className="text-5xl animate-bounce">{s.icon}</span>
          <div className="text-white text-3xl md:text-4xl font-bold">{s.stat}</div>
          <p className="text-white/80 text-sm md:text-base text-center">{s.statLabel}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-6 left-6 right-6 h-2 bg-blue-200/50 overflow-hidden rounded-full">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Slide-in animation */}
      <style>
        {`
          @keyframes slideInFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}