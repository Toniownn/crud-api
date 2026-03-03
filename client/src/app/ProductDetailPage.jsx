import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/cn";
import { formatPrice } from "../lib/format";
import { useCartStore } from "../lib/cart-store";
import { useAuthStore } from "../lib/auth-store";
import { api, normalizeProduct } from "../lib/api";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Container } from "../components/layout/Container";

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const token = useAuthStore((s) => s.token);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    const searchTerms = slug.replace(/-/g, " ");
    api(`/api/products/catalog?search=${encodeURIComponent(searchTerms)}&limit=50`)
      .then((data) => {
        const all = data.products.map(normalizeProduct);
        const match = all.find((p) => p.slug === slug);
        setProduct(match || null);
        if (match) {
          api(`/api/products/catalog?category=${encodeURIComponent(match.category)}&limit=5`)
            .then((relData) => {
              setRelated(
                relData.products
                  .map(normalizeProduct)
                  .filter((p) => p.id !== match.id)
                  .slice(0, 4),
              );
            })
            .catch(() => {});
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex items-center justify-center py-16">
            <span className="text-sm text-text-muted">Loading...</span>
          </div>
        </Container>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="font-display text-2xl text-text-primary">Product not found</h1>
            <p className="mt-2 text-sm text-text-secondary">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/shop">
              <Button variant="outline" className="mt-6">Back to shop</Button>
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  function handleAddToCart() {
    if (!token) {
      navigate(`/login?redirect=/products/${slug}`);
      return;
    }
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    if (!token) {
      navigate(`/login?redirect=/products/${slug}`);
      return;
    }
    addItem(product, quantity);
    navigate("/cart");
  }

  return (
    <section className="py-10 sm:py-14 md:py-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-text-muted">
          <Link to="/shop" className="transition-colors duration-fast hover:text-text-primary">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category.toLowerCase()}`}
            className="transition-colors duration-fast hover:text-text-primary"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Image */}
          <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4 / 5" }}>
            <img
              src={product.image}
              alt={product.name}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <div className="absolute left-4 top-4">
                <Badge>{product.badge}</Badge>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-sm font-medium uppercase tracking-wider text-text-muted">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-2xl tracking-tight text-text-primary sm:text-3xl md:text-4xl">
              {product.name}
            </h1>
            <span className="mt-3 text-2xl tabular-nums text-text-primary">
              {formatPrice(product.price)}
            </span>

            <p className="mt-6 text-sm leading-relaxed text-text-secondary">
              Premium quality {product.category.toLowerCase()} built to last. Designed with
              precision engineering and modern aesthetics for everyday use. Ships free on
              orders over $99.
            </p>

            {/* Quantity selector */}
            <div className="mt-8">
              <span className="text-sm font-medium text-text-primary">Quantity</span>
              <div className="mt-2 inline-flex items-center border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center text-text-secondary transition-colors duration-fast hover:text-text-primary disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon />
                </button>
                <span className="min-w-12 text-center text-sm tabular-nums text-text-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center text-text-secondary transition-colors duration-fast hover:text-text-primary disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className={cn(
                  "flex-1",
                  added && "bg-success hover:bg-success",
                )}
                onClick={handleAddToCart}
              >
                {added ? (
                  <span className="inline-flex items-center gap-2">
                    <CheckIcon /> Added to cart
                  </span>
                ) : (
                  "Add to cart"
                )}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1"
                onClick={handleBuyNow}
              >
                Buy now
              </Button>
            </div>

            {/* Features */}
            <div className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
              {[
                { label: "Free shipping", detail: "On orders over $99" },
                { label: "1-year warranty", detail: "Full manufacturer coverage" },
                { label: "Easy returns", detail: "30-day return window" },
                { label: "Secure checkout", detail: "Encrypted payment" },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-sm font-medium text-text-primary">{item.label}</span>
                  <p className="text-xs text-text-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-12 sm:mt-20 sm:pt-16">
            <h2 className="font-display text-xl tracking-tight text-text-primary sm:text-2xl">
              You may also like
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group">
                  <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4 / 5" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-normal ease-out group-hover:scale-105"
                    />
                    {p.badge && (
                      <div className="absolute left-3 top-3">
                        <Badge>{p.badge}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-text-primary">{p.name}</h3>
                    <span className="mt-1 block text-sm tabular-nums text-text-primary">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
