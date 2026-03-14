import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />

      {/* CTA */}
      <section className="py-32 px-4 relative">
        <div className="glow-blob w-[400px] h-[400px] top-0 left-1/2 -translate-x-1/2 opacity-15" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            Ready to <span className="gradient-text">get started</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Join thousands of teams already using Collance to streamline their freelance workflows.
          </p>
          <Link to="/signup" className="gradient-btn px-8 py-4 rounded-xl text-lg font-semibold inline-block">
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-heading font-bold gradient-text">Collance</span>
          <p className="text-sm text-muted-foreground">© 2026 Collance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
