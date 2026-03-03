import { Link } from "react-router-dom";
import { Container } from "../components/layout/Container";
import { CATEGORIES } from "../lib/mock-data";

export function CategoriesPage() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl tracking-tight text-text-primary sm:text-4xl">
            Categories
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Browse by category to find exactly what you need.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-sm"
            >
              <div style={{ aspectRatio: "3 / 2" }}>
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-normal ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                <h2 className="font-display text-lg text-white sm:text-xl">
                  {category.name}
                </h2>
                <p className="mt-0.5 text-sm text-white/70">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
