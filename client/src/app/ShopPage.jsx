import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { cn } from "../lib/cn";
import { formatPrice } from "../lib/format";
import { useCartStore } from "../lib/cart-store";
import { useAuthStore } from "../lib/auth-store";
import { api, normalizeProduct } from "../lib/api";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Container } from "../components/layout/Container";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShopProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!token) {
      navigate(`/login?redirect=/shop`);
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4 / 5" }}>
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-normal ease-out group-hover:scale-105"
          />
        </Link>
        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge>{product.badge}</Badge>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/50 to-transparent p-3 pt-10 transition-transform duration-normal ease-out group-hover:translate-y-0">
          <Button
            size="sm"
            className={cn(
              "w-full",
              added && "bg-success hover:bg-success",
            )}
            onClick={handleAdd}
          >
            {added ? (
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon /> Added
              </span>
            ) : (
              "Add to cart"
            )}
          </Button>
        </div>
      </div>
      <Link to={`/products/${product.slug}`} className="mt-3 block">
        <h3 className="text-sm font-medium text-text-primary">{product.name}</h3>
        <p className="mt-0.5 text-xs text-text-muted">{product.category}</p>
        <span className="mt-1 block text-sm tabular-nums text-text-primary">
          {formatPrice(product.price)}
        </span>
      </Link>
    </article>
  );
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState([]);
  const [categoryNames, setCategoryNames] = useState(["All"]);

  useEffect(() => {
    api("/api/products/categories")
      .then((cats) => setCategoryNames(["All", ...cats]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (query.trim()) params.set("search", query);
    params.set("limit", "50");
    api(`/api/products/catalog?${params}`)
      .then((data) => setProducts(data.products.map(normalizeProduct)))
      .catch(() => setProducts([]));
  }, [activeCategory, query]);

  function handleCategoryClick(name) {
    const slug = name === "All" ? "all" : name.toLowerCase();
    const next = new URLSearchParams(searchParams);
    if (slug === "all") {
      next.delete("category");
    } else {
      next.set("category", slug);
    }
    setSearchParams(next);
  }

  function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set("q", value);
    } else {
      next.delete("q");
    }
    setSearchParams(next, { replace: true });
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl tracking-tight text-text-primary sm:text-4xl">
            Shop
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Browse our full catalog. Search, filter by category, and add to cart.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mt-8 max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={handleSearch}
            placeholder="Search products..."
            className="min-h-11 w-full rounded-sm border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-colors duration-fast focus:border-brand"
          />
        </div>

        {/* Category filter pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categoryNames.map((name) => {
            const slug = name === "All" ? "all" : name.toLowerCase();
            const isActive = activeCategory === slug;
            return (
              <button
                key={name}
                onClick={() => handleCategoryClick(name)}
                className={cn(
                  "min-h-9 rounded-sm px-4 py-1.5 text-sm font-medium transition-colors duration-fast",
                  isActive
                    ? "bg-brand text-white"
                    : "border border-border text-text-secondary hover:border-brand hover:text-brand",
                )}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-text-muted">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3 className="text-lg font-medium text-text-primary">No products found</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Try a different search term or category.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setQuery("");
                setSearchParams({});
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
