import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/Badge";
import { PriceDisplay } from "./PriceDisplay";

export function ProductCard({ product, size = "default", className }) {
  return (
    <article className={cn("group", className)}>
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-sm bg-surface-raised" style={{ aspectRatio: "4 / 5" }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-normal ease-out group-hover:scale-105"
          />
          {product.badge && (
            <div className="absolute left-3 top-3">
              <Badge>{product.badge}</Badge>
            </div>
          )}
        </div>
        <div className={cn("mt-3", size === "large" && "mt-4")}>
          <h3
            className={cn(
              "font-body font-medium text-text-primary",
              size === "large" ? "text-lg" : "text-sm",
            )}
          >
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs text-text-muted">{product.category}</p>
          <PriceDisplay
            price={product.price}
            className={cn("mt-1 block", size === "large" ? "text-base" : "text-sm")}
          />
        </div>
      </Link>
    </article>
  );
}
