import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/cn";
import { api } from "../lib/api";
import { Skeleton } from "../components/ui/Skeleton";
import { Container } from "../components/layout/Container";

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const names = await api("/api/products/categories");
        const withImages = await Promise.all(
          names.map(async (name) => {
            try {
              const data = await api(
                `/api/products/catalog?category=${encodeURIComponent(name)}&limit=1`,
              );
              const image = data.products?.[0]?.image_url || null;
              const count = data.total || 0;
              return { name, slug: name.toLowerCase(), image, count };
            } catch {
              return { name, slug: name.toLowerCase(), image: null, count: 0 };
            }
          }),
        );
        setCategories(withImages);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

        {loading && (
          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="aspect-[3/2] rounded-sm" />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-sm border border-error/30 bg-error/5 p-5 text-sm text-error">
            <p>Failed to load categories: {error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="mt-10 py-10 text-center text-sm text-text-muted">
            No categories found.
          </p>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {categories.map((category, i) => (
              <Link
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                className={cn(
                  "group relative overflow-hidden rounded-sm",
                  i === 0 && "sm:col-span-2 lg:col-span-2",
                )}
              >
                <div style={{ aspectRatio: i === 0 ? "2 / 1" : "3 / 2" }}>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition-transform duration-normal ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-surface-raised" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-normal group-hover:from-black/80" />
                </div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                  <h2 className={cn(
                    "font-display font-semibold tracking-tight text-white",
                    i === 0 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                  )}>
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    {category.count} {category.count === 1 ? "product" : "products"}
                  </p>
                </div>
                <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-opacity duration-fast group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
