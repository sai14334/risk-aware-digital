"use client";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Phishing Email Scam",
    description:
      "Fraudsters send fake emails pretending to be banks. Never click unknown links.",
  },
  {
    title: "OTP Sharing Fraud",
    description:
      "Banks never ask for your OTP. Sharing OTP can empty your account instantly.",
  },
  {
    title: "Fake Job Offers",
    description:
      "Scammers ask for registration fees for fake jobs. Genuine companies never charge money.",
  },
  {
    title: "Loan App Harassment",
    description:
      "Avoid downloading unknown loan apps. They misuse personal data and threaten users.",
  },
];

export default function CarouselSection() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-blue-50 py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="relative bg-white rounded-2xl shadow-lg p-10 transition-all duration-700 ease-in-out">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            {slides[current].title}
          </h2>

          <p className="text-gray-600 text-lg">
            {slides[current].description}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 gap-3">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full cursor-pointer transition-all ${
                current === index
                  ? "bg-blue-600 scale-110"
                  : "bg-blue-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}