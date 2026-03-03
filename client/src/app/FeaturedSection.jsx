import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/layout/Container";
import { ProductCard } from "../components/commerce/ProductCard";
import { api, normalizeProduct } from "../lib/api";

export function FeaturedSection() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api("/api/products/catalog?limit=5")
      .then((data) => setFeatured(data.products.map(normalizeProduct)))
      .catch(() => {});
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24">
      <Container>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-tight text-text-primary sm:text-3xl">
            Featured pieces
          </h2>
          <Link
            to="/new-releases"
            className="text-sm font-medium text-brand transition-colors duration-fast hover:text-brand-dark"
          >
            View all
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 md:grid-cols-4 md:gap-6">
          <div className="col-span-2 row-span-2">
            <ProductCard product={featured[0]} size="large" />
          </div>
          {featured.slice(1).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
