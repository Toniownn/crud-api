import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { cn } from "../lib/cn";
import { api } from "../lib/api";
import { useAuthStore } from "../lib/auth-store";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Container } from "../components/layout/Container";
import { SITE_NAME } from "../lib/constants";

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { username: email, password },
      });
      setAuth(data.token, data.customer);
      navigate(redirect);
    } catch (err) {
      setErrors({ email: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-sm">
          <div className="text-left">
            <h1 className="font-display text-3xl tracking-tight text-text-primary">
              Sign in
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Welcome back to {SITE_NAME}. Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <div>
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-text-secondary">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="h-3.5 w-3.5 rounded-sm border-border accent-brand"
                  />
                  Show password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-brand transition-colors duration-fast hover:text-brand-dark"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brand transition-colors duration-fast hover:text-brand-dark"
            >
              Create one
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
