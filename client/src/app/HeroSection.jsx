import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { HERO } from "../lib/mock-data";

export function HeroSection() {
  return (
    <section className="relative">
      <div className="aspect-[16/9] md:aspect-[21/9]">
        <img
          src={HERO.image}
          alt=""
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 md:pb-16 lg:px-8">
          <div className="max-w-lg">
            <h1 className="font-display text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {HERO.heading.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base md:text-lg">
              {HERO.subheading}
            </p>
            <div className="mt-5 sm:mt-6 md:mt-8">
              <Link to={HERO.cta.href}>
                <Button size="lg" className="bg-white text-neutral-950 hover:bg-white/90">
                  {HERO.cta.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
