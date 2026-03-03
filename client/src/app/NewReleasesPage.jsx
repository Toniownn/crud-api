import { useState, useEffect } from "react";
import { Container } from "../components/layout/Container";
import { ProductCard } from "../components/commerce/ProductCard";
import { api, normalizeProduct } from "../lib/api";

export function NewReleasesPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api("/api/products/catalog?limit=8")
      .then((data) => setProducts(data.products.map(normalizeProduct)))
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl tracking-tight text-text-primary sm:text-4xl">
            New Releases
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            The latest tech just landed. Be the first to get your hands on our newest arrivals.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              size={index === 0 ? "large" : "default"}
              className={index === 0 ? "col-span-2 row-span-2" : undefined}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
