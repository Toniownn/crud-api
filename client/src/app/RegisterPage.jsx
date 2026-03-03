import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../lib/auth-store";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Container } from "../components/layout/Container";
import { SITE_NAME } from "../lib/constants";

export function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  function validate() {
    const next = {};
    if (!firstName.trim()) next.firstName = "First name is required";
    if (!lastName.trim()) next.lastName = "Last name is required";
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match";
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
      await api("/api/auth/register", {
        method: "POST",
        body: { fname: firstName, lname: lastName, address: "", username: email, password },
      });
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { username: email, password },
      });
      setAuth(data.token, data.customer);
      navigate("/");
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
              Create an account
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Join {SITE_NAME} to track orders, save favorites, and check out faster.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                name="firstName"
                autoComplete="given-name"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={errors.firstName}
              />
              <Input
                label="Last name"
                name="lastName"
                autoComplete="family-name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={errors.lastName}
              />
            </div>

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
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-sm border-border accent-brand"
                />
                Show password
              </label>
            </div>

            <Input
              label="Confirm password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-xs leading-relaxed text-text-muted">
              By creating an account you agree to our{" "}
              <Link to="/terms" className="text-brand hover:text-brand-dark">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-brand hover:text-brand-dark">Privacy Policy</Link>.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand transition-colors duration-fast hover:text-brand-dark"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
