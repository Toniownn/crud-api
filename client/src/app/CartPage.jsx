import { Link } from "react-router-dom";
import { useCartStore } from "../lib/cart-store";
import { formatPrice } from "../lib/format";
import { cn } from "../lib/cn";
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

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function CartLineItem({ item }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { product, quantity } = item;
  const lineTotal = { amount: product.price.amount * quantity, currency: product.price.currency };

  return (
    <div className="flex gap-4 border-b border-border py-6 first:pt-0 last:border-b-0 sm:gap-6">
      <Link to={`/products/${product.slug}`} className="shrink-0">
        <div className="h-24 w-20 overflow-hidden rounded-sm sm:h-32 sm:w-28" style={{ aspectRatio: "4 / 5" }}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link to={`/products/${product.slug}`}>
              <h3 className="text-sm font-medium text-text-primary sm:text-base">{product.name}</h3>
            </Link>
            <p className="mt-0.5 text-xs text-text-muted">{product.category}</p>
            <p className="mt-1 text-sm tabular-nums text-text-secondary">{formatPrice(product.price)}</p>
          </div>
          <span className="shrink-0 text-sm font-medium tabular-nums text-text-primary sm:text-base">
            {formatPrice(lineTotal)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1}
              className={cn(
                "flex min-h-9 min-w-9 items-center justify-center rounded-sm border border-border transition-colors duration-fast",
                quantity <= 1 ? "text-text-muted" : "text-text-primary hover:border-brand hover:text-brand",
              )}
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </button>
            <span className="min-w-10 text-center text-sm font-medium tabular-nums text-text-primary">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="flex min-h-9 min-w-9 items-center justify-center rounded-sm border border-border text-text-primary transition-colors duration-fast hover:border-brand hover:text-brand"
              aria-label="Increase quantity"
            >
              <PlusIcon />
            </button>
          </div>
          <button
            onClick={() => removeItem(product.id)}
            className="flex min-h-11 min-w-11 items-center justify-center text-text-muted transition-colors duration-fast hover:text-error"
            aria-label={`Remove ${product.name} from cart`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ items }) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price.amount * item.quantity,
    0,
  );
  const currency = items[0]?.product.price.currency || "USD";
  const shippingThreshold = 9900;
  const freeShipping = subtotal >= shippingThreshold;

  return (
    <div className="rounded-sm border border-border bg-surface-alt p-6">
      <h2 className="font-display text-lg tracking-tight text-text-primary">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-secondary">Subtotal</dt>
          <dd className="font-medium tabular-nums text-text-primary">
            {formatPrice({ amount: subtotal, currency })}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-secondary">Shipping</dt>
          <dd className={cn("font-medium", freeShipping ? "text-success" : "text-text-primary")}>
            {freeShipping ? "Free" : "Calculated at checkout"}
          </dd>
        </div>
      </dl>

      {!freeShipping && (
        <p className="mt-3 text-xs text-text-muted">
          Add {formatPrice({ amount: shippingThreshold - subtotal, currency })} more for free shipping.
        </p>
      )}

      <div className="mt-5 flex justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-text-primary">Total</span>
        <span className="font-display text-lg font-medium tabular-nums text-text-primary">
          {formatPrice({ amount: subtotal, currency })}
        </span>
      </div>

      <Button className="mt-6 w-full" size="lg">
        Checkout
      </Button>

      <p className="mt-3 text-center text-xs text-text-muted">
        Taxes calculated at checkout
      </p>
    </div>
  );
}

export function CartPage() {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20">
        <Container>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-text-muted">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h1 className="font-display text-2xl tracking-tight text-text-primary">Your cart is empty</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex min-h-11 items-center justify-center border border-border px-6 py-2.5 text-sm font-medium text-text-primary transition-colors duration-fast hover:bg-surface-alt"
            >
              Continue shopping
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-3xl tracking-tight text-text-primary sm:text-4xl">
            Cart
          </h1>
          <span className="text-sm text-text-muted">
            {items.reduce((s, i) => s + i.quantity, 0)} items
          </span>
        </div>

        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Line items */}
          <div className="lg:col-span-7">
            {items.map((item) => (
              <CartLineItem key={item.product.id} item={item} />
            ))}
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors duration-fast hover:text-brand-dark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Continue shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:col-span-5 lg:mt-0">
            <div className="lg:sticky lg:top-8">
              <OrderSummary items={items} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
