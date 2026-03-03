import { Link } from "react-router-dom";
import { SITE_NAME } from "../../lib/constants";
import { Container } from "./Container";

const FOOTER_LINKS = {
  Shop: [
    { label: "New Releases", href: "/new-releases" },
    { label: "Bestsellers", href: "/products?sort=popular" },
    { label: "Deals", href: "/products?sale=true" },
    { label: "Gift Cards", href: "/gift-cards" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Support: [
    { label: "FAQs", href: "/faq" },
    { label: "Shipping", href: "/shipping" },
    { label: "Warranty", href: "/warranty" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0f0e0d] text-neutral-400">
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-xl text-white">{SITE_NAME}</span>
            <p className="mt-3 text-sm leading-relaxed">
              Premium tech and gadgets for the modern lifestyle. Cutting-edge
              innovation, everyday performance.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                {title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm transition-colors duration-fast hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-800 py-6">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
