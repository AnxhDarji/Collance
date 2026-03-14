import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Product", href: "#product" },
  { label: "Pricing", href: "#pricing" },
];

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`floating-nav max-w-5xl w-[calc(100%-2rem)] transition-all duration-300 ${
        scrolled ? "shadow-[var(--shadow-glow-sm)]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <Link to="/" className="font-heading text-xl font-bold gradient-text">
          Collance
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/signin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link to="/signup" className="gradient-btn px-4 py-2 text-sm">
            Start Free
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 pb-2">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground">
            Sign In
          </Link>
          <Link to="/signup" className="gradient-btn px-4 py-2 text-sm text-center">
            Start Free
          </Link>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
