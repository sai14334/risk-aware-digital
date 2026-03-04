import { useEffect, useState, useRef } from "react";

interface Slide {
  title?: string;
  subtitle?: string;
  image?: string; // optional image url
}

interface CarouselProps {
  slides: Slide[];
  autoplay?: boolean;
  interval?: number;
}

const Carousel = ({ slides, autoplay = true, interval = 4000 }: CarouselProps) => {
  const [idx, setIdx] = useState(0);
  const count = slides.length;
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!autoplay || count <= 1) return;
    timer.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % count);
    }, interval);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [autoplay, interval, count]);

  const prev = () => setIdx((i) => (i - 1 + count) % count);
  const next = () => setIdx((i) => (i + 1) % count);

  if (count === 0) return null;

  return (
    <div className="govt-card relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Highlights</div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="rounded px-2 py-1 hover:bg-muted/50">Prev</button>
          <button onClick={next} className="rounded px-2 py-1 hover:bg-muted/50">Next</button>
        </div>
      </div>

      <div className="w-full h-44 sm:h-56 relative">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-500 ${i === idx ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}`}
          >
            <div className="h-full w-full flex flex-col sm:flex-row items-center gap-4 p-4">
              {s.image && (
                <div className="hidden sm:block w-40 h-28 bg-cover bg-center rounded" style={{ backgroundImage: `url(${s.image})` }} />
              )}
              <div className="flex-1">
                {s.title && <div className="text-lg font-bold text-foreground">{s.title}</div>}
                {s.subtitle && <div className="text-sm text-muted-foreground mt-1">{s.subtitle}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full ${i === idx ? "bg-foreground" : "bg-muted"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
